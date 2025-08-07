// Update email configuration endpoint
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://mavrix-insurance.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { host, port, user, password } = req.body;

    // Update environment variables (for current session)
    process.env.SMTP_HOST = host;
    process.env.SMTP_PORT = port;
    process.env.EMAIL_USER = user;
    process.env.EMAIL_PASSWORD = password;

    res.status(200).json({
      success: true,
      message: 'Email configuration updated successfully'
    });
  } catch (error) {
    console.error('Update email config error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update email configuration'
    });
  }
};
