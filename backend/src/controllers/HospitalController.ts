import { Request, Response } from 'express';
import { PatientService } from '../services/PatientService';
import { BedService } from '../services/BedService';
import { HospitalService } from '../services/HospitalService';

const patientService = new PatientService();
const bedService = new BedService();
const hospitalService = new HospitalService();

export class HospitalController {
    
    // --- Hospital API ---
    static async getNearbyHospitals(req: Request, res: Response) {
        try {
            const { lat, lng, radius, city } = req.query;
            
            if (city) {
                const hospitalsByCity = await prisma.hospital.findMany({
                    where: { city: { contains: city as string } }
                });
                return res.json(hospitalsByCity);
            }

            if (!lat || !lng) return res.status(400).json({ error: 'Lat and Lng are required if no city is provided' });
            
            const hospitals = await hospitalService.findNearby(Number(lat), Number(lng), radius ? Number(radius) : 20);
            res.json(hospitals);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getHospitalDoctors(req: Request, res: Response) {
        try {
            const doctors = await hospitalService.getHospitalDoctors(req.params.hospitalId);
            res.json(doctors);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getSingleDoctor(req: Request, res: Response) {
        try {
            const doctor = await hospitalService.getDoctorById(req.params.docId);
            if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
            res.json(doctor);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllDoctors(req: Request, res: Response) {
        try {
            const docs = await hospitalService.getAllDoctors();
            res.json(docs);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // --- Legacy Patient API ---
    static async registerPatient(req: Request, res: Response) {
        try {
            const patient = await patientService.registerPatient(req.body);
            res.status(201).json(patient);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllPatients(req: Request, res: Response) {
        try {
            const patients = await patientService.getAllPatients();
            res.json(patients);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // --- Legacy Bed API ---
    static async allocateBed(req: Request, res: Response) {
        try {
            const result = await bedService.allocateBed(req.params.patientId);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getBedStats(req: Request, res: Response) {
        try {
            const stats = await bedService.getBedStats();
            res.json(stats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
