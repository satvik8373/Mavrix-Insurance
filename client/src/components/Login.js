import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Eye, EyeOff, CheckSquare, Square } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load remember me preference
  useEffect(() => {
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    setRememberMe(savedRememberMe);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await login(password);
      if (result.success) {
        // Save remember me preference
        localStorage.setItem('rememberMe', rememberMe.toString());
        
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#64748b' }}>Checking authentication...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    }}>
      <div style={{ 
        minWidth: '400px',
        maxWidth: '450px',
        width: '100%'
      }}>
        {/* Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Shield size={48} color="#2563eb" style={{ marginBottom: '1rem' }} />
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#1e293b', 
            marginBottom: '0.25rem' 
          }}>
            Mavrix Insurance
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Insurance Management System
          </p>
        </div>

        {/* Login Card */}
        <div style={{ 
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#1e293b',
            marginBottom: '0.5rem',
            textAlign: 'center'
          }}>
            Admin Login
          </h2>
          <p style={{ 
            color: '#64748b', 
            textAlign: 'center', 
            marginBottom: '2rem',
            fontSize: '0.9rem'
          }}>
            Enter your password to access the dashboard
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginBottom: '0.5rem',
                color: '#374151',
                fontWeight: '500'
              }}>
                <Lock size={16} />
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                    padding: '0.25rem'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '1.5rem',
              cursor: 'pointer'
            }}
            onClick={() => setRememberMe(!rememberMe)}
            >
              <div style={{ cursor: 'pointer' }}>
                {rememberMe ? (
                  <CheckSquare size={18} color="#2563eb" />
                ) : (
                  <Square size={18} color="#64748b" />
                )}
              </div>
              <span style={{ 
                color: '#374151', 
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}>
                Remember me for 24 hours
              </span>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.background = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.background = '#2563eb';
              }}
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>

          {/* Security Notice */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: '#f8fafc', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#2563eb'
              }} />
              <span style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: '#374151' 
              }}>
                Security Notice
              </span>
            </div>
            <p style={{ 
              fontSize: '0.8rem', 
              color: '#64748b',
              margin: 0,
              lineHeight: '1.4'
            }}>
              {rememberMe 
                ? 'Your session will be maintained for 24 hours or until you logout.'
                : 'Your session will be maintained until you logout or close the browser.'
              }
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '2rem',
          color: 'rgba(255,255,255,0.8)',
          fontSize: '0.8rem'
        }}>
                      Mavrix Insurance Admin Portal v1.0
        </div>
      </div>
    </div>
  );
};

export default Login;
