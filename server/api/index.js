// Vercel serverless function entry point
// This eliminates the need for a build output directory

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import configuration
require('dotenv').config();

const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/insuretrack',
    databaseName: process.env.DATABASE_NAME || 'insuretrack'
  },
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD
  },
  reminderDays: parseInt(process.env.REMINDER_DAYS) || 7
};

// Database connection
let db;
let client;

async function connectDB() {
  try {
    client = new MongoClient(config.mongodb.uri);
    await client.connect();
    db = client.db(config.mongodb.databaseName);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

// Email configuration
const emailConfig = {
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.password
  }
};

const transporter = nodemailer.createTransporter(emailConfig);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/insurance-data', async (req, res) => {
  try {
    if (!db) {
      await connectDB();
    }
    const collection = db.collection('insurance');
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload', async (req, res) => {
  try {
    if (!db) {
      await connectDB();
    }
    const collection = db.collection('insurance');
    const result = await collection.insertMany(req.body);
    res.json({ message: 'Data uploaded successfully', count: result.insertedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/update/:id', async (req, res) => {
  try {
    if (!db) {
      await connectDB();
    }
    const collection = db.collection('insurance');
    const result = await collection.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.json({ message: 'Updated successfully', modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/delete/:id', async (req, res) => {
  try {
    if (!db) {
      await connectDB();
    }
    const collection = db.collection('insurance');
    const result = await collection.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted successfully', deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/update-email-config', (req, res) => {
  try {
    const { host, port, user, password } = req.body;
    // Update email configuration
    emailConfig.host = host;
    emailConfig.port = port;
    emailConfig.auth.user = user;
    emailConfig.auth.password = password;
    
    res.json({ message: 'Email configuration updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/send-single-reminder', async (req, res) => {
  try {
    const { email, subject, text } = req.body;
    
    const mailOptions = {
      from: config.email.user,
      to: email,
      subject: subject,
      text: text
    };
    
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Reminder sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect to database on startup
connectDB();

// Export for Vercel
module.exports = app;
