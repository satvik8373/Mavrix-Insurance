import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check for existing authentication on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const authTimestamp = localStorage.getItem('authTimestamp');
      const currentTime = Date.now();
      
      // Check if token exists and is not expired (24 hours)
      if (authToken && authTimestamp) {
        const tokenAge = currentTime - parseInt(authTimestamp);
        const tokenExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        if (tokenAge < tokenExpiry) {
          setIsAuthenticated(true);
          setUser({ username: 'Admin' });
        } else {
          // Token expired, clear it
          localStorage.removeItem('authToken');
          localStorage.removeItem('authTimestamp');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (password) => {
    try {
      // Simple password check
      if (password === 'Ssd@2004') {
        const authToken = 'auth_' + Math.random().toString(36).substr(2, 9);
        const timestamp = Date.now();
        
        // Store authentication data
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('authTimestamp', timestamp.toString());
        localStorage.setItem('isAuthenticated', 'true');
        
        setIsAuthenticated(true);
        setUser({ username: 'Admin' });
        
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, error: 'Invalid password' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    try {
      // Clear all authentication data
      localStorage.removeItem('authToken');
      localStorage.removeItem('authTimestamp');
      localStorage.removeItem('isAuthenticated');
      
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      // Logout error handled silently
    }
  };

  const refreshAuth = () => {
    // Refresh the authentication timestamp
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      localStorage.setItem('authTimestamp', Date.now().toString());
    }
  };

  // Auto-refresh auth every hour to prevent expiration
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(refreshAuth, 60 * 60 * 1000); // 1 hour
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const value = {
    isAuthenticated,
    loading,
    user,
    login,
    logout,
    checkAuthStatus,
    refreshAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
