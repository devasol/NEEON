import React, { createContext, useContext, useEffect, useState } from 'react';


const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  DEVICE: 'device'
};


const ThemeContext = createContext();


export const ThemeProvider = ({ children }) => {
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || THEMES.DEVICE;
  });

  
  const getSystemTheme = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? THEMES.DARK 
      : THEMES.LIGHT;
  };

  
  const applyTheme = (themeToApply) => {
    let finalTheme = themeToApply;
    
    
    if (themeToApply === THEMES.DEVICE) {
      finalTheme = getSystemTheme();
    }

    
    document.documentElement.classList.remove(THEMES.LIGHT, THEMES.DARK);
    
    document.documentElement.classList.add(finalTheme);
    
    
    document.documentElement.setAttribute('data-theme', finalTheme);
  };

  
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

  
  useEffect(() => {
    applyTheme(theme);
    
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  
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


export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};