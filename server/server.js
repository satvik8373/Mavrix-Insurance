const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const emailer = require('./emailer');
const database = require('./database');

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

// File paths for data persistence
const DATA_DIR = path.join(__dirname, 'data');
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
    message: 'InsureTrack server is running',
    database: useDatabase ? 'MongoDB' : 'File Storage',
    connected: database.isConnected
  });
});

app.get('/api/debug', async (req, res) => {
  try {
    const dbData = useDatabase ? await database.getInsuranceData() : [];
    const fileData = insuranceData;
    
    res.json({
      useDatabase,
      isConnected: database.isConnected,
      mongoData: dbData.length,
      fileData: fileData.length,
      mongoEntries: dbData,
      fileEntries: fileData
    });
  } catch (error) {
    res.json({
      error: error.message,
      useDatabase,
      isConnected: database.isConnected
    });
  }
});

app.post('/api/update-email-config', (req, res) => {
  try {
    const { host, port, user, password } = req.body;
    
    // Update config values (for current session)
    config.email.host = host;
    config.email.port = parseInt(port);
    config.email.user = user;
    config.email.password = password;
    
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
      saveInsuranceData();
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
      saveInsuranceData();
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
      saveInsuranceData();
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
      saveInsuranceData();
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

app.post('/api/send-reminders', async (req, res) => {
  try {
    const currentData = useDatabase ? await database.getInsuranceData() : insuranceData;
    const results = await emailer.sendReminders(currentData);

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

    res.json({
      message: 'Reminder process completed',
      results: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    });
  } catch (error) {
    console.error('Error sending reminders:', error);
    res.status(500).json({ error: 'Failed to send reminders' });
  }
});

app.post('/api/send-single-reminder', async (req, res) => {
  try {
    const { name, email, expiryDate } = req.body;

    if (!name || !email || !expiryDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const entry = { name, email, expiryDate };
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

// Schedule daily reminder check at 8 AM
cron.schedule('0 8 * * *', async () => {
  console.log('Running daily reminder check...');
  try {
    const results = await emailer.sendReminders(insuranceData);
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

