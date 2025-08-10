const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const router = express.Router();
const database = require('../config/database');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv', // .csv
    'application/csv'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Excel (.xlsx, .xls) and CSV files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Validate and clean uploaded data
const validateAndCleanData = (data) => {
  const cleanedData = [];
  const errors = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because index starts at 0 and we skip header
    
    // Skip empty rows
    if (!row.name && !row.email && !row.policyType) {
      return;
    }

    const entry = {
      name: row.name?.toString().trim() || '',
      email: row.email?.toString().trim() || '',
      policyType: row.policyType?.toString().trim() || '',
      policyNumber: row.policyNumber?.toString().trim() || '',
      expiryDate: row.expiryDate || '',
      premium: parseFloat(row.premium) || 0,
      coverageAmount: parseFloat(row.coverageAmount) || 0,
      phone: row.phone?.toString().trim() || '',
      address: row.address?.toString().trim() || '',
      notes: row.notes?.toString().trim() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Validate required fields
    if (!entry.name) {
      errors.push(`Row ${rowNumber}: Name is required`);
    }
    if (!entry.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email)) {
      errors.push(`Row ${rowNumber}: Valid email is required`);
    }
    if (!entry.policyType) {
      errors.push(`Row ${rowNumber}: Policy type is required`);
    }
    if (!entry.policyNumber) {
      errors.push(`Row ${rowNumber}: Policy number is required`);
    }
    if (!entry.expiryDate || isNaN(new Date(entry.expiryDate).getTime())) {
      errors.push(`Row ${rowNumber}: Valid expiry date is required`);
    }

    if (errors.length === 0) {
      cleanedData.push(entry);
    }
  });

  return { cleanedData, errors };
};

// POST /api/upload/excel - Upload Excel/CSV file
router.post('/excel', upload.single('file'), async (req, res) => {
  try {
    if (!database.isConnected) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({ error: 'No data found in the uploaded file' });
    }

    const { cleanedData, errors } = validateAndCleanData(data);

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation errors found in uploaded data',
        errors: errors.slice(0, 10) // Limit to first 10 errors
      });
    }

    if (cleanedData.length === 0) {
      return res.status(400).json({ error: 'No valid data found after cleaning' });
    }

    // Add data to database
    const insertedIds = await database.bulkAddInsuranceData(cleanedData);

    res.json({
      success: true,
      message: `Successfully imported ${cleanedData.length} insurance entries`,
      imported: cleanedData.length,
      total: Object.keys(insertedIds).length,
      entries: cleanedData
    });

  } catch (error) {
    console.error('Error processing uploaded file:', error);
    res.status(500).json({ error: 'Failed to process uploaded file' });
  }
});

// GET /api/upload/template - Download Excel template
router.get('/template', (req, res) => {
  try {
    const templateData = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        policyType: 'Auto Insurance',
        policyNumber: 'AUTO-001',
        expiryDate: '2024-12-31',
        premium: 1200.00,
        coverageAmount: 50000.00,
        phone: '+1-555-0123',
        address: '123 Main St, City, State 12345',
        notes: 'Sample entry'
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        policyType: 'Home Insurance',
        policyNumber: 'HOME-001',
        expiryDate: '2024-11-15',
        premium: 800.00,
        coverageAmount: 250000.00,
        phone: '+1-555-0456',
        address: '456 Oak Ave, City, State 12345',
        notes: 'Another sample entry'
      }
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Insurance Data');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=insurance-template.xlsx');
    res.send(buffer);

  } catch (error) {
    console.error('Error generating template:', error);
    res.status(500).json({ error: 'Failed to generate template' });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: 'File upload error' });
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ error: error.message });
  }
  
  next(error);
});

module.exports = router;
