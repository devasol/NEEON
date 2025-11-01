import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme, THEMES } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const getThemeIcon = () => {
    
    if (theme === THEMES.DARK) {
      return <FaMoon className="theme-icon" />;
    }
    return <FaSun className="theme-icon" />;
  };

  const getThemeLabel = () => {
    return theme === THEMES.DARK ? "Switch to Light Mode" : "Switch to Dark Mode";
  };

  const handleClick = () => {
    
    setIsAnimating(true);
    
    setTimeout(() => setIsAnimating(false), 500);
    
    
    const newTheme = theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    toggleTheme(newTheme);
  };

  
  const themeClass = theme === THEMES.DARK ? 'dark-theme' : 'light-theme';

  return (
    <div className="theme-toggle" title={getThemeLabel()}>
      <button 
        className={`theme-switch-button ${themeClass} ${isAnimating ? 'animating' : ''}`}
        onClick={handleClick}
        aria-label={getThemeLabel()}
      >
        {getThemeIcon()}
      </button>
    </div>
  );
};

export default ThemeToggle;