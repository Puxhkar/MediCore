import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Search, ShoppingCart, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1a2b56', fontWeight: 800, fontSize: '24px' }}>
          <div style={{ background: '#0d9488', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart color="white" fill="white" size={24} />
          </div>
          MediCore
        </Link>

        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/doctors" className={location.pathname === '/doctors' ? 'active' : ''}>Doctors</Link>
          <Link to="/hospitals" className={location.pathname === '/hospitals' ? 'active' : ''}>Hospitals</Link>
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>My Dashboard</Link>
          <Link to="/emergency" style={{ color: '#ef4444' }}>Emergency</Link>
        </div>

        <div className="nav-actions">
          <Search size={20} color="#64748b" />
          <ShoppingCart size={20} color="#64748b" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '100px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <User size={18} color="#0d9488" />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Hi, PUSHKAR GUPTA</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
