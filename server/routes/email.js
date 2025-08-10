const express = require('express');
const router = express.Router();
const emailer = require('../emailer');
const database = require('../database');
const fs = require('fs');
const path = require('path');

// File paths for data persistence (fallback)
const DATA_DIR = path.join(__dirname, '..', 'data');
const EMAIL_LOGS_FILE = path.join(DATA_DIR, 'email-logs.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load email logs from files (fallback)
let emailLogs = [];

const loadEmailLogs = () => {
  try {
    if (fs.existsSync(EMAIL_LOGS_FILE)) {
      const data = fs.readFileSync(EMAIL_LOGS_FILE, 'utf8');
      emailLogs = JSON.parse(data);
      console.log(`Loaded ${emailLogs.length} email logs from file`);
    }
  } catch (error) {
    console.error('Error loading email logs:', error);
  }
};

const saveEmailLogs = () => {
  try {
    fs.writeFileSync(EMAIL_LOGS_FILE, JSON.stringify(emailLogs, null, 2));
  } catch (error) {
    console.error('Error saving email logs:', error);
  }
};

// Initialize email logs on module load
loadEmailLogs();

// POST /api/email/update-config - Update email configuration
router.post('/update-config', (req, res) => {
  try {
    const { host, port, user, password } = req.body;
    
    // Update config values (for current session)
    const config = require('../config');
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

// POST /api/email/send-reminders - Send bulk reminders
router.post('/send-reminders', async (req, res) => {
  try {
    let currentData;
    
    if (database.isConnected) {
      currentData = await database.getInsuranceData();
    } else {
      // Load insurance data from file for fallback
      const INSURANCE_DATA_FILE = path.join(DATA_DIR, 'insurance.json');
      if (fs.existsSync(INSURANCE_DATA_FILE)) {
        const data = fs.readFileSync(INSURANCE_DATA_FILE, 'utf8');
        currentData = JSON.parse(data);
      } else {
        currentData = [];
      }
    }

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

      if (database.isConnected) {
        await database.addEmailLog(logEntry);
      } else {
        emailLogs.unshift(logEntry);
      }
    }

    if (!database.isConnected) {
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

// POST /api/email/send-single-reminder - Send single reminder
router.post('/send-single-reminder', async (req, res) => {
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

    if (database.isConnected) {
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

module.exports = router;
