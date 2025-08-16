import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// PWA Icon Display Enhancement - Truly Borderless
const enhancePWAIcons = () => {
  // Ensure all icon links are properly loaded
  const iconLinks = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]');
  
  iconLinks.forEach(link => {
    // Remove any masking or styling that might interfere with icon display
    link.style.webkitMask = 'none';
    link.style.mask = 'none';
    link.style.webkitMaskImage = 'none';
    link.style.maskImage = 'none';
    link.style.background = 'transparent';
    link.style.border = 'none';
    link.style.boxShadow = 'none';
    link.style.outline = 'none';
    link.style.filter = 'none';
    link.style.transform = 'none';
    
    // Ensure maximum size display
    link.style.padding = '0';
    link.style.margin = '0';
    link.style.width = '100%';
    link.style.height = '100%';
    link.style.borderRadius = '0';
    link.style.objectFit = 'contain';
    link.style.objectPosition = 'center';
    link.style.clipPath = 'none';
  });

  // Also target all icon images for borderless display
  const iconImages = document.querySelectorAll('img[src*="icon"], img[src*="favicon"]');
  iconImages.forEach(img => {
    img.style.background = 'transparent';
    img.style.border = 'none';
    img.style.boxShadow = 'none';
    img.style.outline = 'none';
    img.style.padding = '0';
    img.style.margin = '0';
    img.style.borderRadius = '0';
    img.style.clipPath = 'none';
    img.style.filter = 'contrast(1.1) brightness(1.1)';
    img.style.transform = 'none';
    
    // Remove white borders using CSS
    img.style.mixBlendMode = 'multiply';
    img.style.isolation = 'isolate';
  });

  // Remove any background elements that might create borders
  const backgroundElements = document.querySelectorAll('[style*="background"], [class*="background"]');
  backgroundElements.forEach(el => {
    if (el.textContent.toLowerCase().includes('icon') || 
        el.className.toLowerCase().includes('icon') ||
        el.id.toLowerCase().includes('icon')) {
      el.style.background = 'transparent';
      el.style.border = 'none';
      el.style.boxShadow = 'none';
    }
  });

  // Remove white borders from icon images using canvas
  const removeIconBorders = () => {
    const iconImages = document.querySelectorAll('img[src*="icon"], img[src*="favicon"]');
    iconImages.forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        // Draw the image
        ctx.drawImage(img, 0, 0);
        
        // Get image data to remove white borders
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Remove white borders by making them transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // If pixel is white or very light, make it transparent
          if (r > 240 && g > 240 && b > 240) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Replace the image with the borderless version
        const newSrc = canvas.toDataURL('image/png');
        img.src = newSrc;
      }
    });
  };

  // Run border removal after images load
  setTimeout(removeIconBorders, 1000);

  // Force icon refresh for better display
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) {
    const originalHref = favicon.href;
    favicon.href = '';
    setTimeout(() => {
      favicon.href = originalHref;
    }, 100);
  }
};

// Remove PWA alerts and limited access warnings
const removePWAAlerts = () => {
  // Hide PWA install prompt
  const installPrompt = document.getElementById('pwa-install-prompt');
  if (installPrompt) {
    installPrompt.style.display = 'none';
    installPrompt.style.visibility = 'hidden';
    installPrompt.style.opacity = '0';
  }

  // Hide offline indicator
  const offlineIndicator = document.getElementById('offline-indicator');
  if (offlineIndicator) {
    offlineIndicator.style.display = 'none';
    offlineIndicator.style.visibility = 'hidden';
    offlineIndicator.style.opacity = '0';
    offlineIndicator.classList.remove('show');
  }

  // Remove any other potential alert elements
  const alerts = document.querySelectorAll('[class*="alert"], [class*="warning"], [class*="notice"]');
  alerts.forEach(alert => {
    if (alert.textContent.toLowerCase().includes('limited') || 
        alert.textContent.toLowerCase().includes('offline') ||
        alert.textContent.toLowerCase().includes('install')) {
      alert.style.display = 'none';
      alert.style.visibility = 'hidden';
    }
  });

  // Set localStorage to prevent future alerts
  localStorage.setItem('pwa-dismissed', 'true');
  localStorage.setItem('offline-dismissed', 'true');
};

// Run enhancements after DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    enhancePWAIcons();
    removePWAAlerts();
  });
} else {
  enhancePWAIcons();
  removePWAAlerts();
}

// Also run alert removal periodically to catch any dynamic alerts
setInterval(removePWAAlerts, 2000);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
