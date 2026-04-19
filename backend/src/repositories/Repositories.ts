import { prisma } from '../config/prisma.js';

export class PatientRepository {
    async findById(id: string) {
        return await prisma.patient.findUnique({ where: { id } });
    }
    async findAll() {
        return await prisma.patient.findMany();
    }
    async create(data: any) {
        return await prisma.patient.create({ data });
    }
    async update(id: string, data: any) {
        return await prisma.patient.update({ where: { id }, data });
    }
}

export class BedRepository {
    async findById(id: string) {
        return await prisma.bed.findUnique({ where: { id } });
    }
    async findAvailable(type?: 'ICU' | 'GENERAL') {
        return await prisma.bed.findMany({
            where: {
                isOccupied: false,
                type: type
            }
        });
    }
    async update(id: string, data: any) {
        return await prisma.bed.update({ where: { id }, data });
    }
}

export class DoctorRepository {
    async findById(id: string) {
        return await prisma.doctor.findUnique({ where: { id } });
    }
    async findAvailableBySpeciality(spec: string) {
        return await prisma.doctor.findMany({
            where: {
                speciality: spec,
                isAvailable: true
            }
        });
    }
    async findAll() {
        return await prisma.doctor.findMany({
            include: { user: true, hospital: true }
        });
    }
}

export class AppointmentRepository {
    async findById(id: string) {
        return await prisma.appointment.findUnique({ where: { id } });
    }
    async findByDoctorWithinRange(doctorId: string, start: Date, end: Date) {
        return await prisma.appointment.findMany({
            where: {
                doctorId,
                scheduledAt: { lt: end },
                endsAt: { gt: start }
            }
        });
    }
    async findConflicts(doctorId: string, start: Date, end: Date) {
        return await prisma.appointment.findMany({
            where: {
                doctorId,
                status: 'SCHEDULED',
                scheduledAt: { lt: end },
                endsAt: { gt: start }
            }
        });
    }
    async create(data: any) {
        return await prisma.appointment.create({ data });
    }
}

export class EmergencyQueueRepository {
    async create(data: any) {
        return await prisma.emergencyQueue.create({ data });
    }
    async update(id: string, data: any) {
        return await prisma.emergencyQueue.update({ where: { id }, data });
    }
    async findPending() {
        return await prisma.emergencyQueue.findMany({
            where: { status: 'QUEUED' },
            orderBy: [
                { severity: 'desc' },
                { queuedAt: 'asc' }
            ]
        });
    }
}
