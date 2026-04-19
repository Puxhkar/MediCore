import { Request, Response } from 'express';
import { AppointmentService } from '../services/AppointmentService.js';

const appointmentService = new AppointmentService();

export class AppointmentController {
    static async schedule(req: Request, res: Response) {
        try {
            const appointment = await appointmentService.scheduleAppointment(req.body);
            res.status(201).json(appointment);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getByDoctor(req: Request, res: Response) {
        try {
            const appointments = await appointmentService.getAppointmentsForDoctor(req.params.doctorId as string);
            res.json(appointments);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getPending(req: Request, res: Response) {
        try {
            const pending = await appointmentService.getPendingAppointments();
            res.json(pending);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateApproval(req: Request, res: Response) {
        try {
            const { status } = req.body;
            const result = await appointmentService.updateApprovalStatus(req.params.appointmentId as string, status);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
