import React, { createContext, useContext, useEffect, useState } from 'react';

type FontSize = 'small' | 'normal' | 'large' | 'xlarge';

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const FONT_SIZES: FontSize[] = ['small', 'normal', 'large', 'xlarge'];

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hof_font_size') as FontSize;
      if (FONT_SIZES.includes(saved)) return saved;
    }
    return 'normal';
  });

  // Permanently disable dark theme and high contrast as requested to ensure 100% clean intended light colors
  const isDark = false;
  const isHighContrast = false;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('dark', 'contrast-high');
      localStorage.removeItem('hof_dark_mode');
      localStorage.removeItem('hof_high_contrast');
    }
  }, []);

  // Apply font size scale changes to documentElement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-font-size', fontSize);
      localStorage.setItem('hof_font_size', fontSize);
    }
  }, [fontSize]);

  const increaseFontSize = () => {
    const currentIndex = FONT_SIZES.indexOf(fontSize);
    if (currentIndex < FONT_SIZES.length - 1) {
      setFontSizeState(FONT_SIZES[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const currentIndex = FONT_SIZES.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSizeState(FONT_SIZES[currentIndex - 1]);
    }
  };

  const resetFontSize = () => {
    setFontSizeState('normal');
  };

  const toggleDarkMode = () => {
    // Disabled as requested
  };

  const toggleHighContrast = () => {
    // Disabled as requested
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize: setFontSizeState,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        isDark,
        toggleDarkMode,
        isHighContrast,
        toggleHighContrast,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export function useAccessibility(): AccessibilityContextType {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
