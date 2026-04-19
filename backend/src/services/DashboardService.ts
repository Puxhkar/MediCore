import { prisma } from '../config/prisma.js';

export class DashboardService {

    async getPatientMetrics(patientId: string) {
        // Upcoming appointments
        const upcoming = await prisma.appointment.findMany({
            where: { patientId }
        });
            
        // Total Spend
        const totalBills = await prisma.bill.aggregate({
            _sum: {
                totalAmount: true
            },
            where: { patientId }
        });

        return {
            upcomingAppointments: upcoming,
            totalSpend: totalBills._sum.totalAmount || 0,
            checkupReminder: 'Annual Full Body Checkup due next month.'
        };
    }

    async getAdminMetrics() {
        const totalPatients = await prisma.patient.count();
        const totalAppointments = await prisma.appointment.count();
        const pendingAppointments = await prisma.appointment.count({
            where: { approvalStatus: 'PENDING' }
        });
        const availableBeds = await prisma.bed.count({
            where: { isOccupied: false }
        });

        return {
            totalPatients,
            totalAppointments,
            pendingAppointments,
            availableBeds
        };
    }
}
