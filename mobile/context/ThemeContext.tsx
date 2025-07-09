import React, { createContext, useContext, useState } from 'react';

const lightTheme = {
  background: '#ffffff',
  text: '#000000',
  textSecondary: '#555555',
  surface: '#f0f0f0',
  border: '#cccccc',
  primary: '#4f46e5',
  secondary: '#6366f1',
};

const darkTheme = {
  background: '#121212',
  text: '#ffffff',
  textSecondary: '#aaaaaa',
  surface: '#1f1f1f',
  border: '#444444',
  primary: '#8b5cf6',
  secondary: '#7c3aed',
};

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof lightTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  const colors = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
