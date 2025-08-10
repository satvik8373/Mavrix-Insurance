// Client-side configuration
const config = {
  // API Configuration
  apiBaseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  
  // App Configuration
  appName: 'InsureTrack',
  version: '1.0.0',
  
  // Default Settings
  defaultReminderDays: 7,
  defaultEmailConfig: {
    host: 'smtp.gmail.com',
    port: 587,
    user: '',
    password: ''
  }
};

export default config;
