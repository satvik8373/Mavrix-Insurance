// Simple icon generator for PWA
const generateIcon = (size) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(0, 0, size, size);
  
  // Icon (simplified car/shield shape)
  ctx.fillStyle = 'white';
  ctx.font = `${size * 0.6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🚗', size / 2, size / 2);
  
  return canvas.toDataURL('image/png');
};

// Generate and download icons
const downloadIcon = (dataUrl, filename) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
};

// Usage: Call this in browser console to generate icons
window.generatePWAIcons = () => {
  downloadIcon(generateIcon(192), 'icon-192x192.png');
  downloadIcon(generateIcon(512), 'icon-512x512.png');
};

export { generateIcon };