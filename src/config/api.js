// API Configuration
const isDevelopment = process.env.NODE_ENV === 'development';

// Use environment variable for API URL or fallback to localhost for development
export const API_BASE = process.env.REACT_APP_API_URL || 
  (isDevelopment ? 'http://localhost:5000/api' : '/api');

// Individual API endpoints
export const API_ENDPOINTS = {
  // Insurance data
  GET_INSURANCE_DATA: `${API_BASE}/insurance-data`,
  ADD_INSURANCE: `${API_BASE}/add-insurance`,
  UPDATE_INSURANCE: `${API_BASE}/update-insurance`,
  DELETE_INSURANCE: `${API_BASE}/delete-insurance`,
  
  // Email configuration
  GET_EMAIL_CONFIG: `${API_BASE}/email-config`,
  UPDATE_EMAIL_CONFIG: `${API_BASE}/update-email-config`,
  
  // Email operations
  SEND_SINGLE_REMINDER: `${API_BASE}/send-single-reminder`,
  SEND_BULK_REMINDERS: `${API_BASE}/send-bulk-reminders`,
  
  // Logs
  GET_EMAIL_LOGS: `${API_BASE}/email-logs`,
  
  // Health check
  HEALTH_CHECK: `${API_BASE}/health`
};
