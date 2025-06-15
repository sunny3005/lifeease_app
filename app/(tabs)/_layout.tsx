import React from 'react';
import { Tabs } from 'expo-router';
import { 
  Home, 
  Shirt, 
  Pill, 
  Droplets, 
  Calendar, 
  ShoppingCart, 
  Heart, 
  ClipboardList, 
  Sparkles, 
  User 
} from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="fashion"
        options={{
          title: 'Fashion',
          tabBarIcon: ({ size, color }) => (
            <Shirt size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: 'Health',
          tabBarIcon: ({ size, color }) => (
            <Pill size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lifestyle"
        options={{
          title: 'Lifestyle',
          tabBarIcon: ({ size, color }) => (
            <Sparkles size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}