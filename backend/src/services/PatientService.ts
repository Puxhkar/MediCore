import { PatientRepository } from '../repositories/Repositories';
import { prisma } from '../config/prisma';
import { AuditService } from './AuditService';

export class PatientService {
    private patientRepo = new PatientRepository();

    async registerPatient(data: any) {
        const patient = await prisma.patient.create({
            data: {
                ...data,
                status: 'REGISTERED'
            }
        });
        await AuditService.log('REGISTER_PATIENT', 'patient', patient.id, 'system', null, data);
        return patient;
    }

    async updateStatus(id: string, newStatus: any, performedBy: string = 'system') {
        const patient = await prisma.patient.findUnique({ where: { id } });
        if (!patient) throw new Error('Patient not found');

        // Note: PatientContext logic might need updates if it depends on specific types
        const updated = await prisma.patient.update({
            where: { id },
            data: { status: newStatus }
        });
        await AuditService.log('UPDATE_STATUS', 'patient', id, performedBy, { status: patient.status }, { status: newStatus });
        return updated;
    }

    async getAllPatients() {
        return await prisma.patient.findMany();
    }
}
