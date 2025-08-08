#!/usr/bin/env node

/**
 * Quick URL Test Script
 * Tests the basic connectivity to your deployed URLs
 */

const https = require('https');
const http = require('http');

const SERVER_URL = 'https://mavrix-insurance-api.vercel.app';
const CLIENT_URL = 'https://mavrix-insurance.vercel.app';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'InsureTrack-Test/1.0'
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ 
          status: res.statusCode, 
          headers: res.headers,
          data: data.substring(0, 200) + (data.length > 200 ? '...' : '')
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

async function testUrls() {
  console.log('🔍 Testing InsureTrack URLs...\n');
  
  // Test Client
  console.log('Testing Client URL:', CLIENT_URL);
  try {
    const clientResponse = await makeRequest(CLIENT_URL);
    console.log(`✅ Client Status: ${clientResponse.status}`);
    if (clientResponse.status === 200) {
      console.log('   ✅ Client is working correctly');
    } else {
      console.log(`   ⚠️  Client returned status: ${clientResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Client Error: ${error.message}`);
  }
  
  console.log('');
  
  // Test Server Base
  console.log('Testing Server Base URL:', SERVER_URL);
  try {
    const serverResponse = await makeRequest(SERVER_URL);
    console.log(`✅ Server Status: ${serverResponse.status}`);
    console.log(`   Headers: ${JSON.stringify(serverResponse.headers, null, 2)}`);
    if (serverResponse.status === 404) {
      console.log('   ⚠️  Server is deployed but no root route configured (this is normal)');
    }
  } catch (error) {
    console.log(`❌ Server Error: ${error.message}`);
  }
  
  console.log('');
  
  // Test Server Health Endpoint
  console.log('Testing Server Health Endpoint:', `${SERVER_URL}/api/health`);
  try {
    const healthResponse = await makeRequest(`${SERVER_URL}/api/health`);
    console.log(`✅ Health Status: ${healthResponse.status}`);
    if (healthResponse.status === 200) {
      console.log('   ✅ Health endpoint is working');
      console.log(`   Response: ${healthResponse.data}`);
    } else {
      console.log(`   ❌ Health endpoint returned: ${healthResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Health Endpoint Error: ${error.message}`);
  }
  
  console.log('');
  console.log('📋 Summary:');
  console.log('- If client returns 200: ✅ Frontend is working');
  console.log('- If server base returns 404: ✅ Server is deployed (normal)');
  console.log('- If health endpoint returns 200: ✅ API is working');
  console.log('- If health endpoint returns 404: ❌ API routes not configured');
  console.log('');
  console.log('🔧 Next Steps:');
  console.log('1. If API is not working, redeploy the server: cd server && vercel --prod');
  console.log('2. Check Vercel function logs for deployment issues');
  console.log('3. Verify environment variables are set in Vercel dashboard');
}

testUrls().catch(console.error);
