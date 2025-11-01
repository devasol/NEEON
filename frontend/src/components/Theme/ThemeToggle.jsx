import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme, THEMES } = useTheme();

  return (
    <div className="theme-toggle">
      <select 
        value={theme} 
        onChange={(e) => toggleTheme(e.target.value)}
        className="theme-dropdown"
      >
        <option value={THEMES.LIGHT}>Light Theme</option>
        <option value={THEMES.DARK}>Dark Theme</option>
        <option value={THEMES.DEVICE}>System Theme</option>
      </select>
    </div>
  );
};

export default ThemeToggle;