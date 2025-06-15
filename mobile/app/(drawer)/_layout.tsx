import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  Chrome as Home,
  Shirt,
  Pill,
  Droplets,
  Calendar,
  ShoppingCart,
  Heart,
  ClipboardList,
  Sparkles,
  User,
  LogOut,
} from 'lucide-react-native';
import { Text, useTheme, Avatar, TouchableRipple, Switch } from 'react-native-paper';

const drawerItems = [
  { name: 'index', label: 'Dashboard', icon: Home },
  { name: 'fashion-assistant', label: 'Fashion Assistant', icon: Shirt },
  { name: 'medicine-reminder', label: 'Medicine Reminder', icon: Pill },
  { name: 'water-reminder', label: 'Water Reminder', icon: Droplets },
  { name: 'scheduler', label: 'Scheduler', icon: Calendar },
  { name: 'grocery-delivery', label: 'Grocery Delivery', icon: ShoppingCart },
  { name: 'donate-clothes', label: 'Donate Clothes', icon: Heart },
  { name: 'day-planner', label: 'Day Planner', icon: ClipboardList },
  { name: 'ai-suggestions', label: 'AI Suggestions', icon: Sparkles },
];

function CustomDrawerContent(props: any) {
  const theme = useTheme();
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContainer}
    >
      {/* Logo and Brand */}
      <View style={styles.logoBox}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
        />
       
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Navigation Links */}
      <View style={styles.linkSection}>
        {drawerItems.map(({ name, label, icon: Icon }) => (
          <DrawerItem
            key={name}
            label={({ color }) => (
              <Text style={[styles.labelText, { color }]}>{label}</Text>
            )}
            icon={({ color, size }) => <Icon size={size} color={color} />}
            onPress={() => props.navigation.navigate(name)}
            style={styles.drawerItem}
          />
        ))}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Profile Section with navigation to 'profile' */}
<TouchableRipple
  onPress={() => props.navigation.navigate('profile')}
  rippleColor="rgba(0, 0, 0, .1)"
  style={{ borderRadius: 12 }}
>
  <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
    <Avatar.Image
      size={48}
      source={{ uri: 'https://i.pravatar.cc/300?img=3' }}
    />
    <View style={{ marginLeft: 12 }}>
      <Text style={styles.nameText}>Sunny Dev</Text>
      <Text style={styles.roleText}>Premium User</Text>
    </View>
  </View>
</TouchableRipple>


      {/* Profile / Settings Bottom */}
      <View style={styles.profileBox}>
       
        {/* Dark Mode Toggle */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleText}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={() => setDarkMode(!darkMode)} />
        </View>

        

        {/* Logout */}
        <TouchableRipple
          onPress={() => console.log('Logout')}
          style={styles.logoutButton}
          borderless
        >
          <View style={styles.logoutRow}>
            <LogOut size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </View>
        </TouchableRipple>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#1e293b',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          backgroundColor: '#ffffff',
          width: 300,
        },
        drawerActiveTintColor: '#4f46e5',
        drawerInactiveTintColor: '#64748b',
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '600',
        },
      }}
    >
      {drawerItems.map(({ name, label, icon }) => (
        <Drawer.Screen
          key={name}
          name={name}
          options={{
            drawerLabel: label,
            title: label,
            drawerIcon: ({ size, color }) => React.createElement(icon, { size, color }),
          }}
        />
      ))}
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#fff',
  },
  logoBox: {
    padding: 24,
    paddingBottom: 16,
  },
  logo: {
    width: 200,
    height: 60,
    resizeMode: 'contain',
    },
  brandTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  linkSection: {
    paddingHorizontal: 8,
  },
  drawerItem: {
    borderRadius: 12,
    marginVertical: 4,
  },
  labelText: {
    fontWeight: '600',
    fontSize: 16,
  },
  profileBox: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  nameText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1e293b',
  },
  roleText: {
    fontSize: 14,
    color: '#64748b',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  toggleText: {
    fontSize: 15,
    color: '#1e293b',
  },
  logoutButton: {
    marginTop: 10,
    paddingVertical: 8,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 10,
    color: '#ef4444',
    fontWeight: '600',
  },
});
