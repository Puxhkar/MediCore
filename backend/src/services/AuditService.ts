import { prisma } from '../config/prisma.js';

export class AuditService {
    static async log(action: string, entityType: string, entityId: string, performedBy: string, oldValue?: any, newValue?: any, ipAddress?: string) {
        try {
            await prisma.auditLog.create({
                data: {
                    action,
                    entityType,
                    entityId,
                    performedBy,
                    oldValue: oldValue ? JSON.stringify(oldValue) : null,
                    newValue: newValue ? JSON.stringify(newValue) : null,
                    ipAddress
                }
            });
        } catch (error) {
            console.error('Failed to write audit log:', error);
            // Non-blocking
        }
    }
}
