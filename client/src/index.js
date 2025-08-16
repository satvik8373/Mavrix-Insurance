import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// PWA Icon Display Enhancement - Maximum Size Borderless
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

// Run icon enhancement after DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhancePWAIcons);
} else {
  enhancePWAIcons();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
