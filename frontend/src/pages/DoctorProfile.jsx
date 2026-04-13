import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Star, Calendar, Activity, MapPin, Shield, Award, ArrowLeft, User } from 'lucide-react';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Booking Wizard
  const [showBooking, setShowBooking] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingReason, setBookingReason] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/doctors/${id}`)
      .then(res => res.json())
      .then(data => { setDoc(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
       const payload = {
           doctorId: doc.id,
           patientId: 'test-patient-id',
           serviceType: selectedService,
           scheduledAt: new Date(bookingDate).toISOString(),
           durationMinutes: 30,
           reason: bookingReason,
           notes: 'Booked via Portal'
       };
       const response = await fetch('/api/appointments', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(payload)
       });
       if (response.ok) {
           setBookingSuccess(true);
           setTimeout(() => navigate('/dashboard'), 2000);
       } else {
           const err = await response.json();
           alert('Booking failed: ' + err.error);
       }
    } catch (e) {
       alert('System error');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>Loading doctor profile...</div>;
  if (!doc) return <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>Doctor not found</div>;

  return (
    <div className="container" style={{ padding: '40px 0 80px' }}>
      {/* Back Button */}
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '14px', marginBottom: '24px', fontWeight: 500 }}>
        <ArrowLeft size={16}/> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px' }}>
        {/* Left: Profile */}
        <div>
          {/* Header Card */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ width: '100px', height: '100px', background: '#f1f5f9', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={44} color="#94a3b8" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <h1 style={{ fontSize: '28px', margin: 0 }}>Dr. {doc.user?.firstName || doc.firstName} {doc.user?.lastName || doc.lastName}</h1>
                  <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>AVAILABLE</span>
                </div>
                <p style={{ fontSize: '16px', color: '#0d9488', fontWeight: 600, margin: '0 0 4px 0' }}>{doc.speciality || doc.specialization}</p>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>MBBS, MD</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                  <Star size={16} fill="#f59e0b" color="#f59e0b" />
                  <span style={{ fontWeight: 700, color: '#f59e0b' }}>4.5</span>
                  <span style={{ fontSize: '13px', color: '#94a3b8', marginLeft: '4px' }}>(Based on 0 patient reviews)</span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="card" style={{ textAlign: 'center', background: '#f8fafc', boxShadow: 'none' }}>
                <Clock size={20} color="#0d9488" style={{ marginBottom: '8px' }} />
                <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Experience</p>
                <p style={{ fontWeight: 700, margin: 0, fontSize: '15px' }}>18+ years</p>
              </div>
              <div className="card" style={{ textAlign: 'center', background: '#f8fafc', boxShadow: 'none' }}>
                <MapPin size={20} color="#0d9488" style={{ marginBottom: '8px' }} />
                <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Location</p>
                <p style={{ fontWeight: 700, margin: 0, fontSize: '15px' }}>{doc.hospitalAddress?.split(',').pop()?.trim() || 'India'}</p>
              </div>
              <div className="card" style={{ textAlign: 'center', background: '#f8fafc', boxShadow: 'none' }}>
                <Activity size={20} color="#0d9488" style={{ marginBottom: '8px' }} />
                <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Fee</p>
                <p style={{ fontWeight: 700, margin: 0, fontSize: '15px' }}>₹{doc.consultationFee}</p>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0', fontSize: '18px' }}><User size={18}/> About Doctor</h3>
            <p style={{ color: '#64748b', lineHeight: 1.7, margin: 0, fontSize: '14px' }}>
              Dr. {doc.user?.firstName || doc.firstName} {doc.user?.lastName || doc.lastName} is a highly experienced {doc.speciality || doc.specialization} dedicated to providing exceptional care. 
              With over 18 years in the field, they have helped numerous patients achieve better health outcomes. 
              Currently practicing at {doc.hospital?.name || doc.hospitalName || 'MediCore Network'}, specializing in {doc.department}.
            </p>
          </div>

          {/* Specializations */}
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0', fontSize: '18px' }}><Shield size={18}/> Specializations & Expertise</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[doc.specialization, doc.department, 'Patient Counseling', 'Diagnostics'].map((s, i) => (
                <span key={i} style={{ padding: '8px 16px', background: '#f0fdfa', color: '#0d9488', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Booking Sidebar */}
        <div>
          <div className="card" style={{ borderTop: '4px solid #0d9488', position: 'sticky', top: '100px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>Book Appointment</h3>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 20px 0' }}>Secure your slot instantly</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: '#f8fafc', borderRadius: '12px', marginBottom: '16px' }}>
              <span style={{ color: '#64748b', fontSize: '14px' }}>Fee per Visit</span>
              <span style={{ fontWeight: 700, fontSize: '18px' }}>₹{doc.consultationFee}</span>
            </div>

            {bookingSuccess ? (
              <div style={{ background: '#dcfce7', color: '#166534', padding: '24px', borderRadius: '14px', textAlign: 'center' }}>
                <CheckCircle size={32} style={{ marginBottom: '8px' }} />
                <h3 style={{ margin: '0 0 4px 0' }}>Booking Sent!</h3>
                <p style={{ margin: 0, fontSize: '14px' }}>Awaiting admin approval. Redirecting...</p>
              </div>
            ) : !showBooking ? (
              <>
                <button onClick={() => setShowBooking(true)} className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px', marginBottom: '16px' }}>
                  Continue to Booking
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={14} color="#0d9488"/> Verified Professional</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={14} color="#0d9488"/> Instant Confirmation</div>
                </div>
              </>
            ) : (
              <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Service</label>
                  <select required value={selectedService} onChange={(e) => setSelectedService(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', background: 'white' }}>
                    <option value="" disabled>Select treatment...</option>
                    <option>General Consultation</option>
                    <option>Follow-up Visit</option>
                    <option>Specialist Procedure</option>
                    <option>Health Screening</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Date & Time</label>
                  <input type="datetime-local" required value={bookingDate} onChange={(e) => setBookingDate(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Describe your problem</label>
                  <textarea required rows="3" placeholder="I have been experiencing..." value={bookingReason} onChange={(e) => setBookingReason(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', resize: 'vertical' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '14px', fontSize: '15px' }}>Request Booking</button>
              </form>
            )}
          </div>

          {/* Achievements */}
          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Achievements</h3>
            {['Top Rated Specialist 2023', 'Medical Excellence Award', 'Board Certified Professional'].map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', fontSize: '14px', color: '#374151' }}>
                <Award size={16} color="#f59e0b" /> {a}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckCircle = ({ size, style }) => (
  <svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

export default DoctorProfile;
