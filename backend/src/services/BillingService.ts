import { prisma } from '../config/prisma.js';

export class BillingService {
    async generateBill(patientId: string, totalAmount: number) {
        return await prisma.bill.create({
            data: {
                patientId,
                totalAmount,
                status: 'PENDING'
            }
        });
    }

    async payBill(billId: string) {
        return await prisma.bill.update({
            where: { id: billId },
            data: {
                status: 'PAID',
                paidAt: new Date()
            }
        });
    }
}
