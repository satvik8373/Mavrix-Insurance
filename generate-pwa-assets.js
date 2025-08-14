#!/usr/bin/env node

/**
 * PWA Asset Generator for Mavrix Insurance
 * This script helps generate the required icons and splash screens for iOS PWA
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 PWA Asset Generator for Mavrix Insurance');
console.log('============================================\n');

// Required icon sizes for iOS PWA
const iconSizes = [
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'apple-touch-icon-180x180.png', size: 180 },
  { name: 'apple-touch-icon-152x152.png', size: 152 },
  { name: 'apple-touch-icon-120x120.png', size: 120 },
  { name: 'apple-touch-icon-76x76.png', size: 76 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 }
];

// Required splash screen sizes for iOS
const splashSizes = [
  { name: 'splash-1290x2796.png', width: 1290, height: 2796, device: 'iPhone 14 Pro Max' },
  { name: 'splash-1179x2556.png', width: 1179, height: 2556, device: 'iPhone 14 Pro' },
  { name: 'splash-1284x2778.png', width: 1284, height: 2778, device: 'iPhone 14 Plus' },
  { name: 'splash-1170x2532.png', width: 1170, height: 2532, device: 'iPhone 14' },
  { name: 'splash-1125x2436.png', width: 1125, height: 2436, device: 'iPhone X/XS/11 Pro' },
  { name: 'splash-828x1792.png', width: 828, height: 1792, device: 'iPhone XR/11' },
  { name: 'splash-750x1334.png', width: 750, height: 1334, device: 'iPhone 6/7/8' },
  { name: 'splash-640x1136.png', width: 640, height: 1136, device: 'iPhone 5/SE' }
];

console.log('📱 Required Icon Files:');
iconSizes.forEach(icon => {
  console.log(`   • ${icon.name} (${icon.size}x${icon.size})`);
});

console.log('\n🖼️  Required Splash Screen Files:');
splashSizes.forEach(splash => {
  console.log(`   • ${splash.name} (${splash.width}x${splash.height}) - ${splash.device}`);
});

console.log('\n📋 Next Steps:');
console.log('1. Create a high-resolution logo (at least 512x512)');
console.log('2. Use an online tool to generate all icon sizes:');
console.log('   • https://favicon.io/');
console.log('   • https://realfavicongenerator.net/');
console.log('   • https://www.pwabuilder.com/imageGenerator');
console.log('\n3. Design splash screens for each device size');
console.log('4. Place all files in the client/public/ directory');
console.log('5. Test on actual iOS devices');

console.log('\n🔧 Manual Icon Generation:');
console.log('You can also use ImageMagick or similar tools:');
console.log('convert logo.png -resize 180x180 apple-touch-icon.png');
console.log('convert logo.png -resize 192x192 icon-192.png');
console.log('convert logo.png -resize 512x512 icon-512.png');

console.log('\n📱 Testing Checklist:');
console.log('□ Add to home screen on iPhone');
console.log('□ App opens in full-screen mode');
console.log('□ No Safari UI elements visible');
console.log('□ Splash screen displays properly');
console.log('□ Icons display correctly');
console.log('□ Smooth scrolling and interactions');

console.log('\n⚠️  Important Notes:');
console.log('• iOS Safari requires PNG format (not SVG)');
console.log('• All icons must be accessible via HTTPS');
console.log('• Test on actual devices, not just simulators');
console.log('• Clear cache and re-add to home screen if testing');

console.log('\n🎯 For the best results:');
console.log('• Use a professional logo designer');
console.log('• Ensure high contrast and readability');
console.log('• Test splash screens on different backgrounds');
console.log('• Optimize file sizes for faster loading');

console.log('\n✨ Happy PWA building!');
