require('dotenv').config();

const config = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB Configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/insuretrack',
    databaseName: process.env.DATABASE_NAME || 'insuretrack'
  },
  
  // Email Configuration
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD
  },
  
  // Reminder Configuration
  reminderDays: parseInt(process.env.REMINDER_DAYS) || 7,
  
  // Client Configuration
  client: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
  }
};

module.exports = config;
