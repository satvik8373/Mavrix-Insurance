const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const config = require('./config');

const emailer = require('./emailer');
const database = require('./database');
const routes = require('./routes');

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

const app = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());

// File paths for data persistence (fallback)
const DATA_DIR = path.join(__dirname, 'data');
const INSURANCE_DATA_FILE = path.join(DATA_DIR, 'insurance.json');
const EMAIL_LOGS_FILE = path.join(DATA_DIR, 'email-logs.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load data from files (fallback)
let insuranceData = [];
let emailLogs = [];

const loadData = () => {
  try {
    // Load insurance data
    if (fs.existsSync(INSURANCE_DATA_FILE)) {
      const data = fs.readFileSync(INSURANCE_DATA_FILE, 'utf8');
      insuranceData = JSON.parse(data);
      console.log(`Loaded ${insuranceData.length} insurance entries from file`);
    }

    // Load email logs
    if (fs.existsSync(EMAIL_LOGS_FILE)) {
      const data = fs.readFileSync(EMAIL_LOGS_FILE, 'utf8');
      emailLogs = JSON.parse(data);
      console.log(`Loaded ${emailLogs.length} email logs from file`);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

const saveInsuranceData = () => {
  try {
    fs.writeFileSync(INSURANCE_DATA_FILE, JSON.stringify(insuranceData, null, 2));
  } catch (error) {
    console.error('Error saving insurance data:', error);
  }
};

const saveEmailLogs = () => {
  try {
    fs.writeFileSync(EMAIL_LOGS_FILE, JSON.stringify(emailLogs, null, 2));
  } catch (error) {
    console.error('Error saving email logs:', error);
  }
};

// Initialize database and load existing data on startup
let useDatabase = false;

const initializeStorage = async () => {
  try {
    useDatabase = await database.connect();

    if (useDatabase) {
      console.log('Using MongoDB for data storage');
      // Load data from MongoDB
      insuranceData = await database.getInsuranceData();
      emailLogs = await database.getEmailLogs();
      console.log(`Loaded ${insuranceData.length} insurance entries from MongoDB`);
      console.log(`Loaded ${emailLogs.length} email logs from MongoDB`);
    } else {
      console.log('Using file-based storage');
      loadData();
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
    console.log('Falling back to file-based storage');
    useDatabase = false;
    loadData();
  }
};

// Mount API routes
app.use('/api', routes);

// Schedule daily reminder check at 8 AM
cron.schedule('0 8 * * *', async () => {
  console.log('Running daily reminder check...');
  try {
    const currentData = useDatabase ? await database.getInsuranceData() : insuranceData;
    const results = await emailer.sendReminders(currentData);
    console.log(`Reminder check completed. Sent ${results.filter(r => r.success).length} emails.`);

    // Log the results
    for (const result of results) {
      const logEntry = {
        id: Date.now().toString() + Math.random(),
        timestamp: new Date().toISOString(),
        recipient: result.email,
        status: result.success ? 'success' : 'failed',
        message: result.message,
        error: result.error
      };

      if (useDatabase) {
        await database.addEmailLog(logEntry);
      } else {
        emailLogs.unshift(logEntry);
      }
    }

    if (!useDatabase) {
      saveEmailLogs();
    }
  } catch (error) {
    console.error('Error in scheduled reminder check:', error);
  }
});

// Start server after initializing storage
const startServer = async () => {
  await initializeStorage();
  
  const server = app.listen(PORT, () => {
    console.log(`InsureTrack server running on port ${PORT}`);
    console.log(`Storage: ${useDatabase ? 'MongoDB' : 'File-based'}`);
    console.log('Daily reminders scheduled for 8:00 AM');
    console.log(`API available at http://localhost:${PORT}/api`);
  });

  return server;
};

// Start the server
startServer().then(server => {
  console.log('Server started successfully, setting up shutdown handlers...');
  
  // Graceful shutdown handlers
  process.on('SIGINT', async () => {
    console.log('\nSIGINT received, shutting down gracefully...');

    if (useDatabase) {
      await database.disconnect();
    }

    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');

    if (useDatabase) {
      await database.disconnect();
    }

    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  // Keep the process alive
  console.log('Server is running and ready to accept connections...');
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

