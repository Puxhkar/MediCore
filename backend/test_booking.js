
async function testBooking() {
    const payload = {
        doctorId: 'dc1', 
        patientId: 'dummy-patient-123',
        serviceType: 'General Consultation',
        scheduledAt: new Date().toISOString(),
        durationMinutes: 30,
        reason: 'Test booking',
        notes: 'Booked via Test Script'
    };

    const response = await fetch('http://localhost:3001/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}

testBooking();
