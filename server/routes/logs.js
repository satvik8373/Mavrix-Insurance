const express = require('express');
const router = express.Router();
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

// Initialize email logs on module load
loadEmailLogs();

// GET /api/logs - Get all email logs
router.get('/', async (req, res) => {
  try {
    if (database.isConnected) {
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

// GET /api/logs/status - Get logs statistics
router.get('/status', async (req, res) => {
  try {
    let logs;
    
    if (database.isConnected) {
      logs = await database.getEmailLogs();
    } else {
      logs = emailLogs;
    }

    const stats = {
      total: logs.length,
      successful: logs.filter(log => log.status === 'success').length,
      failed: logs.filter(log => log.status === 'failed').length,
      recent: logs.slice(0, 10) // Last 10 logs
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching log statistics:', error);
    res.status(500).json({ error: 'Failed to fetch log statistics' });
  }
});

// DELETE /api/logs - Clear all logs
router.delete('/', async (req, res) => {
  try {
    if (database.isConnected) {
      // For MongoDB, we'll clear the collection
      const collection = database.getCollection('emailLogs');
      await collection.deleteMany({});
      res.json({ message: 'All logs cleared successfully' });
    } else {
      emailLogs = [];
      // Clear the file
      fs.writeFileSync(EMAIL_LOGS_FILE, '[]');
      res.json({ message: 'All logs cleared successfully' });
    }
  } catch (error) {
    console.error('Error clearing logs:', error);
    res.status(500).json({ error: 'Failed to clear logs' });
  }
});

module.exports = router;
