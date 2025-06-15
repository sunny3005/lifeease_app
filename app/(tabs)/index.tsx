import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Shirt,
  Pill,
  Droplets,
  Calendar,
  ShoppingCart,
  Heart,
  ClipboardList,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Sunrise,
  Bell,
  TrendingUp,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

const features = [
  {
    id: 'fashion',
    title: 'Fashion Assistant',
    subtitle: 'AI-powered styling',
    icon: Shirt,
    route: '/fashion',
    color: '#ec4899',
    gradient: ['#ec4899', '#be185d'],
  },
  {
    id: 'medicine',
    title: 'Medicine Tracker',
    subtitle: 'Never miss a dose',
    icon: Pill,
    route: '/health',
    color: '#10b981',
    gradient: ['#10b981', '#047857'],
  },
  {
    id: 'water',
    title: 'Hydration',
    subtitle: 'Stay refreshed',
    icon: Droplets,
    route: '/health',
    color: '#3b82f6',
    gradient: ['#3b82f6', '#1d4ed8'],
  },
  {
    id: 'scheduler',
    title: 'Smart Planner',
    subtitle: 'Organize your day',
    icon: Calendar,
    route: '/lifestyle',
    color: '#f59e0b',
    gradient: ['#f59e0b', '#d97706'],
  },
  {
    id: 'grocery',
    title: 'Quick Shop',
    subtitle: 'Instant delivery',
    icon: ShoppingCart,
    route: '/lifestyle',
    color: '#8b5cf6',
    gradient: ['#8b5cf6', '#7c3aed'],
  },
  {
    id: 'donate',
    title: 'Give Back',
    subtitle: 'Donate clothes',
    icon: Heart,
    route: '/fashion',
    color: '#ef4444',
    gradient: ['#ef4444', '#dc2626'],
  },
];

export default function HomeTab() {
  const router = useRouter();
  const { user } = useAuth();

  const handleCardPress = (route: string) => {
    router.push(route);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: Sunrise, color: '#f59e0b' };
    if (hour < 17) return { text: 'Good Afternoon', icon: Sun, color: '#f97316' };
    return { text: 'Good Evening', icon: Moon, color: '#6366f1' };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View style={styles.profileSection}>
            <Image
              source={{ 
                uri: user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face'
              }}
              style={styles.avatar}
            />
            <View style={styles.greetingContainer}>
              <View style={styles.greetingRow}>
                <GreetingIcon size={20} color={greeting.color} />
                <Text style={[styles.greetingText, { color: greeting.color }]}>
                  {greeting.text}
                </Text>
              </View>
              <Text style={styles.userName}>
                {user?.name?.split(' ')[0] || 'Welcome'}!
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.notificationBadge}
            onPress={() => router.push('/profile')}
          >
            <Bell size={20} color="white" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Welcome Card */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <Text style={styles.welcomeTitle}>Your Personal Life Assistant</Text>
            <TrendingUp size={24} color="#6366f1" />
          </View>
          <Text style={styles.welcomeSubtitle}>
            Streamline your daily routine with AI-powered recommendations and smart reminders
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Features</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.membershipType || 'Free'}</Text>
              <Text style={styles.statLabel}>Plan</Text>
            </View>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInUp.delay(300)}>
          <Text style={styles.sectionTitle}>✨ Quick Actions</Text>
          <View style={styles.grid}>
            {features.map((feature, index) => (
              <Animated.View
                key={feature.id}
                entering={FadeInUp.delay(400 + index * 50)}
              >
                <TouchableOpacity
                  style={[styles.card, { backgroundColor: feature.color }]}
                  onPress={() => handleCardPress(feature.route)}
                  activeOpacity={0.85}
                >
                  <View style={styles.cardHeader}>
                    <feature.icon size={28} color="white" strokeWidth={2} />
                    <ArrowRight size={20} color="rgba(255,255,255,0.8)" />
                  </View>
                  <Text style={styles.cardTitle}>{feature.title}</Text>
                  <Text style={styles.cardSubtitle}>{feature.subtitle}</Text>
                  <View style={[styles.cardGlow, { backgroundColor: feature.color }]} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.activitySection}>
          <Text style={styles.sectionTitle}>📊 Today's Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressItem}>
              <View style={styles.progressIconContainer}>
                <Droplets size={24} color="#3b82f6" />
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Water Intake</Text>
                <Text style={styles.progressValue}>6/8 glasses</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '75%', backgroundColor: '#3b82f6' }]} />
                </View>
              </View>
            </View>
            
            <View style={styles.progressItem}>
              <View style={styles.progressIconContainer}>
                <Pill size={24} color="#10b981" />
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Medications</Text>
                <Text style={styles.progressValue}>2/3 taken</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '67%', backgroundColor: '#10b981' }]} />
                </View>
              </View>
            </View>
          </View>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  notificationBadge: {
    backgroundColor: '#6366f1',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  welcomeCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  card: {
    width: cardWidth,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  cardGlow: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.2,
  },
  activitySection: {
    marginBottom: 20,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});