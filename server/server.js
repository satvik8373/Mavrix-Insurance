const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const database = require('./config/database');

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://your-client-url.vercel.app',
        'https://your-client-url.vercel.app',
        'http://localhost:3000'
      ]
    : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Routes
app.use('/api/insurance', require('./routes/insurance'));
app.use('/api/email', require('./routes/email'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Connect to database and start server
async function startServer() {
  try {
    const dbConnected = await database.connect();
    
    if (dbConnected) {
      console.log('✅ Connected to MongoDB successfully');
    } else {
      console.error('❌ Failed to connect to MongoDB. Server will start with limited functionality.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Insurance Alert Server running on port ${PORT}`);
      console.log(`📧 Email notifications: ${process.env.ENABLE_EMAIL === 'true' ? 'Enabled' : 'Disabled'}`);
      console.log(`🔐 Authentication: ${process.env.ENABLE_AUTH === 'true' ? 'Enabled' : 'Disabled'}`);
      console.log(`🗄️  Database: ${dbConnected ? 'Connected' : 'Disconnected'}`);
      console.log(`📅 Reminder days: ${process.env.REMINDER_DAYS || 7}`);
    });

    // Schedule daily reminders at 9:00 AM
    const cron = require('node-cron');
    cron.schedule('0 9 * * *', async () => {
      try {
        console.log('📧 Running scheduled reminder check...');
        const emailService = require('./services/emailService');
        const result = await emailService.sendReminderEmails();
        console.log(`✅ Reminder check completed: ${result.sent} sent, ${result.failed} failed`);
      } catch (error) {
        console.error('❌ Error in scheduled reminder check:', error);
      }
    });
    console.log('📅 Scheduled daily reminders at 9:00 AM');

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  await database.disconnect();
  process.exit(0);
});

startServer();
