import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  error: string;
  success: string;
  warning: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const lightColors: ThemeColors = {
  background: '#f8fafc',
  surface: '#ffffff',
  primary: '#6366f1',
  secondary: '#e2e8f0',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  card: '#ffffff',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
};

const darkColors: ThemeColors = {
  background: '#0f172a',
  surface: '#1e293b',
  primary: '#818cf8',
  secondary: '#334155',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#334155',
  card: '#1e293b',
  error: '#f87171',
  success: '#34d399',
  warning: '#fbbf24',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { darkMode, toggleDarkMode } = useAuth();

  const value: ThemeContextType = {
    colors: darkMode ? darkColors : lightColors,
    darkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};