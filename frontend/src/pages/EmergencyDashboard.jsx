import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Clock, Send, CheckCircle, ShieldAlert, Users, Zap } from 'lucide-react';

const EmergencyDashboard = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Declaration Form State
  const [patientId, setPatientId] = useState(''); 
  const [severity, setSeverity] = useState(5);
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQueue = async () => {
    try {
      const response = await fetch('/api/emergency');
      const data = await response.json();
      setQueue(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch emergency queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000); 
    return () => clearInterval(interval);
  }, []);

  const handleProcessNext = async () => {
    try {
      await fetch('/api/emergency/process', { method: 'POST' });
      fetchQueue();
    } catch (err) {
      console.error('Failed to process next:', err);
    }
  };

  const handleDeclareEmergency = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          severity: Number(severity),
          reason,
          symptoms,
          status: 'QUEUED'
        })
      });
      if (res.ok) {
        setShowForm(false);
        setReason('');
        setSymptoms('');
        fetchQueue();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Failed to enqueue: ${err.error || 'Check backend connection'}`);
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityBadge = (severity) => {
    if (severity >= 8) return <span style={{ background: '#fee2e2', color: '#dc2626', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', border: '1px solid #fecaca' }}>CRITICAL (L-{severity})</span>;
    if (severity >= 5) return <span style={{ background: '#fffae5', color: '#b45309', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', border: '1px solid #fef3c7' }}>URGENT (L-{severity})</span>;
    return <span style={{ background: '#f0fdf4', color: '#166534', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', border: '1px solid #bbf7d0' }}>STABLE (L-{severity})</span>;
  };

  const stats = {
    total: queue.length,
    critical: queue.filter(q => q.severity >= 8).length,
    urgent: queue.filter(q => q.severity >= 5 && q.severity < 8).length,
    avgWait: '~12 min'
  };

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#fee2e2', padding: '10px', borderRadius: '12px' }}>
              <ShieldAlert color="#ef4444" size={24} />
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Emergency Response Portal</h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Real-time Max-Heap prioritization engine managing critical departures.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn btn-outline" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel Entry' : 'Declare Emergency'}
          </button>
          <button className="btn btn-primary" style={{ background: '#ef4444' }} onClick={handleProcessNext} disabled={queue.length === 0}>
            Process Next Priority
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f8fafc' }}>
          <div style={{ background: '#e2e8f0', padding: '10px', borderRadius: '10px' }}><Users size={20} color="#64748b"/></div>
          <div><h2 style={{ margin: 0 }}>{stats.total}</h2><p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>TOTAL IN QUEUE</p></div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ background: '#fee2e2', padding: '10px', borderRadius: '10px' }}><ShieldAlert size={20} color="#ef4444"/></div>
          <div><h2 style={{ margin: 0 }}>{stats.critical}</h2><p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>CRITICAL CASES</p></div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ background: '#fffae5', padding: '10px', borderRadius: '10px' }}><Zap size={20} color="#f59e0b"/></div>
          <div><h2 style={{ margin: 0 }}>{stats.urgent}</h2><p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>URGENT CASES</p></div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#f0fdfa', padding: '10px', borderRadius: '10px' }}><Clock size={20} color="#0d9488"/></div>
          <div><h2 style={{ margin: 0 }}>{stats.avgWait}</h2><p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>EST. WAIT TIME</p></div>
        </div>
      </div>

      {/* Entry Form */}
      {showForm && (
        <div className="card animate-fade-in" style={{ marginBottom: '40px', background: '#fff' }}>
          <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><AlertTriangle color="#ef4444"/> New Emergency Admission</h3>
          <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} onSubmit={handleDeclareEmergency}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Patient ID/Name Reference</label>
              <input 
                className="input-field" 
                value={patientId} 
                onChange={e => setPatientId(e.target.value)} 
                placeholder="e.g. pushkar-123"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Severity (1-10)</label>
              <input 
                type="range" min="1" max="10" 
                value={severity} 
                onChange={e => setSeverity(e.target.value)} 
                style={{ width: '100%', accentColor: '#ef4444' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px', fontWeight: 700 }}>
                <span>STABLE</span><span style={{ color: '#ef4444' }}>{severity}</span><span>CRITICAL</span>
              </div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Primary Reason</label>
              <textarea 
                className="input-field" 
                rows="2" 
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Briefly describe the emergency..."
                required
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <button disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', background: '#ef4444', height: '54px', fontSize: '16px' }}>
                {isSubmitting ? 'Registering...' : 'CONFIRM EMERGENCY ENTRY'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Queue View */}
      <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: 700 }}>Active Priority Queue</h3>
      {loading && queue.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', borderRadius: '24px', background: '#f8fafc' }}>
            <div className="spinner" style={{ borderTopColor: '#ef4444' }}></div>
            <p style={{ marginTop: '16px', color: '#64748b' }}>Connecting to Priority Engine...</p>
        </div>
      ) : queue.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '80px', border: '2px dashed #e2e8f0', boxShadow: 'none' }}>
          <CheckCircle size={48} color="#0d9488" style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h3 style={{ color: '#64748b' }}>Cleared - Stable Status</h3>
          <p style={{ color: '#94a3b8' }}>No patients are currently in the emergency queue.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {queue.map((item, index) => (
            <div key={item.id || index} className="card hover-lift" style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              borderLeftWidth: '6px',
              borderLeftColor: item.severity >= 8 ? '#ef4444' : item.severity >= 5 ? '#f59e0b' : '#22c55e',
              padding: '24px 32px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {index === 0 && (
                <div style={{ position: 'absolute', top: 0, right: 0, background: '#ef4444', color: 'white', padding: '4px 20px', fontSize: '11px', fontWeight: 800, borderBottomLeftRadius: '12px' }}>NEXT FOR PROCESSING</div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Patient #{item.patientId?.substring(0,8) || 'REF-123'}</h4>
                  {index === 0 && <span className="pulse"></span>}
                </div>
                <div style={{ display: 'flex', gap: '24px', color: '#64748b', fontSize: '14px' }}>
                  <p style={{ margin: 0 }}><strong>Reason:</strong> {item.reason}</p>
                  <p style={{ margin: 0 }}><strong>Symptoms:</strong> {item.symptoms || 'Not specified'}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '12px' }}>
                  <Clock size={14}/> {new Date(item.queuedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                {getSeverityBadge(item.severity)}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .pulse {
          width: 10px;
          height: 10px;
          background: #ef4444;
          border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .spinner {
            width: 30px;
            height: 30px;
            border: 3px solid #e2e8f0;
            border-top: 3px solid #0d9488;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .hover-lift:hover { transform: translateY(-3px); }
      `}</style>
    </div>
  );
};

export default EmergencyDashboard;
