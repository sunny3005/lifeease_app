import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  Settings,
  Bell,
  Shield,
  Heart,
  HelpCircle,
  LogOut,
  Edit3,
  Crown,
  Star,
  ChevronRight,
  Moon,
  Sun,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';

const profileStats = [
  { label: 'Outfits', value: '24', color: '#ec4899' },
  { label: 'Health Score', value: '85%', color: '#10b981' },
  { label: 'Tasks Done', value: '156', color: '#3b82f6' },
];

const menuSections = [
  {
    title: 'Account',
    items: [
      { id: 'edit-profile', label: 'Edit Profile', icon: Edit3, color: '#6366f1' },
      { id: 'notifications', label: 'Notifications', icon: Bell, color: '#f59e0b' },
      { id: 'privacy', label: 'Privacy & Security', icon: Shield, color: '#10b981' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { id: 'theme', label: 'Dark Mode', icon: Moon, color: '#64748b', toggle: true },
      { id: 'premium', label: 'Upgrade to Premium', icon: Crown, color: '#f59e0b', badge: 'Pro' },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'help', label: 'Help Center', icon: HelpCircle, color: '#3b82f6' },
      { id: 'feedback', label: 'Send Feedback', icon: Heart, color: '#ec4899' },
    ],
  },
];

export default function ProfileTab() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  const handleMenuPress = (itemId: string) => {
    switch (itemId) {
      case 'theme':
        setDarkMode(!darkMode);
        break;
      case 'edit-profile':
        // Navigate to edit profile
        break;
      case 'premium':
        // Navigate to premium upgrade
        break;
      default:
        console.log(`Pressed: ${itemId}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#6366f1" />
          </TouchableOpacity>
        </Animated.View>

        {/* Profile Card */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image
              source={{
                uri: user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
              }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
              <View style={styles.membershipBadge}>
                <Crown size={16} color="#f59e0b" />
                <Text style={styles.membershipText}>{user?.membershipType || 'Free'} Member</Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            {profileStats.map((stat, index) => (
              <Animated.View key={stat.label} entering={FadeInUp.delay(300 + index * 100)}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <Animated.View
            key={section.title}
            entering={FadeInUp.delay(400 + sectionIndex * 100)}
            style={styles.menuSection}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuItems}>
              {section.items.map((item, itemIndex) => (
                <Animated.View key={item.id} entering={FadeInUp.delay(500 + itemIndex * 50)}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleMenuPress(item.id)}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                        <item.icon size={20} color={item.color} />
                      </View>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                      {item.badge && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.menuItemRight}>
                      {item.toggle ? (
                        <TouchableOpacity
                          style={[styles.toggle, darkMode && styles.toggleActive]}
                          onPress={() => setDarkMode(!darkMode)}
                        >
                          <View style={[styles.toggleThumb, darkMode && styles.toggleThumbActive]}>
                            {darkMode ? <Moon size={12} color="white" /> : <Sun size={12} color="#64748b" />}
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <ChevronRight size={20} color="#94a3b8" />
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Logout Button */}
        <Animated.View entering={FadeInUp.delay(800)} style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* App Version */}
        <Animated.View entering={FadeInUp.delay(900)} style={styles.versionInfo}>
          <Text style={styles.versionText}>LifeEase v1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with ❤️ for better living</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    borderWidth: 3,
    borderColor: '#6366f1',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    gap: 6,
  },
  membershipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItems: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    flex: 1,
  },
  badge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  menuItemRight: {
    marginLeft: 16,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#6366f1',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  logoutSection: {
    marginBottom: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#fee2e2',
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: '#cbd5e1',
  },
});