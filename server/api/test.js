const express = require('express');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(express.json());
app.use(cors({
    origin: ['https://mavrix-insurance.vercel.app', 'http://localhost:3000'],
    credentials: true
}));

// Simple test endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Simple serverless function is working!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Simple health check working',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/test', (req, res) => {
    res.json({
        message: 'Simple test endpoint working!',
        timestamp: new Date().toISOString(),
        env: {
            NODE_ENV: process.env.NODE_ENV || 'development',
            MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set'
        }
    });
});

// Catch all
app.use('*', (req, res) => {
    res.json({
        message: 'Simple serverless function catch-all',
        path: req.originalUrl,
        method: req.method
    });
});

module.exports = app;