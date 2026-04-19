import express from 'express';
import cors from 'cors';
import { HospitalController } from './controllers/HospitalController.js';


const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

import { AuthController } from './controllers/AuthController.js';
import { AppointmentController } from './controllers/AppointmentController.js';
import { EmergencyController } from './controllers/EmergencyController.js';
import { DoctorController } from './controllers/DoctorController.js';
import { DoctorLocationController } from './controllers/DoctorLocationController.js';

// Initialize DB (Singleton)
// SQLite Initialization removed (Migrating to Prisma/MySQL)
// DatabaseService.getInstance();

// Routes
// --- Auth ---
app.post('/api/auth/register', AuthController.register);
app.post('/api/auth/login', AuthController.login);

// --- Doctors ---
app.get('/api/doctors', DoctorController.getDoctors);
app.get('/api/doctors/:id', DoctorController.getDoctorById);
app.post('/api/doctors/profile', DoctorController.createDoctorProfile);
app.put('/api/doctors/:id', DoctorController.updateDoctorProfile);
app.get('/api/doctors/:id/availability', DoctorController.getDoctorAvailability);
app.get('/api/doctors/:doctorId/invitations', DoctorController.getDoctorInvitations);
app.post('/api/doctors/invitations/:invitationId/respond', DoctorController.respondToInvitation);

// --- Doctor Locations ---
app.get('/api/locations/:doctorId', DoctorLocationController.getDoctorLocations);
app.post('/api/locations/:doctorId', DoctorLocationController.addDoctorLocation);
app.put('/api/locations/update/:locationId', DoctorLocationController.updateDoctorLocation);
app.delete('/api/locations/:locationId', DoctorLocationController.deleteDoctorLocation);
app.post('/api/locations/increment/:locationId', DoctorLocationController.incrementLocationPatientCount);

// --- Hospitals Search (Legacy/Modified) ---
app.get('/api/hospitals/nearby', HospitalController.getNearbyHospitals);
app.get('/api/hospitals/:hospitalId/doctors', HospitalController.getHospitalDoctors);
// app.get('/api/doctors', HospitalController.getAllDoctors); // Replaced by DoctorController
// app.get('/api/doctors/:docId', HospitalController.getSingleDoctor); // Replaced by DoctorController

// --- Patients & Beds ---
app.post('/api/patients', HospitalController.registerPatient);
app.get('/api/patients', HospitalController.getAllPatients);
app.post('/api/beds/allocate/:patientId', HospitalController.allocateBed);
app.get('/api/beds/stats', HospitalController.getBedStats);

// --- Appointments ---
app.post('/api/appointments', AppointmentController.schedule);
app.get('/api/appointments/doctor/:doctorId', AppointmentController.getByDoctor);
app.get('/api/appointments/pending', AppointmentController.getPending);
app.put('/api/appointments/:appointmentId/approval', AppointmentController.updateApproval);

// --- Emergency Queue ---
app.post('/api/emergency', EmergencyController.enqueue);
app.post('/api/emergency/process', EmergencyController.processNext);
app.get('/api/emergency', EmergencyController.getQueue);

import { DashboardController } from './controllers/DashboardController.js';

// --- Dashboard ---
app.get('/api/dashboard/patient/:patientId', DashboardController.getPatientMetrics);
app.get('/api/dashboard/admin', DashboardController.getAdminMetrics);

app.listen(port, () => {
    console.log(`🏥 MediCore Backend running on port ${port}`);
});
