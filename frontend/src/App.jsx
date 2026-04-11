import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Hospitals from './pages/Hospitals';
import Login from './pages/Login';
import EmergencyDashboard from './pages/EmergencyDashboard';
import DoctorProfile from './pages/DoctorProfile';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/emergency" element={<EmergencyDashboard />} />
        </Routes>
        
        <footer style={{ background: '#1a2b56', padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '80px' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', color: 'white' }}>
            <div>
              <h4 style={{ fontSize: '20px', marginBottom: '20px' }}>MediCore</h4>
              <p style={{ fontSize: '14px', opacity: 0.7 }}>Your local healthcare companion for reliable, instant medical assistance.</p>
            </div>
            <div>
              <h5 style={{ marginBottom: '20px' }}>Quick Links</h5>
              <ul style={{ listStyle: 'none', fontSize: '14px', opacity: 0.7, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li>Home</li>
                <li>Hospitals</li>
                <li>Doctors</li>
                <li>Dashboard</li>
              </ul>
            </div>
            <div>
              <h5 style={{ marginBottom: '20px' }}>Services</h5>
              <ul style={{ listStyle: 'none', fontSize: '14px', opacity: 0.7, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li>Consultation</li>
                <li>Medicines</li>
                <li>Lab Tests</li>
                <li>Emergency</li>
              </ul>
            </div>
            <div>
              <h5 style={{ marginBottom: '20px' }}>Contact Us</h5>
              <p style={{ fontSize: '14px', opacity: 0.7 }}>Email: support@medicore.com</p>
              <p style={{ fontSize: '14px', opacity: 0.7 }}>Phone: +1 234 567 890</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
