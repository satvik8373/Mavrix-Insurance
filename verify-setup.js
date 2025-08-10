#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 InsureTrack Setup Verification');
console.log('================================\n');

let allGood = true;

// Check Node.js version
try {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion >= 16) {
    console.log(`✅ Node.js version: ${nodeVersion} (>= 16.0.0 required)`);
  } else {
    console.log(`❌ Node.js version: ${nodeVersion} (>= 16.0.0 required)`);
    allGood = false;
  }
} catch (error) {
  console.log('❌ Could not determine Node.js version');
  allGood = false;
}

// Check npm
try {
  const { execSync } = require('child_process');
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm version: ${npmVersion}`);
} catch (error) {
  console.log('❌ npm not found or not working');
  allGood = false;
}

// Check project structure
console.log('\n📁 Project Structure Check:');

const requiredDirs = ['client', 'server'];
const requiredFiles = [
  'client/package.json',
  'server/package.json',
  'server/config.js',
  'server/database.js',
  'server/emailer.js',
  'server/server.js'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ Directory: ${dir}/`);
  } else {
    console.log(`❌ Missing directory: ${dir}/`);
    allGood = false;
  }
});

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ File: ${file}`);
  } else {
    console.log(`❌ Missing file: ${file}`);
    allGood = false;
  }
});

// Check environment files
console.log('\n🔐 Environment Configuration:');

const envFiles = [
  { path: '.env', description: 'Client environment' },
  { path: 'server/.env', description: 'Server environment' }
];

envFiles.forEach(({ path: envPath, description }) => {
  if (fs.existsSync(envPath)) {
    console.log(`✅ ${description}: ${envPath}`);
  } else {
    console.log(`⚠️  ${description}: ${envPath} (not found - copy from .env.example)`);
  }
});

// Check dependencies
console.log('\n📦 Dependencies Check:');

const checkDependencies = (dir, description) => {
  const packageJsonPath = path.join(dir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const depCount = Object.keys(packageJson.dependencies || {}).length;
      const devDepCount = Object.keys(packageJson.devDependencies || {}).length;
      console.log(`✅ ${description}: ${depCount} dependencies, ${devDepCount} dev dependencies`);
    } catch (error) {
      console.log(`❌ ${description}: Could not read package.json`);
      allGood = false;
    }
  } else {
    console.log(`❌ ${description}: package.json not found`);
    allGood = false;
  }
};

checkDependencies('client', 'Client dependencies');
checkDependencies('server', 'Server dependencies');

// Summary
console.log('\n📋 Summary:');
if (allGood) {
  console.log('🎉 All checks passed! Your setup looks good.');
  console.log('\n🚀 To start the application:');
  console.log('   1. Run: npm run install:all');
  console.log('   2. Run: npm run start:dev');
  console.log('   3. Or use: start.ps1 (PowerShell) or start.bat (Command Prompt)');
} else {
  console.log('⚠️  Some issues were found. Please fix them before proceeding.');
  console.log('\n📖 See STARTUP_GUIDE.md for detailed setup instructions.');
}

console.log('\n🔗 Useful URLs:');
console.log('   - Frontend: http://localhost:3000');
console.log('   - Backend API: http://localhost:5000/api');
console.log('   - Health Check: http://localhost:5000/api/health');

console.log('\n📚 Documentation:');
console.log('   - README.md - Project overview');
console.log('   - STARTUP_GUIDE.md - Detailed setup guide');
console.log('   - ENVIRONMENT_SETUP.md - Environment configuration');
