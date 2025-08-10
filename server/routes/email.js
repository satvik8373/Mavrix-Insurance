const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const database = require('../config/database');
const emailService = require('../services/emailService');

// Validation middleware
const validateEmailRequest = [
  body('to').isEmail().withMessage('Valid recipient email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
];

// GET /api/email/logs - Get email logs
router.get('/logs', async (req, res) => {
  try {
    if (!database.isConnected) {
      return res.status(503).json({ 
        error: 'Database not connected',
        message: 'Please check environment variables: MONGODB_URI and DATABASE_NAME'
      });
    }

    const logs = await database.getEmailLogs();
    res.json(logs);
  } catch (error) {
    console.error('Error loading email logs:', error);
    res.status(500).json({ error: 'Failed to load email logs' });
  }
});

// POST /api/email/send - Send single email
router.post('/send', validateEmailRequest, async (req, res) => {
  try {
    if (!database.isConnected) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { to, subject, message, html } = req.body;

    const result = await emailService.sendEmail(to, subject, message, html);
    res.json(result);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// POST /api/email/reminders - Send reminder emails for expiring policies
router.post('/reminders', async (req, res) => {
  try {
    if (!database.isConnected) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    if (process.env.ENABLE_EMAIL !== 'true') {
      return res.status(400).json({ error: 'Email notifications are disabled' });
    }

    const result = await emailService.sendReminderEmails();
    res.json(result);
  } catch (error) {
    console.error('Error sending reminder emails:', error);
    res.status(500).json({ error: 'Failed to send reminder emails' });
  }
});

// POST /api/email/test - Send test email
router.post('/test', [body('to').isEmail().withMessage('Valid recipient email is required')], async (req, res) => {
  try {
    if (!database.isConnected) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (process.env.ENABLE_EMAIL !== 'true') {
      return res.status(400).json({ error: 'Email notifications are disabled' });
    }

    const { to } = req.body;
    const result = await emailService.sendTestEmail(to);
    res.json(result);
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ error: 'Failed to send test email' });
  }
});

// DELETE /api/email/logs/:id - Delete email log
router.delete('/logs/:id', async (req, res) => {
  try {
    if (!database.isConnected) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    await database.deleteEmailLog(req.params.id);
    res.json({ message: 'Email log deleted successfully' });
  } catch (error) {
    console.error('Error deleting email log:', error);
    res.status(500).json({ error: 'Failed to delete email log' });
  }
});

module.exports = router;
