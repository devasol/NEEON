import React, { createContext, useContext, useEffect, useState } from 'react';

// Define theme types
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  DEVICE: 'device'
};

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Get saved theme from localStorage or default to device theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || THEMES.DEVICE;
  });

  // Get system preference
  const getSystemTheme = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? THEMES.DARK 
      : THEMES.LIGHT;
  };

  // Apply theme to document
  const applyTheme = (themeToApply) => {
    let finalTheme = themeToApply;
    
    // If device theme is selected, use system preference
    if (themeToApply === THEMES.DEVICE) {
      finalTheme = getSystemTheme();
    }

    // Remove all theme classes
    document.documentElement.classList.remove(THEMES.LIGHT, THEMES.DARK);
    // Add the selected theme class
    document.documentElement.classList.add(finalTheme);
    
    // Set data-theme attribute for CSS
    document.documentElement.setAttribute('data-theme', finalTheme);
  };

  // Handle system theme changes
  useEffect(() => {
    const handleSystemThemeChange = (e) => {
      if (theme === THEMES.DEVICE) {
        applyTheme(THEMES.DEVICE);
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  // Apply theme when theme state changes
  useEffect(() => {
    applyTheme(theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Initialize theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, []);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    THEMES
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};