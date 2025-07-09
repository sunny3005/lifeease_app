import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  gender?: string;
  membershipType?: 'Free' | 'Premium';
  joinedDate?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [storedUser, token] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('token')
      ]);

      if (storedUser && token) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log('[AUTH] User loaded from storage:', userData.name);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Clear potentially corrupted data
      await AsyncStorage.multiRemove(['user', 'token']);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const login = async (userData: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      console.log('[AUTH] User logged in successfully:', userData.name);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('user'),
        AsyncStorage.removeItem('token')
      ]);
      setUser(null);
      console.log('[AUTH] User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      // Update user in backend
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://192.168.1.15:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      if (!result.success) {
        throw new Error(result.error || 'Update failed');
      }

      // Update local storage and state
      const updatedUser = { ...user, ...result.user };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      console.log('[AUTH] User updated successfully:', updatedUser.name);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};