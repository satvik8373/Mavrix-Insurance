import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Upload, FileText, Settings, Shield, User } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <nav style={{
      background: 'white',
      color: '#333',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderBottom: '1px solid #e0e0e0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Shield size={32} color="#2563eb" />
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
            InsureTrack
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '-2px' }}>
            Insurance Management System
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={{ 
          color: location.pathname === '/' ? '#2563eb' : '#666', 
          textDecoration: 'none', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontWeight: location.pathname === '/' ? '600' : '500',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          background: location.pathname === '/' ? '#eff6ff' : 'transparent',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          if (location.pathname !== '/') {
            e.target.style.background = '#f8fafc';
            e.target.style.color = '#2563eb';
          }
        }}
        onMouseLeave={(e) => {
          if (location.pathname !== '/') {
            e.target.style.background = 'transparent';
            e.target.style.color = '#666';
          }
        }}
        >
          <Home size={20} />
          Dashboard
        </Link>
        <Link to="/upload" style={{ 
          color: location.pathname === '/upload' ? '#2563eb' : '#666', 
          textDecoration: 'none', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          background: location.pathname === '/upload' ? '#eff6ff' : 'transparent',
          fontWeight: location.pathname === '/upload' ? '600' : '500',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          if (location.pathname !== '/upload') {
            e.target.style.background = '#f8fafc';
            e.target.style.color = '#2563eb';
          }
        }}
        onMouseLeave={(e) => {
          if (location.pathname !== '/upload') {
            e.target.style.background = 'transparent';
            e.target.style.color = '#666';
          }
        }}
        >
          <Upload size={20} />
          Upload
        </Link>
        <Link to="/logs" style={{ 
          color: location.pathname === '/logs' ? '#2563eb' : '#666', 
          textDecoration: 'none', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          background: location.pathname === '/logs' ? '#eff6ff' : 'transparent',
          fontWeight: location.pathname === '/logs' ? '600' : '500',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          if (location.pathname !== '/logs') {
            e.target.style.background = '#f8fafc';
            e.target.style.color = '#2563eb';
          }
        }}
        onMouseLeave={(e) => {
          if (location.pathname !== '/logs') {
            e.target.style.background = 'transparent';
            e.target.style.color = '#666';
          }
        }}
        >
          <FileText size={20} />
          Logs
        </Link>
        <Link to="/settings" style={{ 
          color: location.pathname === '/settings' ? '#2563eb' : '#666', 
          textDecoration: 'none', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          background: location.pathname === '/settings' ? '#eff6ff' : 'transparent',
          fontWeight: location.pathname === '/settings' ? '600' : '500',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          if (location.pathname !== '/settings') {
            e.target.style.background = '#f8fafc';
            e.target.style.color = '#2563eb';
          }
        }}
        onMouseLeave={(e) => {
          if (location.pathname !== '/settings') {
            e.target.style.background = 'transparent';
            e.target.style.color = '#666';
          }
        }}
        >
          <Settings size={20} />
          Settings
        </Link>
        
        {/* User Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: '#f8fafc',
          borderRadius: '6px',
          border: '1px solid #e2e8f0'
        }}>
          <User size={16} color="#64748b" />
          <span style={{ fontSize: '0.9rem', color: '#374151', fontWeight: '500' }}>
            {user?.username || 'Admin'}
          </span>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#666', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#fef2f2';
            e.target.style.color = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'none';
            e.target.style.color = '#666';
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
