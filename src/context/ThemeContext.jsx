import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get saved theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('docsync-theme');
    console.log('ThemeContext: Initializing with theme:', savedTheme || 'light');
    return savedTheme || 'light';
  });

  useEffect(() => {
    // Save theme preference
    localStorage.setItem('docsync-theme', theme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Add/remove dark-theme class for CSS targeting
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'dark' ? {
    // Dark theme colors
    primary: '#2196F3',
    primaryLight: '#42A5F5',
    primaryDark: '#1976D2',
    background: '#121212',
    surface: '#1E1E1E',
    surfaceHover: '#2A2A2A',
    text: '#E0E0E0',
    textSecondary: '#B0B0B0',
    border: '#333333',
    white: '#FFFFFF',
    black: '#000000',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
    grey: '#757575',
    lightGrey: '#2A2A2A',
  } : {
    // Light theme colors
    primary: '#2196F3',
    primaryLight: '#E3F2FD',
    primaryDark: '#1976D2',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    surfaceHover: '#F5F5F5',
    text: '#333333',
    textSecondary: '#666666',
    border: '#E0E0E0',
    white: '#FFFFFF',
    black: '#000000',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
    grey: '#757575',
    lightGrey: '#F5F5F5',
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    colors,
    isDark: theme === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
