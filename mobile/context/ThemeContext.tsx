import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

const lightTheme: ThemeColors = {
  background: '#ffffff',
<<<<<<< HEAD
  surface: '#f8fafc',
  card: '#ffffff',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  primary: '#6366f1',
  secondary: '#f1f5f9',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
=======
  text: '#000000',
  textSecondary: '#555555',
  surface: '#f0f0f0',
  border: '#cccccc',
  primary: '#4f46e5',
  secondary: '#6366f1',
  card: '#ffffff',
  error: '#ef4444',
  success: '#10b981',
>>>>>>> 3347359 (Assistant checkpoint: Updated Donate Clothes page and fixed theme toggle)
};

const darkTheme: ThemeColors = {
  background: '#0f172a',
  surface: '#1e293b',
  card: '#334155',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  border: '#475569',
  primary: '#8b5cf6',
<<<<<<< HEAD
  secondary: '#374151',
  success: '#22c55e',
  warning: '#fbbf24',
  error: '#f87171',
  info: '#60a5fa',
=======
  secondary: '#7c3aed',
  card: '#1a1a1a',
  error: '#f87171',
  success: '#34d399',
>>>>>>> 3347359 (Assistant checkpoint: Updated Donate Clothes page and fixed theme toggle)
};

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDark(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('theme', JSON.stringify(newTheme));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const colors = isDark ? darkTheme : lightTheme;

  if (isLoading) {
    return null; // or a loading spinner
  }

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