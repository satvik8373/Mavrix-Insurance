const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const emailer = require('../server/emailer');
const database = require('../server/database');

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// File paths for data persistence (using /tmp for Vercel)
const DATA_DIR = process.env.NODE_ENV === 'production' ? '/tmp' : path.join(__dirname, '../server/data');
const INSURANCE_DATA_FILE = path.join(DATA_DIR, 'insurance.json');
const EMAIL_LOGS_FILE = path.join(DATA_DIR, 'email-logs.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load data from files
let insuranceData = [];
let emailLogs = [];

const loadData = () => {
  try {
    // Load insurance data
    if (fs.existsSync(INSURANCE_DATA_FILE)) {
      const data = fs.readFileSync(INSURANCE_DATA_FILE, 'utf8');
      insuranceData = JSON.parse(data);
      console.log(`Loaded ${insuranceData.length} insurance entries`);
    }

    // Load email logs
    if (fs.existsSync(EMAIL_LOGS_FILE)) {
      const data = fs.readFileSync(EMAIL_LOGS_FILE, 'utf8');
      emailLogs = JSON.parse(data);
      console.log(`Loaded ${emailLogs.length} email logs`);
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
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    storage: useDatabase ? 'MongoDB' : 'File-based'
  });
});

app.get('/api/insurance', async (req, res) => {
  try {
    if (useDatabase) {
      insuranceData = await database.getInsuranceData();
    }
    res.json(insuranceData);
  } catch (error) {
    console.error('Error fetching insurance data:', error);
    res.status(500).json({ error: 'Failed to fetch insurance data' });
  }
});

app.post('/api/insurance', async (req, res) => {
  try {
    const newEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...req.body,
      createdAt: new Date().toISOString()
    };

    if (useDatabase) {
      await database.addInsuranceData(newEntry);
      insuranceData = await database.getInsuranceData();
    } else {
      insuranceData.push(newEntry);
      saveInsuranceData();
    }

    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error adding insurance data:', error);
    res.status(500).json({ error: 'Failed to add insurance data' });
  }
});

app.put('/api/insurance/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (useDatabase) {
      await database.updateInsuranceData(id, updatedData);
      insuranceData = await database.getInsuranceData();
    } else {
      const index = insuranceData.findIndex(item => item.id === id);
      if (index !== -1) {
        insuranceData[index] = { ...insuranceData[index], ...updatedData, updatedAt: new Date().toISOString() };
        saveInsuranceData();
      } else {
        return res.status(404).json({ error: 'Insurance entry not found' });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating insurance data:', error);
    res.status(500).json({ error: 'Failed to update insurance data' });
  }
});

app.delete('/api/insurance/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (useDatabase) {
      await database.deleteInsuranceData(id);
      insuranceData = await database.getInsuranceData();
    } else {
      const index = insuranceData.findIndex(item => item.id === id);
      if (index !== -1) {
        insuranceData.splice(index, 1);
        saveInsuranceData();
      } else {
        return res.status(404).json({ error: 'Insurance entry not found' });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting insurance data:', error);
    res.status(500).json({ error: 'Failed to delete insurance data' });
  }
});

app.post('/api/insurance/bulk', async (req, res) => {
  try {
    const newEntries = req.body.map(entry => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...entry,
      createdAt: new Date().toISOString()
    }));

    if (useDatabase) {
      await database.bulkAddInsuranceData(newEntries);
      insuranceData = await database.getInsuranceData();
    } else {
      insuranceData.push(...newEntries);
      saveInsuranceData();
    }

    res.status(201).json({ success: true, count: newEntries.length });
  } catch (error) {
    console.error('Error adding bulk insurance data:', error);
    res.status(500).json({ error: 'Failed to add bulk insurance data' });
  }
});

app.get('/api/logs', async (req, res) => {
  try {
    if (useDatabase) {
      emailLogs = await database.getEmailLogs();
    }
    res.json(emailLogs);
  } catch (error) {
    console.error('Error fetching email logs:', error);
    res.status(500).json({ error: 'Failed to fetch email logs' });
  }
});

app.post('/api/send-reminder/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const entry = insuranceData.find(item => item.id === id);
    
    if (!entry) {
      return res.status(404).json({ error: 'Insurance entry not found' });
    }

    const result = await emailer.sendReminder(entry);
    
    // Log the email
    const logEntry = {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date().toISOString(),
      recipient: entry.email,
      status: result.success ? 'success' : 'failed',
      message: result.message,
      error: result.error
    };

    if (useDatabase) {
      await database.addEmailLog(logEntry);
    } else {
      emailLogs.unshift(logEntry);
      saveEmailLogs();
    }

    res.json(result);
  } catch (error) {
    console.error('Error sending single reminder:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
});

// Initialize storage when the module is loaded
let initialized = false;

const ensureInitialized = async () => {
  if (!initialized) {
    await initializeStorage();
    initialized = true;
  }
};

// Export the app for Vercel
module.exports = async (req, res) => {
  await ensureInitialized();
  return app(req, res);
};
