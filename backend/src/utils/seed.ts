import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with Pune, Mumbai, and Delhi data...');

  // 1. Cleanup existing data
  await prisma.review.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.doctorLocation.deleteMany();
  await prisma.doctorInvitation.deleteMany();
  await prisma.bed.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 2. Create Hospitals
  const hospitals = [
    // Pune
    { name: 'Noble Hospital', address: 'Magarpatta City, Hadapsar', city: 'Pune', lat: 18.5133, lng: 73.9249, contactNumber: '+91 20 6628 5000' },
    { name: 'Ruby Hall Clinic', address: '40, Sassoon Road', city: 'Pune', lat: 18.5302, lng: 73.8767, contactNumber: '+91 20 6645 5100' },
    { name: 'Sahyadri Hospital', address: 'S.no. 46, Plot No. 30, Deccan Gymkhana', city: 'Pune', lat: 18.5126, lng: 73.8407, contactNumber: '+91 20 6721 3000' },
    // Mumbai
    { name: 'Lilavati Hospital', address: 'A-791, Bandra Reclamation', city: 'Mumbai', lat: 19.0514, lng: 72.8224, contactNumber: '+91 22 2675 1000' },
    { name: 'Nanavati Hospital', address: 'S.V. Road, Vile Parle West', city: 'Mumbai', lat: 19.1026, lng: 72.8364, contactNumber: '+91 22 2626 7500' },
    // Delhi
    { name: 'Apollo Hospital', address: 'Sarita Vihar, Mathura Road', city: 'Delhi', lat: 28.5385, lng: 77.2842, contactNumber: '+91 11 2692 5858' },
    { name: 'Max Super Speciality', address: '1, Press Enclave Road, Saket', city: 'Delhi', lat: 28.5273, lng: 77.2114, contactNumber: '+91 11 2651 5050' },
  ];

  const createdHospitals = [];
  for (const h of hospitals) {
    const hosp = await prisma.hospital.create({ data: h });
    createdHospitals.push(hosp);
  }

  // 3. Create Doctors & Users
  const specialties = ['Cardiology', 'Pediatrics', 'Neurology', 'Dermatology', 'General Medicine'];
  
  for (let i = 0; i < createdHospitals.length; i++) {
    const hosp = createdHospitals[i];
    
    // Create 2 doctors per hospital
    for (let j = 1; j <= 2; j++) {
      const email = `doctor.${hosp.name.replace(/\s+/g, '').toLowerCase()}.${j}@medicore.com`;
      const specialty = specialties[(i + j) % specialties.length];
      
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          role: 'DOCTOR',
          firstName: `Dr. ${specialty.split(' ')[0]}`,
          lastName: `${hosp.name.split(' ')[0]} ${j}`,
        }
      });

      await prisma.doctor.create({
        data: {
          userId: user.id,
          hospitalId: hosp.id,
          speciality: specialty, // Note: backend uses 'speciality' internally in some places
          department: specialty,
          licenseNumber: `LIC-${hosp.id.slice(0,4)}-${j}`,
          shiftStart: '09:00',
          shiftEnd: '17:00',
          consultationFee: 500 + (j * 100),
          fees: 500 + (j * 100),
          experience: 5 + (i * j),
          qualification: 'MBBS, MD',
        }
      });
    }

    // Create some beds for each hospital
    await prisma.bed.createMany({
        data: [
            { hospitalId: hosp.id, bedNumber: `B1-${hosp.id.slice(0,3)}`, type: 'ICU', ward: 'Critical Care', floor: '1st' },
            { hospitalId: hosp.id, bedNumber: `B2-${hosp.id.slice(0,3)}`, type: 'GENERAL', ward: 'General Ward', floor: '2nd' }
        ]
    });
  }

  // 4. Create a Default Test Patient
  await prisma.patient.create({
    data: {
      id: 'test-patient-id', // Fixed ID for easy testing
      name: 'Pushkar Gupta',
      age: 25,
      gender: 'MALE',
      phone: '+91 9876543210',
      email: 'pushkar@example.com',
      bloodType: 'O+',
      severity: 1,
      status: 'REGISTERED'
    }
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
