import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'af_canvas_pwa_installed_v1';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;

    // Check localStorage record
    if (localStorage.getItem(STORAGE_KEY) === 'true') {
      return true;
    }

    // Check display-mode standalone
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }

    // Check iOS standalone
    if ((navigator as any).standalone === true) {
      return true;
    }

    // Check android app referrer
    if (document.referrer && document.referrer.includes('android-app://')) {
      return true;
    }

    return false;
  });

  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  useEffect(() => {
    // If already detected as installed, do nothing
    if (isInstalled) return;

    // 1. BeforeInstallPrompt Event (Chrome / Edge on Android & Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // 2. AppInstalled Event (Native installation completed)
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch (err) {
        // ignore storage errors
      }
    };

    // 3. MatchMedia display-mode listener
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        try {
          localStorage.setItem(STORAGE_KEY, 'true');
        } catch (err) {}
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleDisplayModeChange);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleDisplayModeChange);
      }
    };
  }, [isInstalled]);

  // Trigger installation
  const promptInstall = useCallback(async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          localStorage.setItem(STORAGE_KEY, 'true');
          return 'accepted';
        } else {
          return 'dismissed';
        }
      } catch (err) {
        setIsInstallModalOpen(true);
        return 'modal';
      }
    } else {
      // Fallback: Open install guide modal for manual addition on Android / Desktop / iOS
      setIsInstallModalOpen(true);
      return 'modal';
    }
  }, [deferredPrompt]);

  const markAsInstalled = useCallback(() => {
    setIsInstalled(true);
    setDeferredPrompt(null);
    setIsInstallModalOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (err) {}
  }, []);

  return {
    isInstalled,
    isInstallable: !isInstalled,
    hasNativePrompt: Boolean(deferredPrompt),
    promptInstall,
    isInstallModalOpen,
    setIsInstallModalOpen,
    markAsInstalled,
  };
}
