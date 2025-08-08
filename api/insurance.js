const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const database = require('../server/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// File paths for data persistence (using /tmp for Vercel)
const DATA_DIR = process.env.NODE_ENV === 'production' ? '/tmp' : path.join(__dirname, '../server/data');
const INSURANCE_DATA_FILE = path.join(DATA_DIR, 'insurance.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load data from files
let insuranceData = [];

const loadData = () => {
  try {
    if (fs.existsSync(INSURANCE_DATA_FILE)) {
      const data = fs.readFileSync(INSURANCE_DATA_FILE, 'utf8');
      insuranceData = JSON.parse(data);
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

// Initialize database and load existing data
let useDatabase = false;

const initializeStorage = async () => {
  useDatabase = await database.connect();

  if (useDatabase) {
    insuranceData = await database.getInsuranceData();
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
app.get('/api/insurance', async (req, res) => {
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

app.post('/api/insurance', async (req, res) => {
  await ensureInitialized();
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
  await ensureInitialized();
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
  await ensureInitialized();
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

// Export the app for Vercel
module.exports = app;
