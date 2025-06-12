import { Drawer } from 'expo-router/drawer';
import { Chrome as Home, Shirt, Pill, Droplets, Calendar, ShoppingCart, Heart, ClipboardList, Sparkles, User } from 'lucide-react-native';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6366f1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          backgroundColor: '#f8fafc',
        },
        drawerActiveTintColor: '#6366f1',
        drawerInactiveTintColor: '#64748b',
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 16,
          fontWeight: '500',
        },
      }}>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Dashboard',
          title: 'LifeEase Dashboard',
          drawerIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="fashion-assistant"
        options={{
          drawerLabel: 'Fashion Assistant',
          title: 'Fashion Assistant',
          drawerIcon: ({ size, color }) => (
            <Shirt size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="medicine-reminder"
        options={{
          drawerLabel: 'Medicine Reminder',
          title: 'Medicine Reminder',
          drawerIcon: ({ size, color }) => (
            <Pill size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="water-reminder"
        options={{
          drawerLabel: 'Water Reminder',
          title: 'Water Reminder',
          drawerIcon: ({ size, color }) => (
            <Droplets size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="scheduler"
        options={{
          drawerLabel: 'Scheduler',
          title: 'Scheduler',
          drawerIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="grocery-delivery"
        options={{
          drawerLabel: 'Grocery Delivery',
          title: 'Grocery Delivery',
          drawerIcon: ({ size, color }) => (
            <ShoppingCart size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="donate-clothes"
        options={{
          drawerLabel: 'Donate Clothes',
          title: 'Donate Clothes',
          drawerIcon: ({ size, color }) => (
            <Heart size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="day-planner"
        options={{
          drawerLabel: 'Day Planner',
          title: 'Day Planner',
          drawerIcon: ({ size, color }) => (
            <ClipboardList size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ai-suggestions"
        options={{
          drawerLabel: 'AI Suggestions',
          title: 'AI Suggestions',
          drawerIcon: ({ size, color }) => (
            <Sparkles size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Profile',
          title: 'Profile',
          drawerIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}