#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Vercel build process...');

try {
  // Change to client directory
  process.chdir(path.join(__dirname, 'client'));
  console.log('📁 Changed to client directory:', process.cwd());
  
  // Install dependencies if needed
  console.log('📦 Installing client dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Run the build
  console.log('🔨 Building React application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Verify build output
  const buildPath = path.join(process.cwd(), 'build');
  if (fs.existsSync(buildPath)) {
    console.log('✅ Build completed successfully!');
    console.log('📁 Build output location:', buildPath);
    console.log('📊 Build contents:', fs.readdirSync(buildPath));
  } else {
    console.error('❌ Build output not found at:', buildPath);
    process.exit(1);
  }
  
  // Change back to root
  process.chdir(__dirname);
  console.log('📁 Returned to root directory:', process.cwd());
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
