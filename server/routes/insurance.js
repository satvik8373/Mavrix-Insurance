const express = require('express');
const router = express.Router();
const database = require('../database');
const fs = require('fs');
const path = require('path');

// File paths for data persistence (fallback)
const DATA_DIR = path.join(__dirname, '..', 'data');
const INSURANCE_DATA_FILE = path.join(DATA_DIR, 'insurance.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load data from files (fallback)
let insuranceData = [];

const loadData = () => {
  try {
    if (fs.existsSync(INSURANCE_DATA_FILE)) {
      const data = fs.readFileSync(INSURANCE_DATA_FILE, 'utf8');
      insuranceData = JSON.parse(data);
      console.log(`Loaded ${insuranceData.length} insurance entries from file`);
    }
  } catch (error) {
    console.error('Error loading insurance data:', error);
  }
};

const saveInsuranceData = () => {
  try {
    fs.writeFileSync(INSURANCE_DATA_FILE, JSON.stringify(insuranceData, null, 2));
  } catch (error) {
    console.error('Error saving insurance data:', error);
  }
};

// Initialize data on module load
loadData();

// GET /api/insurance - Get all insurance entries
router.get('/', async (req, res) => {
  try {
    if (database.isConnected) {
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

// POST /api/insurance - Add new insurance entry
router.post('/', async (req, res) => {
  try {
    const newEntry = {
      ...req.body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    if (database.isConnected) {
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

// PUT /api/insurance/:id - Update insurance entry
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (database.isConnected) {
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

// DELETE /api/insurance/:id - Delete insurance entry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (database.isConnected) {
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

// POST /api/insurance/bulk - Bulk add insurance data
router.post('/bulk', async (req, res) => {
  try {
    const { data } = req.body;
    const newEntries = data.map((entry, index) => ({
      ...entry,
      id: (Date.now() + index).toString(),
      createdAt: new Date().toISOString()
    }));

    if (database.isConnected) {
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

module.exports = router;
