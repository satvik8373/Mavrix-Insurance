// API Configuration for different environments
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, use the deployed server URL
    return process.env.REACT_APP_API_URL || 'https://your-server-url.vercel.app/api';
  }
  // In development, use localhost
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiUrl();

export const API_ENDPOINTS = {
  INSURANCE: '/insurance',
  EMAIL: '/email',
  AUTH: '/auth',
  UPLOAD: '/upload'
};
