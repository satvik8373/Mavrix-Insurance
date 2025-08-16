// MAVRIX INSURANCE Icon Configuration
// This file documents the icon setup for the application

export const ICON_CONFIG = {
  // Standard icon sizes and their use cases
  sizes: {
    16: { file: 'icon-16.png', use: 'Favicon for browsers' },
    32: { file: 'icon-32.png', use: 'Standard favicon' },
    48: { file: 'icon-48.png', use: 'Windows taskbar' },
    72: { file: 'icon-72.png', use: 'Android home screen' },
    96: { file: 'icon-96.png', use: 'Android home screen, notification badges' },
    128: { file: 'icon-128.png', use: 'Chrome Web Store' },
    144: { file: 'icon-144.png', use: 'Windows tiles' },
    152: { file: 'icon-152.png', use: 'iOS home screen' },
    192: { file: 'icon-192.png', use: 'Android home screen, PWA, push notifications' },
    384: { file: 'icon-384.png', use: 'High-DPI displays' },
    512: { file: 'icon-512.png', use: 'PWA, app stores' }
  },
  
  // Maskable icons for Android adaptive icons
  maskable: {
    192: { file: 'icon-maskable-192.png', use: 'Android adaptive icons' },
    512: { file: 'icon-maskable-512.png', use: 'High-DPI adaptive icons' }
  },
  
  // Apple touch icons for iOS
  apple: {
    120: { file: 'apple-touch-icon-120.png', use: 'iPhone' },
    152: { file: 'apple-touch-icon-152.png', use: 'iPad' },
    167: { file: 'apple-touch-icon-167.png', use: 'iPad Pro' },
    180: { file: 'apple-touch-icon-180.png', use: 'iPhone 6 Plus' }
  },
  
  // Theme colors
  theme: {
    primary: '#000000', // Black background matching icon
    accent: '#FFD700'   // Golden yellow from icon
  }
};

// Function to get icon URL for a specific size
export const getIconUrl = (size, type = 'standard') => {
  const config = ICON_CONFIG[type] || ICON_CONFIG.sizes;
  const icon = config[size];
  return icon ? `/icons/${icon.file}` : null;
};

// Function to get all available icon sizes
export const getAvailableSizes = (type = 'standard') => {
  const config = ICON_CONFIG[type] || ICON_CONFIG.sizes;
  return Object.keys(config).map(Number).sort((a, b) => a - b);
};

// Function to get icon info for a specific size
export const getIconInfo = (size, type = 'standard') => {
  const config = ICON_CONFIG[type] || ICON_CONFIG.sizes;
  return config[size] || null;
};

// Export default configuration
export default ICON_CONFIG;