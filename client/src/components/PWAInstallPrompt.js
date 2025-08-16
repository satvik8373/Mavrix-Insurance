import React, { useState, useEffect } from 'react';

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const checkIOS = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      return /iPad|iPhone|iPod/.test(userAgent);
    };

    // Check if running in standalone mode (PWA)
    const checkStandalone = () => {
      return window.navigator.standalone || 
             window.matchMedia('(display-mode: standalone)').matches ||
             document.referrer.includes('android-app://');
    };

    setIsIOS(checkIOS());
    setIsStandalone(checkStandalone());

    // CRITICAL: Prevent PWA behavior on iOS
    if (checkIOS()) {
      console.log('iOS device detected - preventing PWA conversion');
      // Force browser mode on iOS
      document.body.classList.remove('pwa-standalone');
      document.documentElement.classList.remove('pwa-standalone');
      
      // Prevent any PWA-related functionality
      setShowPrompt(false);
      return;
    }

    // Listen for beforeinstallprompt event (Android/Chrome only)
    const handleBeforeInstallPrompt = (e) => {
      // CRITICAL: Block PWA install on iOS
      if (checkIOS()) {
        e.preventDefault();
        console.log('PWA install prompt blocked on iOS');
        return;
      }
      
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Android/Chrome installation
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOS) {
      localStorage.setItem('pwa-ios-dismissed', 'true');
    }
  };

  const handleIOSInstructions = () => {
    // Show iOS-specific instructions
    alert(
      'To add Mavrix Insurance to your home screen:\n\n' +
      '1. Tap the Share button (square with arrow)\n' +
      '2. Scroll down and tap "Add to Home Screen"\n' +
      '3. Tap "Add"\n\n' +
      'The app will now work like a native app!'
    );
  };

  // CRITICAL: Never show PWA prompt on iOS
  if (isIOS || !showPrompt || isStandalone) {
    return null;
  }

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-install-content">
        <div className="pwa-install-icon">
          📱
        </div>
        <div className="pwa-install-text">
          <h3>Install Mavrix Insurance</h3>
          <p>
            {isIOS 
              ? 'Add to home screen for a native app experience'
              : 'Install for quick access and offline use'
            }
          </p>
        </div>
      </div>
      
      <div className="pwa-install-actions">
        {isIOS ? (
          <button 
            className="pwa-install-btn ios-install"
            onClick={handleIOSInstructions}
          >
            How to Install
          </button>
        ) : (
          <button 
            className="pwa-install-btn"
            onClick={handleInstall}
          >
            Install
          </button>
        )}
        
        <button 
          className="pwa-dismiss-btn"
          onClick={handleDismiss}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
