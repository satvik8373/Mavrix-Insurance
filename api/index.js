// Vercel serverless function entry point
const express = require('express');
const cors = require('cors');

// Import the main server logic
const app = express();

// Middleware
app.use(cors({
  origin: ['https://mavrix-insurance.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Import database and emailer with error handling
let database, emailer;
try {
  database = require('../server/database');
  emailer = require('../server/emailer');
} catch (error) {
  console.error('Error importing server modules:', error);
  // Create fallback objects
  database = {
    connect: async () => false,
    isConnected: false,
    getInsuranceData: async () => [],
    addInsuranceEntry: async () => ({ id: Date.now().toString() }),
    updateInsuranceEntry: async () => ({}),
    deleteInsuranceEntry: async () => true,
    bulkAddInsuranceData: async () => [],
    getEmailLogs: async () => [],
    addEmailLog: async () => true
  };
  emailer = {
    sendReminderEmail: async () => ({ success: false, message: 'Email service unavailable' }),
    setupTransporter: () => { }
  };
}

// Initialize database connection
let useDatabase = false;

const initializeStorage = async () => {
  try {
    if (database && typeof database.connect === 'function') {
      useDatabase = await database.connect();
      console.log(`Using ${useDatabase ? 'MongoDB' : 'File'} storage`);
    } else {
      console.log('Database module not available, using file storage');
      useDatabase = false;
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    useDatabase = false;
  }
};

// Initialize on startup
initializeStorage();

// In-memory storage for fallback
let insuranceData = [];
let emailLogs = [];

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Mavrix Insurance API is running',
    database: useDatabase ? 'MongoDB' : 'File Storage',
    connected: database.isConnected,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/insurance', async (req, res) => {
  try {
    if (useDatabase) {
      const data = await database.getInsuranceData();
      res.json(data);
    } else {
      res.json(insuranceData);
    }
  } catch (error) {
    console.error('Error fetching insurance data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.post('/api/insurance', async (req, res) => {
  try {
    const newEntry = {
      ...req.body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    if (useDatabase) {
      const result = await database.addInsuranceEntry(newEntry);
      res.status(201).json(result);
    } else {
      insuranceData.push(newEntry);
      res.status(201).json(newEntry);
    }
  } catch (error) {
    console.error('Error adding insurance entry:', error);
    res.status(500).json({ error: 'Failed to add entry' });
  }
});

app.put('/api/insurance/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (useDatabase) {
      const result = await database.updateInsuranceEntry(id, req.body);
      res.json(result);
    } else {
      const index = insuranceData.findIndex(entry => entry.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Entry not found' });
      }
      insuranceData[index] = { ...insuranceData[index], ...req.body };
      res.json(insuranceData[index]);
    }
  } catch (error) {
    console.error('Error updating insurance entry:', error);
    if (error.message === 'Entry not found') {
      res.status(404).json({ error: 'Entry not found' });
    } else {
      res.status(500).json({ error: 'Failed to update entry' });
    }
  }
});

app.delete('/api/insurance/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (useDatabase) {
      await database.deleteInsuranceEntry(id);
      res.status(204).send();
    } else {
      const index = insuranceData.findIndex(entry => entry.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Entry not found' });
      }
      insuranceData.splice(index, 1);
      res.status(204).send();
    }
  } catch (error) {
    console.error('Error deleting insurance entry:', error);
    if (error.message === 'Entry not found') {
      res.status(404).json({ error: 'Entry not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete entry' });
    }
  }
});

app.post('/api/insurance/bulk', async (req, res) => {
  try {
    const { data } = req.body;
    const newEntries = data.map((entry, index) => ({
      ...entry,
      id: (Date.now() + index).toString(),
      createdAt: new Date().toISOString()
    }));

    if (useDatabase) {
      const result = await database.bulkAddInsuranceData(newEntries);
      res.status(201).json(result);
    } else {
      insuranceData.push(...newEntries);
      res.status(201).json(newEntries);
    }
  } catch (error) {
    console.error('Error bulk adding insurance data:', error);
    res.status(500).json({ error: 'Failed to bulk add entries' });
  }
});

app.get('/api/logs', async (req, res) => {
  try {
    if (useDatabase) {
      const logs = await database.getEmailLogs();
      res.json(logs);
    } else {
      res.json(emailLogs);
    }
  } catch (error) {
    console.error('Error fetching email logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

app.post('/api/send-single-reminder', async (req, res) => {
  try {
    const { name, email, expiryDate, vehicleNo, vehicleType, mobileNo } = req.body;

    if (!name || !email || !expiryDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const entry = { name, email, expiryDate, vehicleNo, vehicleType, mobileNo };
    const result = await emailer.sendReminderEmail(entry);

    // Log the result
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

app.post('/api/update-email-config', (req, res) => {
  try {
    const { host, port, user, password } = req.body;

    // Update environment variables (for current session)
    process.env.SMTP_HOST = host;
    process.env.SMTP_PORT = port;
    process.env.EMAIL_USER = user;
    process.env.EMAIL_PASSWORD = password;

    // Reinitialize emailer with new config
    emailer.setupTransporter();

    res.json({
      success: true,
      message: 'Email configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating email config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update email configuration'
    });
  }
});

// Export for Vercel serverless function
module.exports = (req, res) => {
  return app(req, res);
};