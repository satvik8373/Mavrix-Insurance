import React, { createContext, useContext, useState, useEffect } from 'react';
import { differenceInDays, parseISO } from 'date-fns';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://mavrix-api.vercel.app/api' 
  : 'http://localhost:5000/api';

export const DataProvider = ({ children }) => {
  const [insuranceData, setInsuranceData] = useState([]);
  const [settings, setSettings] = useState({
    reminderDays: 7,
    emailConfig: {
      host: 'smtp.gmail.com',
      port: 587,
      user: '',
      password: ''
    }
  });
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from backend API on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load insurance data
      const insuranceResponse = await fetch(`${API_BASE}/insurance`);
      if (insuranceResponse.ok) {
        const insuranceData = await insuranceResponse.json();
        setInsuranceData(insuranceData);
      }

      // Load email logs
      const logsResponse = await fetch(`${API_BASE}/logs`);
      if (logsResponse.ok) {
        const logs = await logsResponse.json();
        setEmailLogs(logs);
      }

      // Load settings from localStorage (settings are client-side only)
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const getStatus = (expiryDate) => {
    const today = new Date();
    const expiry = parseISO(expiryDate);
    const daysUntilExpiry = differenceInDays(expiry, today);
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= settings.reminderDays) return 'expiring';
    return 'active';
  };

  const addInsuranceEntry = async (entry) => {
    try {
      const response = await fetch(`${API_BASE}/insurance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
      });

      if (response.ok) {
        const newEntry = await response.json();
        setInsuranceData(prev => [...prev, newEntry]);
        return newEntry;
      } else {
        throw new Error('Failed to add entry');
      }
    } catch (error) {
      console.error('Error adding insurance entry:', error);
      throw error;
    }
  };

  const updateInsuranceEntry = async (id, updatedEntry) => {
    try {
      const response = await fetch(`${API_BASE}/insurance/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedEntry)
      });

      if (response.ok) {
        const updated = await response.json();
        setInsuranceData(prev => 
          prev.map(entry => entry.id === id ? updated : entry)
        );
        return updated;
      } else {
        throw new Error('Failed to update entry');
      }
    } catch (error) {
      console.error('Error updating insurance entry:', error);
      throw error;
    }
  };

  const deleteInsuranceEntry = async (id) => {
    try {
      console.log('Deleting entry with ID:', id);
      const response = await fetch(`${API_BASE}/insurance/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove from local state immediately for better UX
        setInsuranceData(prev => prev.filter(entry => entry.id !== id));
        console.log('Entry deleted successfully from local state');
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error deleting insurance entry:', error);
      throw error;
    }
  };

  const bulkAddInsuranceData = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/insurance/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
      });

      if (response.ok) {
        const newEntries = await response.json();
        setInsuranceData(prev => [...prev, ...newEntries]);
        return newEntries;
      } else {
        throw new Error('Failed to bulk add entries');
      }
    } catch (error) {
      console.error('Error bulk adding insurance data:', error);
      throw error;
    }
  };

  const addEmailLog = (log) => {
    const newLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setEmailLogs(prev => [newLog, ...prev]);
  };

  const refreshData = async () => {
    await loadInitialData();
  };

  const value = {
    insuranceData,
    settings,
    emailLogs,
    loading,
    getStatus,
    addInsuranceEntry,
    updateInsuranceEntry,
    deleteInsuranceEntry,
    bulkAddInsuranceData,
    setSettings,
    addEmailLog,
    refreshData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};