import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

export class DoctorController {
  
  static async getDoctors(req: Request, res: Response) {
    try {
      const { speciality, city, hospitalId, limit } = req.query;

      let where: any = {};
      if (speciality) where.speciality = { contains: speciality as string };
      if (hospitalId) where.hospitalId = hospitalId as string;
      if (city && !hospitalId) {
        where.hospital = { city: { contains: city as string } };
      }

      const doctors = await prisma.doctor.findMany({
        where,
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          hospital: { select: { name: true, address: true } },
          reviews: {
            select: { rating: true },
            take: 10
          },
          _count: {
            select: { appointments: true, reviews: true }
          }
        },
        orderBy: { id: 'desc' },
        take: limit ? parseInt(limit as string) : undefined
      });

      // Calculate average rating for each doctor
      const doctorsWithRating = doctors.map(doctor => {
        const avgRating = doctor.reviews.length > 0
          ? doctor.reviews.reduce((sum, review) => sum + review.rating, 0) / doctor.reviews.length
          : 0;

        return {
          ...doctor,
          averageRating: Math.round(avgRating * 10) / 10,
          totalAppointments: doctor._count.appointments,
          totalReviews: doctor._count.reviews,
          isAvailable: true 
        };
      });

      res.json(doctorsWithRating);
    } catch (error: any) {
      console.error('Error fetching doctors:', error);
      res.status(500).json({ error: 'Failed to fetch doctors', details: error.message });
    }
  }

  static async getDoctorById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const doctor = await prisma.doctor.findUnique({
        where: { id: id as string },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          hospital: true,
          reviews: { 
            include: { 
              patient: true
            } 
          }
        }
      });

      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      res.json(doctor);
    } catch (error) {
      console.error('Error fetching doctor:', error);
      res.status(500).json({ error: 'Failed to fetch doctor' });
    }
  }

  static async createDoctorProfile(req: Request, res: Response) {
    try {
      const { userId, hospitalId, speciality, experience, fees, qualification, department, licenseNumber, shiftStart, shiftEnd, consultationFee } = req.body;

      const existingDoctor = await prisma.doctor.findUnique({ where: { userId: userId as string } });
      if (existingDoctor) {
        return res.json(existingDoctor); 
      }

      const doctor = await prisma.doctor.create({
        data: {
          userId,
          hospitalId: hospitalId || null,
          speciality,
          experience: parseInt(experience),
          fees: parseInt(fees),
          qualification,
          department,
          licenseNumber,
          shiftStart,
          shiftEnd,
          consultationFee: parseFloat(consultationFee || fees)
        },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } }
        }
      });

      res.status(201).json(doctor);
    } catch (error) {
      console.error('Error creating doctor profile:', error);
      res.status(500).json({ error: 'Failed to create doctor profile' });
    }
  }

  static async updateDoctorProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { speciality, experience, fees, qualification } = req.body;

      const doctor = await prisma.doctor.update({
        where: { id: id as string },
        data: { speciality, experience, fees, qualification },
        include: { user: { select: { firstName: true, email: true } } }
      });

      res.json(doctor);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  static async getDoctorAvailability(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ error: 'Date is required' });
      }

      const dateStr = date as string;

      // Get doctor's existing appointments for the date
      const existingAppointments = await prisma.appointment.findMany({
        where: {
          doctorId: id as string,
          scheduledAt: {
            gte: new Date(`${dateStr}T00:00:00.000Z`),
            lt: new Date(`${dateStr}T23:59:59.999Z`)
          },
          status: {
            in: ['SCHEDULED']
          }
        },
        select: {
          scheduledAt: true
        }
      });

      // Generate all possible time slots
      const allSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
      ];

      // Filter out booked slots
      const bookedTimes = existingAppointments.map(apt => {
        const time = new Date(apt.scheduledAt).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        return time;
      });

      const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

      res.json({ availableSlots });
    } catch (error) {
      console.error('Error fetching availability:', error);
      res.status(500).json({ error: 'Failed to fetch availability' });
    }
  }

  static async getDoctorInvitations(req: Request, res: Response) {
    try {
      const doctorId = req.params.doctorId;

      const invitations = await prisma.doctorInvitation.findMany({
        where: {
          doctorId: doctorId as string,
          status: 'PENDING'
        },
        include: {
          hospital: { select: { name: true, address: true, contactNumber: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json(invitations);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      res.status(500).json({ error: 'Failed to fetch invitations' });
    }
  }

  static async respondToInvitation(req: Request, res: Response) {
    try {
      const { invitationId } = req.params;
      const { status } = req.body; // 'ACCEPTED' or 'REJECTED'

      const invitation = await prisma.doctorInvitation.findFirst({
        where: {
          id: invitationId as string,
          status: 'PENDING'
        }
      });

      if (!invitation) {
        return res.status(404).json({ error: 'Invitation not found' });
      }

      // Update invitation status
      const updatedInvitation = await prisma.doctorInvitation.update({
        where: { id: invitationId as string },
        data: { status }
      });

      // If accepted, update doctor's hospital
      if (status === 'ACCEPTED') {
        await prisma.doctor.update({
          where: { id: invitation.doctorId },
          data: { hospitalId: invitation.hospitalId }
        });
      }

      res.json({
        message: `Invitation ${status.toLowerCase()} successfully`,
        invitation: updatedInvitation
      });
    } catch (error) {
      console.error('Error responding to invitation:', error);
      res.status(500).json({ error: 'Failed to respond to invitation' });
    }
  }
}
