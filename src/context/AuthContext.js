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
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const loginTime = localStorage.getItem('loginTime');
    
    // Check if login is still valid (24 hours)
    if (authStatus === 'true' && loginTime) {
      const now = new Date().getTime();
      const loginTimestamp = parseInt(loginTime);
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (now - loginTimestamp < twentyFourHours) {
        setIsAuthenticated(true);
      } else {
        // Session expired
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('loginTime');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('loginTime', new Date().getTime().toString());
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loginTime');
  };

  const changePassword = (newPassword) => {
    localStorage.setItem('adminPassword', newPassword);
    return true;
  };

  const getCurrentPassword = () => {
    return localStorage.getItem('adminPassword') || 'Ssd@2004';
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    changePassword,
    getCurrentPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};