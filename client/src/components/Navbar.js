import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Upload, FileText, Settings, Shield, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="flex items-center gap-sm">
          <Shield size={28} color="var(--primary-color)" />
          <div className="nav-brand">Mavrix Insurance</div>
        </div>
      
        <div className="flex items-center gap-lg">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleMenu}
            className="nav-toggle"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <ul className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
            <li>
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={20} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/upload" 
                className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Upload size={20} />
                Upload
              </Link>
            </li>
            <li>
              <Link 
                to="/logs" 
                className={`nav-link ${location.pathname === '/logs' ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText size={20} />
                Logs
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings size={20} />
                Settings
              </Link>
            </li>
            {/* Mobile-only logout option */}
            <li className="md:hidden">
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="nav-link"
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none' }}
              >
                <LogOut size={20} />
                Logout
              </button>
            </li>
          </ul>

          {/* User Menu - Hidden on mobile, shown in menu */}
          <div className="hidden md:flex items-center gap-sm">
            <div className="flex items-center gap-xs">
              <User size={16} />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {user?.username || 'User'}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="btn btn-sm btn-outline"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
