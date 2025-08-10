const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const database = require('../config/database');

// Validation middleware
const validateInsuranceEntry = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('policyType').trim().notEmpty().withMessage('Policy type is required'),
  body('policyNumber').trim().notEmpty().withMessage('Policy number is required'),
  body('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
  body('phone').optional().trim(),
  body('premium').optional().isNumeric().withMessage('Premium must be a number'),
  body('coverageAmount').optional().isNumeric().withMessage('Coverage amount must be a number'),
  body('address').optional().trim(),
  body('notes').optional().trim()
];

// GET /api/insurance - Get all insurance entries
router.get('/', async (req, res) => {
  try {
    if (!database.isConnected) {
      return res.status(503).json({ 
        error: 'Database not connected',
        message: 'Please check environment variables: MONGODB_URI and DATABASE_NAME'
      });
    }

    const data = await database.getInsuranceData();
    res.json(data);
  } catch (error) {
    console.error('Error loading insurance data:', error);
    res.status(500).json({ error: 'Failed to load insurance data' });
  }
});

// GET /api/insurance/expiring/soon - Get entries expiring soon (must be before /:id route)
router.get('/expiring/soon', async (req, res) => {
  try {
    if (!database.isConnected) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const data = await database.getInsuranceData();
    const reminderDays = parseInt(process.env.REMINDER_DAYS) || 7;
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + reminderDays);
    
    const expiringSoon = data.filter(entry => {
      const expiryDate = new Date(entry.expiryDate);
      return expiryDate <= reminderDate && expiryDate >= new Date();
    });

    res.json(expiringSoon);
  } catch (error) {
    console.error('Error getting expiring entries:', error);
    res.status(500).json({ error: 'Failed to get expiring entries' });
  }
});

// GET /api/insurance/:id - Get specific insurance entry
router.get('/:id', async (req, res) => {
  try {
    if (!database.isConnected) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const data = await database.getInsuranceData();
    const entry = data.find(item => item._id.toString() === req.params.id);
    
    if (!entry) {
      return res.status(404).json({ error: 'Insurance entry not found' });
    }
    
    res.json(entry);
  } catch (error) {
    console.error('Error loading insurance entry:', error);
    res.status(500).json({ error: 'Failed to load insurance entry' });
  }
});

// POST /api/insurance - Add new insurance entry
router.post('/', validateInsuranceEntry, async (req, res) => {
  try {
    if (!database.isConnected) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newEntry = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await database.addInsuranceEntry(newEntry);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding insurance entry:', error);
    res.status(500).json({ error: 'Failed to add insurance entry' });
  }
});

// PUT /api/insurance/:id - Update insurance entry
router.put('/:id', validateInsuranceEntry, async (req, res) => {
  try {
    if (!database.isConnected) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      console.error('Request body:', req.body);
      return res.status(400).json({ errors: errors.array() });
    }

    const result = await database.updateInsuranceEntry(req.params.id, req.body);
    
    if (!result) {
      return res.status(404).json({ error: 'Insurance entry not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error updating insurance entry:', error);
    
    // Provide more specific error messages
    if (error.message === 'Entry not found') {
      return res.status(404).json({ error: 'Insurance entry not found' });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid entry ID format' });
    }
    
    res.status(500).json({ error: 'Failed to update insurance entry', details: error.message });
  }
});

// DELETE /api/insurance/:id - Delete insurance entry
router.delete('/:id', async (req, res) => {
  try {
    if (!database.isConnected) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    await database.deleteInsuranceEntry(req.params.id);
    res.json({ message: 'Insurance entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting insurance entry:', error);
    res.status(500).json({ error: 'Failed to delete insurance entry' });
  }
});

module.exports = router;
