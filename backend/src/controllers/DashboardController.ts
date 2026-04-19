import { Request, Response } from 'express';
import { DashboardService } from '../services/DashboardService.js';

const dashboardService = new DashboardService();

export class DashboardController {
    static async getPatientMetrics(req: Request, res: Response) {
        try {
            const metrics = await dashboardService.getPatientMetrics(req.params.patientId as string);
            res.json(metrics);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAdminMetrics(req: Request, res: Response) {
        try {
            const metrics = await dashboardService.getAdminMetrics();
            res.json(metrics);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
