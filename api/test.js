// Simple test endpoint
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://mavrix-insurance.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    res.status(200).json({
      status: 'OK',
      message: 'API test endpoint is working!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      endpoint: '/api/test',
      method: req.method
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ 
      status: 'ERROR',
      message: 'Test endpoint failed',
      error: error.message 
    });
  }
};
