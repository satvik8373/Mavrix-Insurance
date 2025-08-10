const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Database connection
const database = require('../config/database');

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration for production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? [
            'https://mavrix-insurance.vercel.app',
            'https://mavrix-insurance-4y55o8g1u-satvik8373s-projects.vercel.app',
            'http://localhost:3000'
        ]
        : ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Initialize database connection
let dbInitialized = false;

async function initializeDatabase() {
    if (!dbInitialized) {
        try {
            if (process.env.MONGODB_URI) {
                await database.connect();
                dbInitialized = true;
                console.log('✅ Database connected for serverless function');
            } else {
                console.log('⚠️  MONGODB_URI not provided. Running without database connection.');
            }
        } catch (error) {
            console.error('❌ Database connection error:', error.message);
        }
    }
}

// Initialize database middleware (must be before routes)
app.use(async (req, res, next) => {
    await initializeDatabase();
    next();
});

// Routes
app.use('/api/insurance', require('../routes/insurance'));
app.use('/api/email', require('../routes/email'));
app.use('/api/auth', require('../routes/auth'));
app.use('/api/upload', require('../routes/upload'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
    await initializeDatabase();
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: database.isConnected ? 'Connected' : 'Disconnected'
    });
});

// Test endpoint for debugging
app.get('/api/test', async (req, res) => {
    await initializeDatabase();
    res.json({
        message: 'Serverless function is working!',
        timestamp: new Date().toISOString(),
        database: database.isConnected ? 'Connected' : 'Disconnected',
        env: process.env.NODE_ENV || 'development',
        environmentVariables: {
            MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set',
            DATABASE_NAME: process.env.DATABASE_NAME ? 'Set' : 'Not Set',
            NODE_ENV: process.env.NODE_ENV || 'development',
            ENABLE_EMAIL: process.env.ENABLE_EMAIL || 'false',
            ENABLE_AUTH: process.env.ENABLE_AUTH || 'true'
        }
    });
});

// Root endpoint
app.get('/', async (req, res) => {
    await initializeDatabase();
    res.json({
        message: 'Insurance Alert Server API',
        status: 'Running',
        timestamp: new Date().toISOString(),
        database: database.isConnected ? 'Connected' : 'Disconnected'
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        error: 'API route not found',
        path: req.originalUrl,
        method: req.method,
        availableRoutes: [
            '/api/health',
            '/api/test',
            '/api/insurance',
            '/api/email',
            '/api/auth',
            '/api/upload'
        ]
    });
});

// Catch-all handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        message: 'This is the Insurance Alert Server API. Use /api/* endpoints.'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

module.exports = app;