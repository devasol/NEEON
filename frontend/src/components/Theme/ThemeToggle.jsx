import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme, THEMES } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const getThemeIcon = () => {
    switch (theme) {
      case THEMES.LIGHT:
        return <FaSun className="theme-icon sun-icon" />;
      case THEMES.DARK:
        return <FaMoon className="theme-icon moon-icon" />;
      case THEMES.DEVICE:
        return <FaDesktop className="theme-icon system-icon" />;
      default:
        return <FaSun className="theme-icon sun-icon" />;
    }
  };

  const nextTheme = () => {
    if (theme === THEMES.LIGHT) return THEMES.DARK;
    if (theme === THEMES.DARK) return THEMES.DEVICE;
    return THEMES.LIGHT;
  };

  const handleClick = () => {
    // Add ripple animation class
    setIsAnimating(true);
    // Remove the animation class after the animation completes
    setTimeout(() => setIsAnimating(false), 600);
    
    // Toggle the theme
    toggleTheme(nextTheme());
  };

  const getThemeLabel = () => {
    switch (theme) {
      case THEMES.LIGHT:
        return "Light Theme";
      case THEMES.DARK:
        return "Dark Theme";
      case THEMES.DEVICE:
        return "System Theme";
      default:
        return "Theme";
    }
  };

  const getThemeClass = () => {
    switch (theme) {
      case THEMES.LIGHT:
        return "light-mode";
      case THEMES.DARK:
        return "dark-mode";
      case THEMES.DEVICE:
        return "system-mode";
      default:
        return "";
    }
  };

  return (
    <div className={`theme-toggle ${getThemeClass()}`} onClick={handleClick} title={getThemeLabel()}>
      <button className={`theme-switch-button ${isAnimating ? 'ripple' : ''}`}>
        {getThemeIcon()}
      </button>
    </div>
  );
};

export default ThemeToggle;