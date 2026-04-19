import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

export class DoctorLocationController {
  
  static async getDoctorLocations(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;

      const locations = await prisma.doctorLocation.findMany({
        where: {
          doctorId: doctorId as string,
          isActive: true
        }
      });

      const locationsWithStats = locations.map(location => ({
        ...location,
        patientsToday: 0,
        totalPatients: location.totalPatients || 0
      }));

      res.json(locationsWithStats);
    } catch (error) {
      console.error('Error fetching doctor locations:', error);
      res.json([]);
    }
  }

  static async addDoctorLocation(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      const { name, address, city, phone, fees, timings } = req.body;

      if (!name || !address || !city) {
        return res.status(400).json({ error: 'Name, address, and city are required' });
      }

      const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId as string }
      });

      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      const location = await prisma.doctorLocation.create({
        data: {
          doctorId: doctorId as string,
          name,
          address,
          city,
          phone: phone || null
        }
      });

      // Add additional fields for frontend compatibility
      const locationWithExtras = {
        ...location,
        fees: fees || 500,
        timings: timings || 'Mon-Fri: 9AM-5PM',
        patientsToday: 0
      };

      res.status(201).json(locationWithExtras);
    } catch (error) {
      console.error('Error adding doctor location:', error);
      res.status(500).json({ error: 'Failed to add location' });
    }
  }

  static async updateDoctorLocation(req: Request, res: Response) {
    try {
      const { locationId } = req.params;
      const { name, address, city, phone } = req.body;

      const location = await prisma.doctorLocation.update({
        where: { id: locationId as string },
        data: {
          name,
          address,
          city,
          phone
        }
      });

      res.json(location);
    } catch (error) {
      console.error('Error updating doctor location:', error);
      res.status(500).json({ error: 'Failed to update location' });
    }
  }

  static async incrementLocationPatientCount(req: Request, res: Response) {
    try {
      const { locationId } = req.params;

      const location = await prisma.doctorLocation.update({
        where: { id: locationId as string },
        data: {
          totalPatients: { increment: 1 }
        }
      });

      res.json(location);
    } catch (error) {
      console.error('Error incrementing patient count:', error);
      res.status(500).json({ error: 'Failed to increment patient count' });
    }
  }

  static async deleteDoctorLocation(req: Request, res: Response) {
    try {
      const { locationId } = req.params;

      await prisma.doctorLocation.update({
        where: { id: locationId as string },
        data: { isActive: false }
      });

      res.json({ message: 'Location deleted successfully' });
    } catch (error) {
      console.error('Error deleting doctor location:', error);
      res.status(500).json({ error: 'Failed to delete location' });
    }
  }
}
