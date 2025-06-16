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
  Moon,
  Sun,
} from 'lucide-react-native';
import { Text, Avatar, TouchableRipple, Switch } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';

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
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  const styles = createStyles(colors);

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
            activeTintColor={colors.primary}
            inactiveTintColor={colors.textSecondary}
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
        <View style={styles.profileSection}>
          <Avatar.Image
            size={48}
            source={{ uri: user?.avatar || 'https://i.pravatar.cc/300?img=3' }}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.nameText}>{user?.name || 'User'}</Text>
            <Text style={styles.roleText}>{user?.membershipType || 'Free'} User</Text>
          </View>
        </View>
      </TouchableRipple>

      {/* Profile / Settings Bottom */}
      <View style={styles.profileBox}>
        {/* Dark Mode Toggle */}
        <TouchableRipple onPress={toggleDarkMode} style={styles.toggleRow}>
          <View style={styles.toggleContent}>
            {darkMode ? <Moon size={20} color={colors.primary} /> : <Sun size={20} color={colors.primary} />}
            <Text style={styles.toggleText}>Dark Mode</Text>
            <Switch value={darkMode} onValueChange={toggleDarkMode} />
          </View>
        </TouchableRipple>

        {/* Logout */}
        <TouchableRipple
          onPress={handleLogout}
          style={styles.logoutButton}
          borderless
        >
          <View style={styles.logoutRow}>
            <LogOut size={20} color={colors.error} />
            <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
          </View>
        </TouchableRipple>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const { colors } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          backgroundColor: colors.surface,
          width: 300,
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
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

const createStyles = (colors: any) => StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: colors.surface,
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
  divider: {
    height: 1,
    backgroundColor: colors.border,
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  profileInfo: {
    marginLeft: 12,
  },
  nameText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  roleText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  profileBox: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  toggleRow: {
    marginBottom: 10,
    borderRadius: 8,
  },
  toggleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  toggleText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  logoutButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 10,
    fontWeight: '600',
  },
});