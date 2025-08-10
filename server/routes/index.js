const express = require('express');
const router = express.Router();

// Import route modules
const insuranceRoutes = require('./insurance');
const emailRoutes = require('./email');
const logsRoutes = require('./logs');
const healthRoutes = require('./health');

// Mount routes
router.use('/insurance', insuranceRoutes);
router.use('/email', emailRoutes);
router.use('/logs', logsRoutes);
router.use('/health', healthRoutes);

// Root endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'InsureTrack API v1.0.0',
    endpoints: {
      insurance: '/api/insurance',
      email: '/api/email',
      logs: '/api/logs',
      health: '/api/health'
    },
    documentation: '/api/docs'
  });
});

module.exports = router;
