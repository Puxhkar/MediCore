const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const hospitals = await prisma.hospital.findMany({ take: 3 });
  const patients = await prisma.patient.findMany({ take: 3 });
  const doctors = await prisma.doctor.findMany({ take: 3 });
  
  console.log('Hospitals:', JSON.stringify(hospitals, null, 2));
  console.log('Patients:', JSON.stringify(patients, null, 2));
  console.log('Doctors:', JSON.stringify(doctors, null, 2));
  
  await prisma.$disconnect();
}

check();
