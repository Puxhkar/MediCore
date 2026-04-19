import { prisma } from '../config/prisma';

export class UserRepository {
    async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    async findById(id: string) {
        return await prisma.user.findUnique({
            where: { id }
        });
    }

    async create(data: any) {
        return await prisma.user.create({
            data: {
              email: data.email,
              passwordHash: data.passwordHash,
              role: data.role,
              firstName: data.firstName,
              lastName: data.lastName,
              isActive: true
            }
        });
    }

    async delete(id: string) {
        return await prisma.user.delete({
            where: { id }
        });
    }
}
