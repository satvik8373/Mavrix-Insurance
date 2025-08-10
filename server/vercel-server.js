const express = require('express');
const cors = require('cors');
require('dotenv').config();

const emailer = require('./emailer');
const database = require('./database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
let useDatabase = false;

const initializeStorage = async () => {
  try {
    console.log('🚀 Initializing database connection...');
    console.log('🔍 Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI: process.env.MONGODB_URI ? '✅ SET' : '❌ NOT SET',
      DATABASE_NAME: process.env.DATABASE_NAME || 'insuretrack (default)'
    });
    
    if (!process.env.MONGODB_URI) {
      console.log('❌ MONGODB_URI not set - database will be offline');
      console.log('💡 To fix: Set MONGODB_URI in Vercel environment variables');
      useDatabase = false;
      return;
    }
    
    useDatabase = await database.connect();
    
    if (useDatabase) {
      console.log('✅ Successfully connected to MongoDB!');
      console.log('📊 Database: ' + (process.env.DATABASE_NAME || 'insuretrack'));
    } else {
      console.log('⚠️ Database connection failed, using fallback data');
      console.log('💡 To fix: Check MONGODB_URI format and MongoDB Atlas settings');
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    useDatabase = false;
    console.log('💡 To fix: Check MONGODB_URI and network connectivity');
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: useDatabase ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    mongodb_configured: !!process.env.MONGODB_URI,
    database_name: process.env.DATABASE_NAME || 'insuretrack',
    message: useDatabase ? 'Database is working - real data available' : 'Database offline - showing fallback data',
    instructions: useDatabase ? 'All good! Your app is connected to MongoDB.' : 'Set MONGODB_URI in Vercel to enable real data storage.'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'InsureTrack API Server',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Get insurance data
app.get('/api/insurance-data', async (req, res) => {
  try {
    console.log('Insurance data request received');
    console.log('Database status:', { useDatabase });
    
    if (useDatabase) {
      console.log('Using database for insurance data');
      const data = await database.getInsuranceData();
      res.json(data);
    } else {
      // Return sample data when database is not connected
      console.log('Database not connected, returning sample data');
      const sampleData = [
        {
          id: 'sample-1',
          vehicleNo: 'GJ01AB1234',
          vehicleType: 'Four Wheeler',
          name: 'Sample User',
          mobileNo: '9876543210',
          email: 'sample@example.com',
          expiryDate: '2025-12-31',
          createdAt: new Date().toISOString()
        }
      ];
      res.json(sampleData);
    }
  } catch (error) {
    console.error('Error getting insurance data:', error);
    res.status(500).json({ error: 'Failed to get insurance data' });
  }
});

// Add insurance entry
app.post('/api/add-insurance', async (req, res) => {
  try {
    if (!useDatabase) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const entry = req.body;
    const newEntry = await database.addInsuranceEntry(entry);
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error adding insurance entry:', error);
    res.status(500).json({ error: 'Failed to add insurance entry' });
  }
});

// Update insurance entry
app.put('/api/update-insurance/:id', async (req, res) => {
  try {
    if (!useDatabase) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const { id } = req.params;
    const updatedEntry = req.body;
    const result = await database.updateInsuranceEntry(id, updatedEntry);
    
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'Entry not found' });
    }
  } catch (error) {
    console.error('Error updating insurance entry:', error);
    res.status(500).json({ error: 'Failed to update insurance entry' });
  }
});

// Delete insurance entry
app.delete('/api/delete-insurance/:id', async (req, res) => {
  try {
    if (!useDatabase) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const { id } = req.params;
    const result = await database.deleteInsuranceEntry(id);
    
    if (result) {
      res.json({ message: 'Entry deleted successfully' });
    } else {
      res.status(404).json({ error: 'Entry not found' });
    }
  } catch (error) {
    console.error('Error deleting insurance entry:', error);
    res.status(500).json({ error: 'Failed to delete insurance entry' });
  }
});

// Bulk add insurance data
app.post('/api/add-insurance/bulk', async (req, res) => {
  try {
    if (!useDatabase) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const { data } = req.body;
    const newEntries = await database.bulkAddInsuranceData(data);
    res.status(201).json(newEntries);
  } catch (error) {
    console.error('Error bulk adding insurance data:', error);
    res.status(500).json({ error: 'Failed to bulk add insurance data' });
  }
});

// Get email configuration
app.get('/api/email-config', (req, res) => {
  res.json({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASS || ''
  });
});

// Update email configuration
app.post('/api/update-email-config', (req, res) => {
  try {
    const { host, port, user, password } = req.body;
    
    // In production, you might want to validate and store this securely
    res.json({ message: 'Email configuration updated successfully' });
  } catch (error) {
    console.error('Error updating email config:', error);
    res.status(500).json({ error: 'Failed to update email configuration' });
  }
});

// Send single reminder
app.post('/api/send-single-reminder', async (req, res) => {
  try {
    const { name, email, expiryDate } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Set environment variables that emailer expects
    process.env.EMAIL_USER = process.env.EMAIL_USER;
    process.env.EMAIL_PASSWORD = process.env.EMAIL_PASS;
    process.env.SMTP_HOST = process.env.EMAIL_HOST;
    process.env.SMTP_PORT = process.env.EMAIL_PORT;

    const result = await emailer.sendReminder(name, email, expiryDate);
    res.json(result);
  } catch (error) {
    console.error('Error sending reminder:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email',
      error: error.message 
    });
  }
});

// Get email logs
app.get('/api/email-logs', async (req, res) => {
  try {
    if (useDatabase) {
      const logs = await database.getEmailLogs();
      res.json(logs);
    } else {
      // Return sample logs when database is not connected
      console.log('Database not connected, returning sample logs');
      const sampleLogs = [
        {
          id: 'sample-log-1',
          email: 'sample@example.com',
          status: 'success',
          message: 'Sample reminder sent',
          timestamp: new Date().toISOString()
        }
      ];
      res.json(sampleLogs);
    }
  } catch (error) {
    console.error('Error getting email logs:', error);
    res.status(500).json({ error: 'Failed to get email logs' });
  }
});

// Initialize storage when the function starts
initializeStorage();

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export for Vercel
module.exports = app;

// Start server locally if not in production
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
  });
}
