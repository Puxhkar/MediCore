import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Star, Clock, Plus, User, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const useQuery = () => new URLSearchParams(useLocation().search);

const Doctors = () => {
  const query = useQuery();
  const hospitalId = query.get('hospitalId');
  const initialSearch = query.get('search') || '';
  const initialSpecialty = query.get('specialty') || 'All';
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [sortBy, setSortBy] = useState('Relevance');
  
  const navigate = useNavigate();

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      let url = hospitalId 
        ? `/api/hospitals/${hospitalId}/doctors`
        : `/api/doctors?city=${encodeURIComponent(searchTerm)}&speciality=${specialty !== 'All' ? specialty : ''}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load doctors', err);
    } finally {
      setLoading(false);
    }
  }, [hospitalId, searchTerm, specialty]);

  useEffect(() => {
    fetchDocs();
  }, [hospitalId, specialty, fetchDocs]);

  // Sync state with URL params if they change (e.g. navigation from home)
  useEffect(() => {
    if (initialSearch !== searchTerm && initialSearch !== '') {
        setSearchTerm(initialSearch);
    }
    if (initialSpecialty !== specialty) {
        setSpecialty(initialSpecialty);
    }
  }, [initialSearch, initialSpecialty]);

  const specialties = ['All', ...new Set(doctors.map(d => d.speciality || d.specialization))];

  const filtered = doctors.filter(doc => {
    const fullName = `${doc.user?.firstName || doc.firstName} ${doc.user?.lastName || doc.lastName}`.toLowerCase();
    const matchSearch = fullName.includes(searchTerm.toLowerCase()) || 
                       (doc.speciality || doc.specialization || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (doc.hospital?.name && doc.hospital.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchSpec = specialty === 'All' || (doc.speciality || doc.specialization) === specialty;
    return matchSearch && matchSpec;
  }).sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.consultationFee - b.consultationFee;
    if (sortBy === 'Price: High to Low') return b.consultationFee - a.consultationFee;
    return 0; // Relevance (default)
  });

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <header style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 className="text-primary" style={{ fontSize: '48px', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>Available Specialists</h1>
        <p style={{ color: '#64748b', fontSize: '18px' }}>Book appointments with top-rated medical professionals in the MediCore network.</p>
      </header>

      {/* Main Search Bar */}
      <div style={{ background: 'white', padding: '12px', borderRadius: '100px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', display: 'flex', maxWidth: '800px', margin: '0 auto 64px', border: '1.5px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, paddingLeft: '24px' }}>
          <Search size={20} color="#64748b" />
          <input 
            style={{ border: 'none', background: 'transparent', margin: 0, width: '100%', fontSize: '16px', outline: 'none' }} 
            placeholder="Search by name, specialty, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={fetchDocs} 
          className="btn btn-primary" 
          style={{ borderRadius: '100px', padding: '12px 32px' }}
        >
          Find Experts
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '48px' }}>
        {/* Filters Sidebar */}
        <aside>
          <div className="card" style={{ position: 'sticky', top: '100px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', color: '#0f172a' }}>
              <SlidersHorizontal size={20} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Filter Results</h3>
            </div>
            
            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '12px' }}>Specialization</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {specialties.map(s => (
                  <button 
                    key={s}
                    onClick={() => setSpecialty(s)}
                    style={{ 
                      textAlign: 'left', 
                      background: specialty === s ? '#f0fdfa' : 'transparent', 
                      border: 'none', 
                      padding: '10px 16px', 
                      borderRadius: '10px', 
                      fontSize: '14px', 
                      fontWeight: specialty === s ? 700 : 500,
                      color: specialty === s ? '#0f766e' : '#64748b',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '12px' }}>Availability</label>
              <select className="input-field" style={{ fontSize: '14px' }}>
                <option>All Doctors</option>
                <option>Available Today</option>
                <option>Premium Only</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Doctor Grid */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>{filtered.length} Experts Found</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>Sort By:</span>
              <select 
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontWeight: 700, fontSize: '14px', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
              >
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
              <ChevronDown size={14} color="#64748b" />
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px' }}>
              <div className="spinner"></div>
              <p style={{ marginTop: '20px', color: '#64748b' }}>Fetching medical staff...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '80px', border: '2px dashed #e2e8f0', boxShadow: 'none' }}>
              <Search size={48} color="#94a3b8" style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h3 style={{ color: '#64748b' }}>No matches found</h3>
              <p style={{ color: '#94a3b8' }}>Try adjusting your search terms or filters.</p>
              <button className="btn btn-outline" onClick={() => { setSearchTerm(''); setSpecialty('All'); fetchDocs(); }} style={{ marginTop: '20px' }}>Clear All Filters</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
              {filtered.map(doc => (
                <div key={doc.id} className="card hover-glow" style={{ borderTop: '6px solid #0d9488', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'flex-start' }}>
                    <div style={{ background: '#f1f5f9', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={32} color="#94a3b8" />
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${doc.isAvailable ? 'badge-green' : 'badge-red'}`} style={{ 
                        background: doc.isAvailable ? '#f0fdf4' : '#fee2e2', 
                        color: doc.isAvailable ? '#166534' : '#dc2626',
                        fontSize: '11px',
                        fontWeight: 800
                      }}>
                        {doc.isAvailable ? '● AVAILABLE' : '● BUSY'}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-primary" style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>Dr. {doc.user?.firstName || doc.firstName} {doc.user?.lastName || doc.lastName}</h3>
                  <p style={{ color: '#0d9488', fontWeight: 700, fontSize: '14px', marginBottom: '20px' }}>{doc.speciality || doc.specialization}</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#64748b' }}>
                      <Clock size={16} color="#94a3b8" /> {doc.shiftStart} – {doc.shiftEnd}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#64748b' }}>
                      <MapPin size={16} color="#94a3b8" /> {doc.hospital?.name || doc.hospitalName || 'MediCore Center'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '24px' }}>
                    {[1,2,3,4].map(i => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
                    <Star size={16} color="#f59e0b" />
                    <span style={{ fontSize: '14px', marginLeft: '6px', fontWeight: 700, color: '#0f172a' }}>{doc.averageRating || 4.8}</span>
                    <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '4px' }}>({doc.totalReviews || 120}+ reviews)</span>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '4px' }}>Consultation Fee</p>
                      <p style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>₹{doc.consultationFee}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button className="btn btn-outline" onClick={() => navigate(`/doctor/${doc.id}`)} style={{ padding: '10px 20px', fontSize: '14px' }}>Profile</button>
                      <button className="btn btn-primary" onClick={() => navigate(`/doctor/${doc.id}`)} style={{ padding: '10px 24px', fontSize: '14px' }}>Book Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <style>{`
        .spinner { width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top: 4px solid #0d9488; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .hover-glow:hover { box-shadow: 0 20px 50px rgba(13, 148, 136, 0.12); border-color: #0d9488; }
      `}</style>
    </div>
  );
};

export default Doctors;
