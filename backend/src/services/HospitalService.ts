import { prisma } from '../config/prisma.js';

export class HospitalService {

    // Haversine formula to calculate distance in km
    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    async findNearby(lat: number, lng: number, radiusKm: number = 5000) {
        const allHospitals = await prisma.hospital.findMany();
        
        const nearby = allHospitals
            .map((h: any) => ({
                ...h,
                distance: this.calculateDistance(lat, lng, h.lat, h.lng)
            }))
            .filter((h: any) => h.distance <= radiusKm)
            .sort((a: any, b: any) => a.distance - b.distance);

        return nearby;
    }

    async getAllDoctors() {
        return await prisma.doctor.findMany({
            include: {
                user: { select: { firstName: true, lastName: true } },
                hospital: { select: { name: true, address: true } }
            }
        });
    }

    async getHospitalDoctors(hospitalId: string) {
        return await prisma.doctor.findMany({
            where: { hospitalId },
            include: {
                user: { select: { firstName: true, lastName: true } },
                hospital: { select: { name: true, address: true } }
            }
        });
    }

    async getDoctorById(docId: string) {
        return await prisma.doctor.findUnique({
            where: { id: docId },
            include: {
                user: { select: { firstName: true, lastName: true } },
                hospital: { select: { name: true, address: true } }
            }
        });
    }
}
