import React, { useState, useEffect } from 'react';
import { Activity, Users, BedDouble, Calendar, CheckCircle, XCircle, UserPlus, ClipboardList, Bell, Heart, ArrowRight, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState(() => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) return JSON.parse(userStr).role || 'PATIENT';
        } catch {}
        return 'PATIENT';
    });
    
    const [patientData, setPatientData] = useState(null);
    const [adminData, setAdminData] = useState(null);
    const [pendingAppts, setPendingAppts] = useState([]);

    useEffect(() => {
        if (role === 'PATIENT') {
            fetch('/api/dashboard/patient/test-patient-id')
                .then(r => r.json())
                .then(d => { if (d && !d.error) setPatientData(d); })
                .catch(console.error);
        } else {
            fetch('/api/dashboard/admin')
                .then(r => r.json())
                .then(d => { if (d && !d.error) setAdminData(d); })
                .catch(console.error);
            fetch('/api/appointments/pending')
                .then(r => r.json())
                .then(d => { setPendingAppts(Array.isArray(d) ? d : []); })
                .catch(console.error);
        }
    }, [role]);

    const handleApproval = async (id, status) => {
        try {
            await fetch(`/api/appointments/${id}/approval`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            const pending = await (await fetch('/api/appointments/pending')).json();
            setPendingAppts(Array.isArray(pending) ? pending : []);
        } catch (e) {
            console.error('Failed to update status');
        }
    };

    const toggleRole = () => {
        const newRole = role === 'PATIENT' ? 'ADMIN' : 'PATIENT';
        localStorage.setItem('user', JSON.stringify({ role: newRole }));
        window.location.reload(); // Force reload to prevent state mismatch/white screen
    };

    // Patient Dashboard
    if (role === 'PATIENT') {
        const chartData = [
            { name: 'Jan', spend: 1200 },
            { name: 'Feb', spend: 2500 },
            { name: 'Mar', spend: 800 },
            { name: 'Apr', spend: patientData?.totalSpend || 0 },
        ];

        return (
            <div className="container" style={{ padding: '40px 0 80px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 className="text-primary" style={{ fontSize: '32px', marginBottom: '4px' }}>Patient Dashboard</h1>
                        <p className="text-gray">Welcome back! Here's your health overview.</p>
                    </div>
                    <button onClick={toggleRole} className="btn btn-outline" style={{ fontSize: '13px' }}>Switch to Admin View</button>
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                    <div onClick={() => navigate('/doctors')} className="card" style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #0d9488, #2dd4bf)', color: 'white', textAlign: 'center', padding: '24px 16px', transition: 'transform 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'}
                      onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                        <UserPlus size={28} style={{ marginBottom: '10px' }} />
                        <h4 style={{ margin: 0, fontSize: '14px' }}>Book a Doctor</h4>
                    </div>
                    <div onClick={() => navigate('/hospitals')} className="card" style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: 'white', textAlign: 'center', padding: '24px 16px', transition: 'transform 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'}
                      onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                        <Heart size={28} style={{ marginBottom: '10px' }} />
                        <h4 style={{ margin: 0, fontSize: '14px' }}>Find Hospital</h4>
                    </div>
                    <div onClick={() => navigate('/emergency')} className="card" style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #ef4444, #f87171)', color: 'white', textAlign: 'center', padding: '24px 16px', transition: 'transform 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'}
                      onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                        <Activity size={28} style={{ marginBottom: '10px' }} />
                        <h4 style={{ margin: 0, fontSize: '14px' }}>Emergency</h4>
                    </div>
                    <div className="card" style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: 'white', textAlign: 'center', padding: '24px 16px', transition: 'transform 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'}
                      onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                        <ClipboardList size={28} style={{ marginBottom: '10px' }} />
                        <h4 style={{ margin: 0, fontSize: '14px' }}>Lab Reports</h4>
                    </div>
                </div>

                {/* Main Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Spending Chart */}
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ margin: 0, fontSize: '16px' }}>Total Spending</h3>
                                <TrendingUp size={18} color="#0d9488" />
                            </div>
                            <h2 style={{ fontSize: '32px', color: '#0d9488', margin: '0 0 16px 0' }}>₹{patientData?.totalSpend || 0}</h2>
                            <div style={{ height: '140px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="spend" stroke="#0d9488" fill="url(#colorSpend)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Health Reminders */}
                        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0', fontSize: '16px' }}><Bell size={18} color="#f59e0b"/> Reminders</h3>
                            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 12px 0' }}>{patientData?.checkupReminder || 'No upcoming reminders'}</p>
                            <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '10px', fontSize: '13px', color: '#92400e' }}>
                                💊 Regular health checkups help catch issues early. Book one today!
                            </div>
                        </div>
                    </div>

                    {/* Right Column — Appointments */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>Your Appointments</h3>
                            <button className="btn btn-primary" onClick={() => navigate('/doctors')} style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <UserPlus size={14}/> Book New
                            </button>
                        </div>
                        {(!patientData?.upcomingAppointments || patientData.upcomingAppointments.length === 0) ? (
                            <div style={{ textAlign: 'center', padding: '50px 20px', color: '#94a3b8' }}>
                                <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                                <p style={{ fontSize: '16px', fontWeight: 500 }}>No appointments yet</p>
                                <p style={{ fontSize: '13px' }}>Book a doctor to get started with your health journey.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {patientData.upcomingAppointments.map(apt => (
                                    <div key={apt.id} style={{ padding: '16px', border: '1px solid #f1f5f9', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{apt.serviceType || 'Consultation'}</h4>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{new Date(apt.scheduledAt).toLocaleString()}</p>
                                        </div>
                                        <span className="badge" style={{ 
                                            background: apt.approvalStatus === 'PENDING' ? '#fef3c7' : apt.approvalStatus === 'APPROVED' ? '#dcfce7' : '#fee2e2',
                                            color: apt.approvalStatus === 'PENDING' ? '#b45309' : apt.approvalStatus === 'APPROVED' ? '#166534' : '#b91c1c'
                                        }}>
                                            {apt.approvalStatus}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ---- ADMIN Dashboard ----
    const [showAddPatient, setShowAddPatient] = useState(false);
    const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'MALE', phone: '' });

    const handleAddPatient = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newPatient, age: Number(newPatient.age), severity: 1, status: 'REGISTERED' })
            });
            if (res.ok) {
                setShowAddPatient(false);
                setNewPatient({ name: '', age: '', gender: 'MALE', phone: '' });
                // Re-fetch admin metrics
                const d = await (await fetch('/api/dashboard/admin')).json();
                if (d && !d.error) setAdminData(d);
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div className="container" style={{ padding: '40px 0 80px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 className="text-primary" style={{ fontSize: '32px', marginBottom: '4px' }}>Admin Panel</h1>
                    <p className="text-gray">Hospital Management Overview</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button onClick={() => setShowAddPatient(!showAddPatient)} className="btn btn-primary" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserPlus size={16}/> {showAddPatient ? 'Cancel' : 'Add New Patient'}
                    </button>
                    <button onClick={toggleRole} className="btn btn-outline" style={{ fontSize: '13px' }}>Switch to Patient View</button>
                </div>
            </div>

            {/* Add Patient Form */}
            {showAddPatient && (
                <div className="card animate-fade-in" style={{ marginBottom: '32px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Register New Patient</h3>
                    <form onSubmit={handleAddPatient} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        <input className="input-field" placeholder="Full Name" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} required />
                        <input className="input-field" type="number" placeholder="Age" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} required />
                        <select className="input-field" value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value})}>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                        <input className="input-field" placeholder="Phone" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} required />
                        <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 4' }}>Register Patient</button>
                    </form>
                </div>
            )}
            
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                {[
                    { icon: Users, label: 'Total Patients', value: adminData?.totalPatients || 0, color: '#3b82f6', bg: '#eff6ff' },
                    { icon: Calendar, label: 'Appointments', value: adminData?.totalAppointments || 0, color: '#0d9488', bg: '#f0fdfa' },
                    { icon: Activity, label: 'Pending Approvals', value: adminData?.pendingAppointments || 0, color: '#f59e0b', bg: '#fffbeb' },
                    { icon: BedDouble, label: 'Available Beds', value: adminData?.availableBeds || 0, color: '#10b981', bg: '#ecfdf5' },
                ].map((stat, i) => (
                    <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <stat.icon size={22} color={stat.color} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>{stat.value}</h2>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Approval Queue */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>Approval Queue</h3>
                    <span className="badge" style={{ background: '#fef3c7', color: '#b45309' }}>{pendingAppts.length} pending</span>
                </div>
                {pendingAppts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 20px', color: '#94a3b8' }}>
                        <CheckCircle size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                        <p style={{ fontSize: '16px', fontWeight: 500 }}>All caught up!</p>
                        <p style={{ fontSize: '13px' }}>No pending appointment requests.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {pendingAppts.map(apt => (
                            <div key={apt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#fafafa', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>Patient: {apt.patientId?.substring(0,8)}...</h4>
                                    <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '13px' }}>
                                        <span><strong>Service:</strong> {apt.serviceType || 'General'}</span>
                                        <span><strong>Time:</strong> {new Date(apt.scheduledAt).toLocaleString()}</span>
                                    </div>
                                    <p style={{ fontSize: '12px', margin: '4px 0 0 0', color: '#94a3b8' }}>{apt.reason}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => handleApproval(apt.id, 'APPROVED')} style={{ background: '#dcfce7', color: '#166534', border: 'none', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <CheckCircle size={14}/> Approve
                                    </button>
                                    <button onClick={() => handleApproval(apt.id, 'REJECTED')} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <XCircle size={14}/> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default Dashboard;

