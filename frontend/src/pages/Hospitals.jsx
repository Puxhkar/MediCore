import React, { useState, useEffect } from 'react';
import { Search, MapPin, Bed, Phone, Ambulance, Activity, Star, Navigation, Building2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hospitals = () => {
    const [search, setSearch] = useState('');
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchHospitals = async (lat, lng, cityName = null) => {
        setLoading(true);
        setError(null);
        try {
            let url = `/api/hospitals/nearby?radius=5000`;
            if (cityName) {
                url += `&city=${encodeURIComponent(cityName)}`;
            } else if (lat && lng) {
                url += `&lat=${lat}&lng=${lng}`;
            } else {
                // Default fallback if no params provided
                url += `&lat=18.5204&lng=73.8567`; // Default to Pune center
            }

            const res = await fetch(url);
            if (!res.ok) throw new Error('Server error');
            const data = await res.json();
            setHospitals(Array.isArray(data) ? data : []);
        } catch(e) {
            console.error('Fetch Error:', e);
            setError('Could not connect to Hospital API. Please check your backend.');
        } finally {
            setLoading(false);
        }
    };

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchHospitals(position.coords.latitude, position.coords.longitude);
            },
            () => {
                // Fallback to Delhi center
                fetchHospitals(28.6139, 77.2090);
            }
        );
    };

    useEffect(() => {
        // Default: fetch all with a large radius from center India
        fetchHospitals(20.5937, 78.9629);
    }, []);

    const viewDoctors = (hospitalId) => {
        navigate(`/doctors?hospitalId=${hospitalId}`);
    };

    const filtered = hospitals.filter(h => 
        h.name.toLowerCase().includes(search.toLowerCase()) || 
        h.address.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container" style={{ padding: '60px 0 100px' }}>
            <header style={{ textAlign: 'center', marginBottom: '64px' }}>
                <div style={{ background: '#eff6ff', color: '#3b82f6', width: 'fit-content', margin: '0 auto 20px', padding: '8px 20px', borderRadius: '100px', fontSize: '12px', fontWeight: 800, border: '1px solid #dbeafe' }}>
                    MEDICAL NETWORK
                </div>
                <h1 className="text-primary" style={{ fontSize: '48px', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>Explore Local Hospitals</h1>
                <p style={{ color: '#64748b', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>Locate top-tier medical facilities and book specialist consultations instantly.</p>
            </header>

            {/* Search + Locate Bar */}
            <div style={{ background: 'white', padding: '12px', borderRadius: '100px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', display: 'flex', flexWrap: 'wrap', maxWidth: '800px', margin: '0 auto 64px', border: '1.5px solid #e2e8f0', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, paddingLeft: '24px', minWidth: '250px' }}>
                    <Search size={20} color="#64748b" />
                    <input 
                        style={{ border: 'none', background: 'transparent', margin: 0, width: '100%', fontSize: '16px', outline: 'none' }} 
                        placeholder="Type hospital name or location..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <button onClick={handleLocateMe} className="btn" style={{ 
                    display: 'flex', gap: '10px', alignItems: 'center', 
                    background: '#f1f5f9', color: '#0f172a', 
                    border: 'none', borderRadius: '100px', 
                    padding: '12px 28px', cursor: 'pointer', 
                    fontWeight: 700, fontSize: '14px',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                >
                    <Navigation size={18} /> Near Me
                </button>
                <button 
                  onClick={() => fetchHospitals(null, null, search)} 
                  className="btn btn-primary" 
                  style={{ borderRadius: '100px', padding: '12px 32px' }}
                >
                  Search Network
                </button>
            </div>

            {error && (
                <div className="card animate-fade-in" style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', textAlign: 'center', marginBottom: '40px', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700 }}>
                        <AlertCircle size={20}/> {error}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>{filtered.length} Facilities Found</h2>
                <div style={{ color: '#64748b', fontSize: '14px', fontWeight: 600 }}>Showing hospitals within 5000km radius</div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>
                    <div className="spinner"></div>
                    <p style={{ marginTop: '20px', color: '#64748b' }}>Accessing GPR database...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '80px', border: '2px dashed #e2e8f0', boxShadow: 'none' }}>
                    <Building2 size={48} color="#94a3b8" style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <h3 style={{ color: '#64748b' }}>No hospitals match your search</h3>
                    <p style={{ color: '#94a3b8' }}>Try a different city or broaden your search terms.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '32px' }}>
                    {filtered.map(h => (
                        <div key={h.id} className="card hover-glow" style={{ position: 'relative', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                                <div style={{ background: '#eff6ff', width: '64px', height: '64px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Building2 size={32} color="#3b82f6" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '4px', color: '#0f172a' }}>{h.name}</h3>
                                    {h.distance !== undefined && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#0d9488', fontWeight: 700 }}>
                                            <Navigation size={12} fill="#0d9488"/> {h.distance.toFixed(1)} km from your location
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', marginBottom: '16px', color: '#64748b', lineHeight: 1.5 }}>
                                <MapPin size={18} color="#94a3b8" style={{ marginTop: '2px' }} /> {h.address}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', marginBottom: '24px', color: '#64748b' }}>
                                <Phone size={18} color="#94a3b8" /> {h.contactNumber || '+91 22 2345 6789'}
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                                <span className="badge" style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '11px' }}>
                                    <Activity size={12}/> 24/7 EMERGENCY
                                </span>
                                <span className="badge" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontWeight: 800, fontSize: '11px' }}>
                                    ● AMBULANCE
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                                <button className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                    <Phone size={18}/> Contact Help
                                </button>
                                <button className="btn btn-primary" onClick={() => viewDoctors(h.id)} style={{ fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                    Find Doctors <ChevronRight size={18}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .spinner { width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .hover-glow:hover { box-shadow: 0 20px 50px rgba(59, 130, 246, 0.12); border-color: #3b82f6; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

const AlertCircle = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default Hospitals;
