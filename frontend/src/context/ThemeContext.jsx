import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, [theme]);

  const toggleTheme = () => {
    // Platform operates in dark glassmorphism mode
    setTheme('dark');
  };

  return (
    <ThemeContext.Provider value={{ theme: 'dark', isDark: true, toggleTheme }}>
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
