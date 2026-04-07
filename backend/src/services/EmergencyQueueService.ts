import { EmergencyQueueRepository, PatientRepository } from '../repositories/Repositories'; 
import { MaxHeap } from '../utils/MaxHeap';

export class EmergencyQueueService {
    private eqRepo = new EmergencyQueueRepository();
    private patientRepo = new PatientRepository();
    private heap = new MaxHeap<any>();

    constructor() {
        this.initializeHeap();
    }

    private async initializeHeap() {
        try {
            const pending = await this.eqRepo.findPending();
            pending.forEach(item => this.heap.push(item));
        } catch (e: any) {
            console.warn('⚠️  Emergency queue table not ready yet, skipping heap init:', e.message);
        }
    }

    async enqueue(patientId: string, severity: number, reason: string) {
        let finalPatientId = patientId;

        // Validation & Auto-creation
        try {
            const patient = await this.patientRepo.findById(patientId);
            if (!patient) {
                // If patientId is a name (e.g., 'nj88'), create a new record
                const newPatient = await this.patientRepo.create({
                    name: patientId, // Use the input as the name
                    age: 30, // Default
                    gender: 'UNKNOWN',
                    status: 'WAITING',
                    severity
                });
                finalPatientId = newPatient.id;
            }
        } catch (e) {
            // If findById fails (e.g., invalid UUID format), create a new record
            const newPatient = await this.patientRepo.create({
                name: patientId,
                age: 30,
                gender: 'UNKNOWN',
                status: 'WAITING',
                severity
            });
            finalPatientId = newPatient.id;
        }

        const eqItem = await this.eqRepo.create({
            patientId: finalPatientId,
            severity,
            reason,
            status: 'QUEUED'
        });
        
        this.heap.push(eqItem);
        
        // Update patient status
        await this.patientRepo.update(finalPatientId, { 
            status: 'WAITING',
            severity 
        });
        
        return eqItem;
    }

    async processNext() {
        const next = this.heap.pop();
        if (!next) return null;

        await this.eqRepo.update(next.id, { 
            status: 'PROCESSED',
            processedAt: new Date()
        });

        return next;
    }

    getQueue() {
        return this.heap.getAll(); 
    }
}
