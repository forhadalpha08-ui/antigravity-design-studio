import { useState, useCallback } from 'react';
import { BrandKit } from '../types/canvas';
import { loadBrandKitFromStorage, saveBrandKitToStorage, DEFAULT_BRAND_KIT } from '../utils/storage';

export function useBrandKitState() {
  const [brandKit, setBrandKit] = useState<BrandKit>(loadBrandKitFromStorage);

  const updateBrandKit = useCallback((updater: (prev: BrandKit) => BrandKit) => {
    setBrandKit((prev) => {
      const updated = updater(prev);
      saveBrandKitToStorage(updated);
      return updated;
    });
  }, []);

  const addColor = useCallback((hex: string) => {
    updateBrandKit((prev) => ({
      ...prev,
      colors: prev.colors.includes(hex) ? prev.colors : [...prev.colors, hex],
    }));
  }, [updateBrandKit]);

  const removeColor = useCallback((hex: string) => {
    updateBrandKit((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== hex),
    }));
  }, [updateBrandKit]);

  const updateFonts = useCallback((fonts: BrandKit['fonts']) => {
    updateBrandKit((prev) => ({
      ...prev,
      fonts,
    }));
  }, [updateBrandKit]);

  const resetToDefault = useCallback(() => {
    setBrandKit(DEFAULT_BRAND_KIT);
    saveBrandKitToStorage(DEFAULT_BRAND_KIT);
  }, []);

  return {
    brandKit,
    addColor,
    removeColor,
    updateFonts,
    resetToDefault,
  };
}
