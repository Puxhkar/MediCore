import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token internally (or in secure cookie in production)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ marginTop: '100px', display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ width: '400px', padding: '30px' }}>
        <h2>System Login</h2>
        <p style={{ opacity: 0.7, marginBottom: '20px' }}>Access MediCore HMS Control Panel</p>
        
        {error && <div style={{ background: '#ff4c4c22', color: '#ff4c4c', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="input-field" 
              placeholder="admin@medicore.com" 
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="input-field" 
              placeholder="••••••••" 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
