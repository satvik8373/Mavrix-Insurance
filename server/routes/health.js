const express = require('express');
const router = express.Router();
const database = require('../database');
const fs = require('fs');
const path = require('path');

// File paths for data persistence (fallback)
const DATA_DIR = path.join(__dirname, '..', 'data');
const INSURANCE_DATA_FILE = path.join(DATA_DIR, 'insurance.json');
const EMAIL_LOGS_FILE = path.join(DATA_DIR, 'email-logs.json');

// GET /api/health - Health check endpoint
router.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'InsureTrack server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: database.isConnected ? 'MongoDB' : 'File Storage',
    connected: database.isConnected,
    version: '1.0.0'
  });
});

// GET /api/health/debug - Debug information endpoint
router.get('/debug', async (req, res) => {
  try {
    const dbData = database.isConnected ? await database.getInsuranceData() : [];
    
    // Load file data for comparison
    let fileData = [];
    let emailLogs = [];
    
    if (fs.existsSync(INSURANCE_DATA_FILE)) {
      const data = fs.readFileSync(INSURANCE_DATA_FILE, 'utf8');
      fileData = JSON.parse(data);
    }
    
    if (fs.existsSync(EMAIL_LOGS_FILE)) {
      const data = fs.readFileSync(EMAIL_LOGS_FILE, 'utf8');
      emailLogs = JSON.parse(data);
    }
    
    res.json({
      useDatabase: database.isConnected,
      isConnected: database.isConnected,
      mongoData: dbData.length,
      fileData: fileData.length,
      emailLogs: emailLogs.length,
      mongoEntries: dbData.slice(0, 5), // First 5 entries
      fileEntries: fileData.slice(0, 5), // First 5 entries
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      }
    });
  } catch (error) {
    res.json({
      error: error.message,
      useDatabase: database.isConnected,
      isConnected: database.isConnected
    });
  }
});

// GET /api/health/status - Detailed status endpoint
router.get('/status', (req, res) => {
  const status = {
    server: {
      status: 'running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0'
    },
    database: {
      status: database.isConnected ? 'connected' : 'disconnected',
      type: database.isConnected ? 'MongoDB' : 'File Storage',
      connected: database.isConnected
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 5000
    }
  };

  res.json(status);
});

module.exports = router;
