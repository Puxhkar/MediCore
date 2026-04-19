import { Request, Response } from 'express';
import { EmergencyQueueService } from '../services/EmergencyQueueService.js';

// To avoid recreating heaps, use a singleton or exported instance if necessary.
// Here we will export a shared instance since heap state is in-memory.
export const sharedEmergencyQueueService = new EmergencyQueueService();

export class EmergencyController {
    static async enqueue(req: Request, res: Response) {
        try {
            const { patientId, severity, reason } = req.body;
            const item = await sharedEmergencyQueueService.enqueue(patientId, severity, reason);
            res.status(201).json(item);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async processNext(req: Request, res: Response) {
        try {
            const item = await sharedEmergencyQueueService.processNext();
            res.json(item || { message: 'Queue is empty' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getQueue(req: Request, res: Response) {
        try {
            const queue = sharedEmergencyQueueService.getQueue();
            res.json(queue);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
