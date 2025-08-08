#!/usr/bin/env node

/**
 * InsureTrack Production Diagnostic Script
 * Run this script to check your production deployment
 */

const https = require('https');
const http = require('http');

// Configuration
const SERVER_URL = process.env.SERVER_URL || 'https://mavrix-insurance-cc0k7wwa8-satvik8373s-projects.vercel.app';
const CLIENT_URL = process.env.CLIENT_URL || 'https://mavrix-insurance-myt0pcy78-satvik8373s-projects.vercel.app';

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function checkHealth() {
  log('\n🔍 Checking Server Health...', 'blue');
  
  try {
    const healthUrl = `${SERVER_URL}/api/health`;
    const response = await makeRequest(healthUrl);
    
    if (response.status === 200) {
      log('✅ Server is responding', 'green');
      log(`   Status: ${response.data.status}`, 'green');
      log(`   Database: ${response.data.database}`, 'green');
      log(`   Connected: ${response.data.connected}`, 'green');
      log(`   Email Configured: ${response.data.emailConfigured}`, 'green');
      log(`   Environment: ${response.data.environment}`, 'green');
      
      return response.data;
    } else {
      log(`❌ Server health check failed: ${response.status}`, 'red');
      return null;
    }
  } catch (error) {
    log(`❌ Server health check error: ${error.message}`, 'red');
    return null;
  }
}

async function checkDebug() {
  log('\n🔍 Checking Debug Information...', 'blue');
  
  try {
    const debugUrl = `${SERVER_URL}/api/debug`;
    const response = await makeRequest(debugUrl);
    
    if (response.status === 200) {
      log('✅ Debug endpoint responding', 'green');
      log(`   Using Database: ${response.data.useDatabase}`, 'green');
      log(`   Database Connected: ${response.data.isConnected}`, 'green');
      log(`   MongoDB Data Count: ${response.data.mongoData}`, 'green');
      log(`   File Data Count: ${response.data.fileData}`, 'green');
      
      return response.data;
    } else {
      log(`❌ Debug check failed: ${response.status}`, 'red');
      return null;
    }
  } catch (error) {
    log(`❌ Debug check error: ${error.message}`, 'red');
    return null;
  }
}

async function testEmailSending() {
  log('\n🔍 Testing Email Sending...', 'blue');
  
  try {
    const emailUrl = `${SERVER_URL}/api/send-single-reminder`;
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      expiryDate: '2024-12-31'
    };
    
    const response = await makeRequest(emailUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    if (response.status === 200) {
      log('✅ Email test completed', 'green');
      log(`   Success: ${response.data.success}`, 'green');
      log(`   Message: ${response.data.message}`, 'green');
      if (response.data.error) {
        log(`   Error: ${response.data.error}`, 'yellow');
      }
      
      return response.data;
    } else {
      log(`❌ Email test failed: ${response.status}`, 'red');
      return null;
    }
  } catch (error) {
    log(`❌ Email test error: ${error.message}`, 'red');
    return null;
  }
}

async function checkClient() {
  log('\n🔍 Checking Client...', 'blue');
  
  try {
    const response = await makeRequest(CLIENT_URL);
    
    if (response.status === 200) {
      log('✅ Client is responding', 'green');
      return true;
    } else {
      log(`❌ Client check failed: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Client check error: ${error.message}`, 'red');
    return false;
  }
}

function generateReport(health, debug, email, client) {
  log('\n📊 Diagnostic Report', 'bold');
  log('==================', 'bold');
  
  if (health) {
    log('\n✅ Server Status: HEALTHY', 'green');
    if (!health.connected) {
      log('⚠️  Database not connected - using file storage', 'yellow');
    }
    if (!health.emailConfigured) {
      log('⚠️  Email not configured - emails will be simulated', 'yellow');
    }
  } else {
    log('\n❌ Server Status: UNHEALTHY', 'red');
  }
  
  if (debug) {
    log('\n📊 Data Status:', 'blue');
    log(`   MongoDB Entries: ${debug.mongoData}`, 'blue');
    log(`   File Entries: ${debug.fileData}`, 'blue');
  }
  
  if (email) {
    log('\n📧 Email Status:', 'blue');
    if (email.success) {
      log('   ✅ Email sending works', 'green');
    } else {
      log('   ❌ Email sending failed', 'red');
      log(`   Error: ${email.error}`, 'red');
    }
  }
  
  if (client) {
    log('\n🌐 Client Status: HEALTHY', 'green');
  } else {
    log('\n❌ Client Status: UNHEALTHY', 'red');
  }
  
  log('\n🔧 Recommendations:', 'bold');
  
  if (!health?.connected) {
    log('1. Set MONGODB_URI environment variable in Vercel', 'yellow');
  }
  
  if (!health?.emailConfigured) {
    log('2. Set EMAIL_USER and EMAIL_PASSWORD environment variables', 'yellow');
  }
  
  if (!email?.success) {
    log('3. Check email configuration and SMTP settings', 'yellow');
  }
  
  log('\n📚 For more help, see TROUBLESHOOTING.md', 'blue');
}

async function main() {
  log('🚀 InsureTrack Production Diagnostic', 'bold');
  log('====================================', 'bold');
  
  const health = await checkHealth();
  const debug = await checkDebug();
  const email = await testEmailSending();
  const client = await checkClient();
  
  generateReport(health, debug, email, client);
}

// Run the diagnostic
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkHealth, checkDebug, testEmailSending, checkClient };
