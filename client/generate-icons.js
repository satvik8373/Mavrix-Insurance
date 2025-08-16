#!/usr/bin/env node

/**
 * PWA Icon Generator for Mavrix Insurance
 * This script generates all required icon sizes from the main logo
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 PWA Icon Generator for Mavrix Insurance');
console.log('==========================================\n');

// Check if the source logo exists
const sourceLogo = path.join(__dirname, 'public', 'icon.png');
if (!fs.existsSync(sourceLogo)) {
  console.error('❌ Source logo not found: icon.png');
  console.log('Please ensure icon.png exists in the client/public/ directory');
  process.exit(1);
}

console.log('✅ Source logo found: icon.png');
console.log('\n📱 Required Icon Files:');

// Required icon sizes for PWA
const iconSizes = [
  { name: 'favicon.ico', size: 32, format: 'ico' },
  { name: 'apple-touch-icon.png', size: 180, format: 'png' },
  { name: 'apple-touch-icon-180x180.png', size: 180, format: 'png' },
  { name: 'apple-touch-icon-152x152.png', size: 152, format: 'png' },
  { name: 'apple-touch-icon-120x120.png', size: 120, format: 'png' },
  { name: 'apple-touch-icon-76x76.png', size: 76, format: 'png' },
  { name: 'icon-192.png', size: 192, format: 'png' },
  { name: 'icon-512.png', size: 512, format: 'png' }
];

iconSizes.forEach(icon => {
  console.log(`   • ${icon.name} (${icon.size}x${icon.size})`);
});

console.log('\n🔧 Manual Icon Generation Instructions:');
console.log('Since this script cannot directly manipulate images, please:');
console.log('\n1. Use an online tool to generate all icon sizes:');
console.log('   • https://favicon.io/ (recommended)');
console.log('   • https://realfavicongenerator.net/');
console.log('   • https://www.pwabuilder.com/imageGenerator');
console.log('\n2. Or use ImageMagick if installed:');
console.log('   convert icon.png -resize 180x180 apple-touch-icon.png');
console.log('   convert icon.png -resize 192x192 icon-192.png');
console.log('   convert icon.png -resize 512x512 icon-512.png');
console.log('   convert icon.png -resize 32x32 favicon.ico');

console.log('\n📁 Place all generated files in: client/public/');
console.log('\n⚠️  Important Notes:');
console.log('• iOS Safari requires PNG format (not SVG)');
console.log('• favicon.ico should be 32x32 pixels');
console.log('• All icons must be accessible via HTTPS');
console.log('• Test on actual iOS devices');

console.log('\n🎯 After generating icons:');
console.log('1. Update manifest.json if needed');
console.log('2. Test PWA installation on iPhone');
console.log('3. Verify icons display correctly');
console.log('4. Check splash screen behavior');

console.log('\n✨ Happy PWA building!');
