import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// PWA Icon Display Enhancement - FULL BLEED Optimized
const enhancePWAIcons = () => {
  // Target all icon elements for full-bleed display
  const iconElements = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"], img[src*="icon"], [class*="icon"], [class*="app-icon"]');
  
  iconElements.forEach(element => {
    // Remove all borders and backgrounds
    element.style.border = 'none';
    element.style.boxShadow = 'none';
    element.style.outline = 'none';
    element.style.background = 'transparent';
    element.style.borderRadius = '0';
    element.style.webkitAppearance = 'none';
    element.style.appearance = 'none';
    
    // Ensure full-bleed display
    element.style.backgroundSize = 'contain';
    element.style.backgroundPosition = 'center';
    element.style.backgroundRepeat = 'no-repeat';
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
