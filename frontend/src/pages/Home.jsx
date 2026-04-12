import React, { useState } from 'react';
import { ArrowRight, Video, UserCheck, Pill, Thermometer, ChevronRight, Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.png';

const Home = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const categories = [
    { name: 'Orthopedists', icon: '🦴' },
    { name: 'Obesity', icon: '⚖️' },
    { name: 'Neurology', icon: '🧠' },
    { name: 'Cardiology', icon: '❤️' },
    { name: 'Ophthalmology', icon: '👁️' },
    { name: 'Pediatrics', icon: '👶' },
    { name: 'Dermatology', icon: '🧴' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/doctors');
    }
  };

  const handleCategoryClick = (cat) => {
    navigate(`/doctors?specialty=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="container hero" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px', alignItems: 'center', padding: '80px 0' }}>
        <div className="hero-content">
          <div className="badge" style={{ background: '#dcfce7', color: '#166534', marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', background: '#166534', borderRadius: '50%' }}></span>
            Now Available in Mumbai & Delhi
          </div>
          <h1 className="hero-title" style={{ fontSize: '64px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', color: '#0f172a' }}>
            Your health,<br />
            <span className="text-gradient" style={{ background: 'linear-gradient(90deg, #0d9488, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>our priority</span>
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '18px', color: '#64748b', lineHeight: 1.6, marginBottom: '48px', maxWidth: '500px' }}>
            Connect with vetted doctors, book appointments instantly, and manage your health with MediCore — your premium healthcare companion.
          </p>
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="glass" style={{ padding: '10px', borderRadius: '100px', display: 'flex', maxWidth: '600px', marginBottom: '48px', border: '1.5px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, paddingLeft: '20px' }}>
              <Search size={20} color="#64748b" />
              <input 
                style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '15px', outline: 'none' }} 
                placeholder="Search doctors, specialties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ width: '1px', background: '#e2e8f0', margin: '8px 10px' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 0.6, paddingLeft: '10px' }}>
              <MapPin size={20} color="#64748b" />
              <input 
                style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '15px', outline: 'none' }} 
                placeholder="Mumbai"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px', borderRadius: '100px' }}>Search</button>
          </form>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '48px' }}>
            <div>
              <span style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>35+</span>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>DOCTORS</p>
            </div>
            <div>
              <span style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>30+</span>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>HOSPITALS</p>
            </div>
            <div>
              <span style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>24/7</span>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>SUPPORT</p>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div style={{ position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            top: '10%', 
            left: '10%', 
            width: '80%', 
            height: '80%', 
            background: 'radial-gradient(circle, #0d948833 0%, transparent 70%)',
            zIndex: 0,
            borderRadius: '50%'
          }}></div>
          <img 
            src={heroImg} 
            alt="Doctor" 
            style={{ width: '100%', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.1))' }} 
          />
          <div className="glass" style={{ position: 'absolute', bottom: '10%', left: '-5%', padding: '24px', borderRadius: '24px', zIndex: 2, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: '#0d9488', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck color="white" size={24} />
            </div>
            <div>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#0d9488' }}>10k+</span>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a2b56', margin: 0 }}>HAPPY PATIENTS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container" style={{ padding: '100px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 className="section-title" style={{ fontSize: '40px', marginBottom: '16px' }}>Our Medical Services</h2>
          <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>Access premium healthcare services from the comfort of your home or visit our top-tier facilities.</p>
        </div>
        
        <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          <div onClick={() => navigate('/emergency')} className="feature-card card-pink" style={{ cursor: 'pointer', height: '100%' }}>
            <div style={{ background: 'white', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Activity color="#ef4444" size={28} />
            </div>
            <h3 style={{ marginBottom: '12px', fontSize: '20px' }}>Emergency Care</h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>Priority queueing for critical conditions. 24/7 ambulance support.</p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 700, fontSize: '14px' }}>
              DECLARE EMERGENCY <ArrowRight size={16} />
            </div>
          </div>

          <div onClick={() => navigate('/doctors')} className="feature-card card-green" style={{ cursor: 'pointer', height: '100%' }}>
            <div style={{ background: 'white', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <UserCheck color="#0d9488" size={28} />
            </div>
            <h3 style={{ marginBottom: '12px', fontSize: '20px' }}>Find Doctors</h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>Book confirmed appointments with the best specialists in the city.</p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#0d9488', fontWeight: 700, fontSize: '14px' }}>
              BOOK NOW <ArrowRight size={16} />
            </div>
          </div>

          <div onClick={() => navigate('/hospitals')} className="feature-card card-blue" style={{ cursor: 'pointer', height: '100%' }}>
            <div style={{ background: 'white', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <MapPin color="#3b82f6" size={28} />
            </div>
            <h3 style={{ marginBottom: '12px', fontSize: '20px' }}>Nearby Hospitals</h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>Locate advanced medical facilities and check real-time bed availability.</p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontWeight: 700, fontSize: '14px' }}>
              FIND FACILITIES <ArrowRight size={16} />
            </div>
          </div>

          <div className="feature-card card-yellow" style={{ cursor: 'pointer', height: '100%' }}>
            <div style={{ background: 'white', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Thermometer color="#f59e0b" size={28} />
            </div>
            <h3 style={{ marginBottom: '12px', fontSize: '20px' }}>Health Tracking</h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>Monitor your health metrics, spending, and appointment history.</p>
            <div onClick={() => navigate('/dashboard')} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 700, fontSize: '14px' }}>
              VIEW DASHBOARD <ArrowRight size={16} />
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div style={{ marginTop: '100px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Top Specializations</h2>
              <p style={{ color: '#64748b' }}>Select a category to find the best experts.</p>
            </div>
            <button className="btn btn-outline" style={{ fontSize: '14px' }}>View All Specialities</button>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '20px', scrollbarWidth: 'none' }}>
            {categories.map((cat, i) => (
              <div 
                key={i} 
                onClick={() => handleCategoryClick(cat.name)}
                className="glass" 
                style={{ 
                  whiteSpace: 'nowrap', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '16px 28px', 
                  borderRadius: '16px', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: '1.5px solid #f1f5f9',
                  fontWeight: 600,
                  fontSize: '15px'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0d9488'; e.currentTarget.style.color = '#0d9488'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.color = 'inherit'; }}
              >
                <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                {cat.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ background: '#1a2b56', padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.05, backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '24px', color: 'white' }}>Ready to Take Care of Your Health?</h2>
          <p style={{ fontSize: '18px', opacity: 0.7, color: 'white', marginBottom: '48px', maxWidth: '700px', margin: '0 auto 48px' }}>
            Join thousands of users who trust MediCore for their premium healthcare needs. Get started today and experience the difference.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
            <button className="btn" onClick={() => navigate('/doctors')} style={{ background: 'white', color: '#1a2b56', padding: '16px 40px', fontSize: '16px' }}>Find a Doctor</button>
            <button className="btn btn-primary" onClick={() => navigate('/emergency')} style={{ border: '1.5px solid white', padding: '16px 40px', fontSize: '16px' }}>Emergency Portal</button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Add lucide icons wrap
const Activity = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

export default Home;
