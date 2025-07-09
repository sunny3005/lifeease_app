
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { notificationService } from '../services/notificationService';

interface NotificationContextType {
  expoPushToken: string | null;
  isNotificationEnabled: boolean;
  sendTestNotification: () => Promise<void>;
  initializeNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  const initializeNotifications = async () => {
    try {
      await notificationService.initialize();
      const token = await notificationService.getExpoPushToken();
      setExpoPushToken(token);
      setIsNotificationEnabled(!!token);
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  };

  const sendTestNotification = async () => {
    try {
      await notificationService.sendTestNotification();
    } catch (error) {
      console.error('Failed to send test notification:', error);
    }
  };

  useEffect(() => {
    initializeNotifications();
  }, []);

  const value: NotificationContextType = {
    expoPushToken,
    isNotificationEnabled,
    sendTestNotification,
    initializeNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
