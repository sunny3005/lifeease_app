import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
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
  ArrowRight,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

const features = [
  {
    id: 'fashion',
    title: 'Fashion Assistant',
    subtitle: 'Style recommendations',
    icon: Shirt,
    route: '/fashion-assistant',
    color: '#ec4899',
  },
  {
    id: 'medicine',
    title: 'Medicine Reminder',
    subtitle: 'Never miss a dose',
    icon: Pill,
    route: '/medicine-reminder',
    color: '#10b981',
  },
  {
    id: 'water',
    title: 'Water Reminder',
    subtitle: 'Stay hydrated',
    icon: Droplets,
    route: '/water-reminder',
    color: '#3b82f6',
  },
  {
    id: 'scheduler',
    title: 'Scheduler',
    subtitle: 'Manage appointments',
    icon: Calendar,
    route: '/scheduler',
    color: '#f59e0b',
  },
  {
    id: 'grocery',
    title: 'Grocery Delivery',
    subtitle: 'Order essentials',
    icon: ShoppingCart,
    route: '/grocery-delivery',
    color: '#8b5cf6',
  },
  {
    id: 'donate',
    title: 'Donate Clothes',
    subtitle: 'Give back',
    icon: Heart,
    route: '/donate-clothes',
    color: '#ef4444',
  },
  {
    id: 'planner',
    title: 'Day Planner',
    subtitle: 'Plan your day',
    icon: ClipboardList,
    route: '/day-planner',
    color: '#06b6d4',
  },
  {
    id: 'ai',
    title: 'AI Suggestions',
    subtitle: 'Smart recommendations',
    icon: Sparkles,
    route: '/ai-suggestions',
    color: '#6366f1',
  },
];

export default function AssistantDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();

  const handleCardPress = (route) => {
    router.push(route);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 17) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.heroSection}>
          <Text style={styles.heroGreeting}>{getGreeting()}, {user?.name?.split(' ')[0] || 'User'}!</Text>
          <Text style={styles.heroTitle}>Welcome to LifeEase</Text>
          <Text style={styles.heroSubtitle}>
            Your personal assistant is ready to help you organize and elevate your daily life.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statText}>Features</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>24/7</Text>
            <Text style={styles.statText}>Access</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user?.membershipType || 'Free'}</Text>
            <Text style={styles.statText}>Plan</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(500)}>
          <Text style={styles.sectionHeading}>✨ Explore Tools</Text>
          <View style={styles.grid}>
            {features.map((feature, index) => (
              <TouchableOpacity
                key={feature.id}
                style={[styles.card, { backgroundColor: feature.color }]}
                onPress={() => handleCardPress(feature.route)}
                activeOpacity={0.9}
              >
                <View style={styles.cardTop}>
                  <feature.icon size={26} color="white" />
                  <ArrowRight size={18} color="white" />
                </View>
                <Text style={styles.cardTitle}>{feature.title}</Text>
                <Text style={styles.cardSubtitle}>{feature.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(700)}>
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => handleCardPress('/profile')}
            activeOpacity={0.85}
          >
            <User size={22} color={colors.primary} style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.profileTitle}>Manage Profile</Text>
              <Text style={styles.profileSubtitle}>Customize your preferences</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 20, paddingBottom: 40 },
  heroSection: { marginBottom: 24 },
  heroGreeting: { fontSize: 16, color: colors.textSecondary, marginBottom: 4 },
  heroTitle: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 6 },
  heroSubtitle: { fontSize: 15, color: colors.textSecondary, lineHeight: 22 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { fontSize: 18, fontWeight: '700', color: colors.text },
  statText: { fontSize: 12, color: colors.textSecondary },
  sectionHeading: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: cardWidth,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: 'white', marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  profileSubtitle: { fontSize: 13, color: colors.textSecondary },
});