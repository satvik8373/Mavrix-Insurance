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
        'https://mavrix-insurance.vercel.app',
        'https://mavrix-insurance-4y55o8g1u-satvik8373s-projects.vercel.app',
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

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    timestamp: new Date().toISOString(),
    database: database.isConnected ? 'Connected' : 'Disconnected',
    env: process.env.NODE_ENV || 'development',
    environmentVariables: {
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set',
      DATABASE_NAME: process.env.DATABASE_NAME ? 'Set' : 'Not Set',
      NODE_ENV: process.env.NODE_ENV || 'development',
      ENABLE_EMAIL: process.env.ENABLE_EMAIL || 'false',
      ENABLE_AUTH: process.env.ENABLE_AUTH || 'true'
    }
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
} else {
  // Development 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ 
      error: 'Route not found',
      path: req.originalUrl,
      method: req.method,
      availableRoutes: [
        '/api/health',
        '/api/test',
        '/api/insurance',
        '/api/email',
        '/api/auth',
        '/api/upload'
      ]
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Connect to database and start server
async function startServer() {
  try {
    let dbConnected = false;
    
    // Only try to connect to database if MONGODB_URI is provided
    if (process.env.MONGODB_URI) {
      try {
        dbConnected = await database.connect();
      } catch (dbError) {
        // Database connection failed, continue without database
      }
    }

    app.listen(PORT, () => {
      console.log('\x1b[32m%s\x1b[0m', '✅ Server started successfully on port ' + PORT);
    });

    // Only schedule cron jobs if database is connected
    if (dbConnected) {
      try {
        const cron = require('node-cron');
        cron.schedule('0 9 * * *', async () => {
          try {
            const emailService = require('./services/emailService');
            await emailService.sendReminderEmails();
          } catch (error) {
            // Silently handle cron job errors
          }
        });
      } catch (cronError) {
        // Silently handle cron setup errors
      }
    }

  } catch (error) {
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await database.disconnect();
  process.exit(0);
});

startServer();
