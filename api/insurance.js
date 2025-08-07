// Insurance data management endpoint
let insuranceData = [];

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        res.status(200).json(insuranceData);
        break;

      case 'POST':
        const newEntry = {
          ...req.body,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        insuranceData.push(newEntry);
        res.status(201).json(newEntry);
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Insurance API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};