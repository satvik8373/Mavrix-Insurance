const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Force redeploy - API updated at: 2024-01-XX
const database = require('../server/database');
const emailer = require('../server/emailer');

const app = express();

// Middleware - More permissive CORS for immediate fix
app.use(cors({
  origin: true, // Allow all origins temporarily
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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
    if (fs.existsSync(INSURANCE_DATA_FILE)) {
      const data = fs.readFileSync(INSURANCE_DATA_FILE, 'utf8');
      insuranceData = JSON.parse(data);
    }
    if (fs.existsSync(EMAIL_LOGS_FILE)) {
      const data = fs.readFileSync(EMAIL_LOGS_FILE, 'utf8');
      emailLogs = JSON.parse(data);
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

// Initialize database and load existing data
let useDatabase = false;

const initializeStorage = async () => {
  useDatabase = await database.connect();

  if (useDatabase) {
    insuranceData = await database.getInsuranceData();
    emailLogs = await database.getEmailLogs();
  } else {
    loadData();
  }
};

// Initialize storage when the module is loaded
let initialized = false;

const ensureInitialized = async () => {
  if (!initialized) {
    await initializeStorage();
    initialized = true;
  }
};

// Routes
app.get('/', async (req, res) => {
  res.json({ 
    message: 'Mavrix Insurance API',
    version: '1.0.0',
    status: 'OK',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      insurance: '/insurance',
      logs: '/logs',
      sendReminder: '/send-reminder/:id'
    }
  });
});

app.get('/health', async (req, res) => {
  await ensureInitialized();
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    storage: useDatabase ? 'MongoDB' : 'File-based'
  });
});

app.get('/insurance', async (req, res) => {
  await ensureInitialized();
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

app.post('/insurance', async (req, res) => {
  await ensureInitialized();
  try {
    const newEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...req.body,
      createdAt: new Date().toISOString()
    };

    if (useDatabase) {
      await database.addInsuranceEntry(newEntry);
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

app.put('/insurance/:id', async (req, res) => {
  await ensureInitialized();
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (useDatabase) {
      await database.updateInsuranceEntry(id, updatedData);
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

app.delete('/insurance/:id', async (req, res) => {
  await ensureInitialized();
  try {
    const { id } = req.params;

    if (useDatabase) {
      await database.deleteInsuranceEntry(id);
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

app.post('/insurance/bulk', async (req, res) => {
  await ensureInitialized();
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

app.get('/logs', async (req, res) => {
  await ensureInitialized();
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

app.post('/send-reminder/:id', async (req, res) => {
  await ensureInitialized();
  try {
    const { id } = req.params;
    const entry = insuranceData.find(item => item.id === id);
    
    if (!entry) {
      return res.status(404).json({ error: 'Insurance entry not found' });
    }

    const result = await emailer.sendReminderEmail(entry);
    
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

// Export the app for Vercel
module.exports = async (req, res) => {
  await ensureInitialized();
  return app(req, res);
};
