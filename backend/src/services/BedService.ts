import { BedRepository, PatientRepository } from '../repositories/Repositories.js';
import { BedAllocator, ICUAllocationStrategy, GeneralAllocationStrategy } from '../patterns/strategy/BedAllocationStrategy.js';
import { prisma } from '../config/prisma.js';
import { AuditService } from './AuditService.js';
import { BillingService } from './BillingService.js';

export class BedService {
    private bedRepo = new BedRepository();
    private patientRepo = new PatientRepository();
    private billingService = new BillingService();

    async allocateBed(patientId: string, performedBy: string = 'system') {
        const patient = await prisma.patient.findUnique({ where: { id: patientId } });
        if (!patient) throw new Error('Patient not found');

        const availableBeds = await prisma.bed.findMany({ where: { isOccupied: false } });
        
        // Severity based strategy selection
        const strategy = patient.severity >= 7 
            ? new ICUAllocationStrategy() 
            : new GeneralAllocationStrategy();
        
        const allocator = new BedAllocator(strategy);
        const bed = allocator.executeAllocation(availableBeds, patient);

        if (!bed) {
            throw new Error('No suitable beds available');
        }

        // Transactionally mark bed occupied and assign to patient
        await prisma.bed.update({
            where: { id: bed.id },
            data: { isOccupied: true }
        });
        
        const updatedPatient = await prisma.patient.update({
            where: { id: patientId },
            data: { 
                bedId: bed.id,
                status: 'ADMITTED',
                admittedAt: new Date()
            }
        });

        await AuditService.log('ALLOCATE_BED', 'bed', bed.id, performedBy, { isOccupied: false }, { isOccupied: true });
        await AuditService.log('UPDATE_STATUS', 'patient', patientId, performedBy, { status: patient.status }, { status: 'ADMITTED' });

        return updatedPatient;
    }

    async releaseBed(patientId: string, performedBy: string = 'system') {
        const patient = await prisma.patient.findUnique({ where: { id: patientId } });
        if (!patient || !patient.bedId) return;

        await prisma.bed.update({
            where: { id: patient.bedId },
            data: { isOccupied: false }
        });
        
        const updatedPatient = await prisma.patient.update({
            where: { id: patientId },
            data: { 
                bedId: null, 
                status: 'DISCHARGED',
                dischargedAt: new Date()
            }
        });

        await AuditService.log('RELEASE_BED', 'bed', patient.bedId!, performedBy, { isOccupied: true }, { isOccupied: false });
        await AuditService.log('UPDATE_STATUS', 'patient', patientId, performedBy, { status: patient.status }, { status: 'DISCHARGED' });

        // Generate Bill
        const durationHours = patient.admittedAt ? Math.ceil((new Date().getTime() - new Date(patient.admittedAt).getTime()) / 3600000) : 1;
        const total = 1000 + (durationHours * 50); 
        await this.billingService.generateBill(patientId, total);

        return updatedPatient;
    }

    async getBedStats() {
        const beds = await prisma.bed.findMany();
        return {
            total: beds.length,
            occupied: beds.filter(b => b.isOccupied).length,
            icu: beds.filter(b => b.type === 'ICU' && !b.isOccupied).length,
            general: beds.filter(b => b.type === 'GENERAL' && !b.isOccupied).length
        };
    }
}
