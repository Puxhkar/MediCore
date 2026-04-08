import { AppointmentRepository } from '../repositories/Repositories';
import { prisma } from '../config/prisma';

export class AppointmentService {
    private appointmentRepo = new AppointmentRepository();

    async scheduleAppointment(data: any) {
        const { patientId, doctorId, scheduledAt, durationMinutes, reason, notes, serviceType } = data;
        
        const start = new Date(scheduledAt);
        const end = new Date(start.getTime() + durationMinutes * 60000);

        // Check for conflicts
        const overlapping = await this.appointmentRepo.findByDoctorWithinRange(doctorId, start, end);
        if (overlapping && overlapping.length > 0) {
            throw new Error('Doctor already has an appointment during this time slot');
        }

        return await prisma.appointment.create({
            data: {
                patientId,
                doctorId,
                scheduledAt: start,
                endsAt: end,
                durationMinutes,
                reason,
                serviceType,
                notes,
                status: 'SCHEDULED',
                approvalStatus: 'PENDING'
            }
        });
    }

    async getAppointmentsForDoctor(doctorId: string) {
        return await prisma.appointment.findMany({
            where: { doctorId }
        });
    }

    async getPendingAppointments() {
        return await prisma.appointment.findMany({
            where: { approvalStatus: 'PENDING' }
        });
    }

    async updateApprovalStatus(appointmentId: string, status: 'APPROVED' | 'REJECTED') {
        await prisma.appointment.update({
            where: { id: appointmentId },
            data: { approvalStatus: status }
        });
            
        return { success: true, appointmentId, status };
    }
}
