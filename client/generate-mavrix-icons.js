import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define icon sizes to generate for PWA and iOS
const ICON_SIZES = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512];
const SOURCE_PNG = path.join(__dirname, 'public/icon.png');
const OUTPUT_DIR = path.join(__dirname, 'public');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generate PNG icons in different sizes for Mavrix Insurance
async function generateMavrixIcons() {
  console.log('🎯 Generating Mavrix Insurance PWA Icons...');
  console.log('📁 Source:', SOURCE_PNG);
  console.log('📁 Output:', OUTPUT_DIR);
  
  try {
    // Check if source icon exists
    if (!fs.existsSync(SOURCE_PNG)) {
      console.error('❌ Source icon not found:', SOURCE_PNG);
      console.log('💡 Please ensure icon.png exists in the public directory');
      process.exit(1);
    }
    
    // Generate standard PWA icons
    console.log('\n🔄 Generating standard PWA icons...');
    for (const size of ICON_SIZES) {
      const outputPath = path.join(OUTPUT_DIR, `icon-${size}.png`);
      await sharp(SOURCE_PNG)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Created: icon-${size}.png (${size}x${size})`);
    }
    
    // Generate maskable icons for PWA
    console.log('\n🔄 Generating maskable PWA icons...');
    for (const size of [192, 512]) {
      const outputPath = path.join(OUTPUT_DIR, `icon-maskable-${size}.png`);
      await sharp(SOURCE_PNG)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Created: icon-maskable-${size}.png (${size}x${size})`);
    }
    
    // Generate Apple touch icons for iOS
    console.log('\n🍎 Generating Apple touch icons for iOS...');
    const appleSizes = [120, 152, 167, 180];
    for (const size of appleSizes) {
      const outputPath = path.join(OUTPUT_DIR, `apple-touch-icon-${size}.png`);
      await sharp(SOURCE_PNG)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Created: apple-touch-icon-${size}.png (${size}x${size})`);
    }
    
    // Create favicon
    console.log('\n🔄 Generating favicon...');
    await sharp(SOURCE_PNG)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
      })
      .png()
      .toFile(path.join(OUTPUT_DIR, 'favicon.png'));
    
    console.log('✅ Created: favicon.png (32x32)');
    
    // Create main icon for PWA manifest
    console.log('\n🔄 Creating main PWA icon...');
    await sharp(SOURCE_PNG)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
      })
      .png()
      .toFile(path.join(OUTPUT_DIR, 'icon.png'));
    
    console.log('✅ Updated: icon.png (512x512)');
    
    console.log('\n🎉 All Mavrix Insurance icons generated successfully!');
    console.log('\n📋 Generated files:');
    
    // List all generated files
    const files = fs.readdirSync(OUTPUT_DIR).filter(file => file.includes('icon') || file.includes('favicon'));
    files.forEach(file => {
      const stats = fs.statSync(path.join(OUTPUT_DIR, file));
      console.log(`   📄 ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
    });
    
    console.log('\n🚀 Next steps:');
    console.log('1. Update manifest.json to use the new icon files');
    console.log('2. Update index.html with proper Apple touch icon references');
    console.log('3. Test locally and deploy to Vercel');
    console.log('4. Test on iOS device with "Add to Home Screen"');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

// Run the icon generation
generateMavrixIcons();
