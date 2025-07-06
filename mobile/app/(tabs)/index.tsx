import React, { useState, useEffect } from 'react';
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
  Heart,
  Droplets,
  Calendar,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Bell,
  Plus,
  ArrowRight,
} from 'lucide-react-native';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const quickActions = [
  {
    id: 'fashion',
    title: 'Fashion Assistant',
    subtitle: 'AI-powered outfit suggestions',
    icon: Shirt,
    color: '#ec4899',
    route: '/fashion',
  },
  {
    id: 'health',
    title: 'Health Tracker',
    subtitle: 'Monitor your wellness',
    icon: Heart,
    color: '#ef4444',
    route: '/health',
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle Hub',
    subtitle: 'Simplify daily tasks',
    icon: Calendar,
    color: '#3b82f6',
    route: '/lifestyle',
  },
];

const todayStats = [
  { label: 'Water Intake', value: '6/8', unit: 'glasses', progress: 75, color: '#3b82f6' },
  { label: 'Outfits Saved', value: '12', unit: 'items', progress: 100, color: '#ec4899' },
  { label: 'Tasks Done', value: '8/10', unit: 'completed', progress: 80, color: '#10b981' },
];

export default function HomeTab() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Animated values
  const sparkleRotation = useSharedValue(0);
  const cardScale = useSharedValue(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Sparkle animation
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 3000 }),
      -1,
      false
    );

    return () => clearInterval(timer);
  }, []);

  const sparkleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${sparkleRotation.value}deg` }],
    };
  });

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 17) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  const handleCardPress = (route: string) => {
    cardScale.value = withSpring(0.95, {}, () => {
      cardScale.value = withSpring(1);
    });
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.welcomeText}>Welcome to LifeEase</Text>
            <Text style={styles.timeText}>
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#6366f1" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Today's Stats */}
        <Animated.View entering={FadeInUp.delay(200)}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsContainer}>
            {todayStats.map((stat, index) => (
              <Animated.View 
                key={stat.label} 
                entering={FadeInUp.delay(300 + index * 100)}
                style={styles.statCard}
              >
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statUnit}>{stat.unit}</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${stat.progress}%`, backgroundColor: stat.color }
                    ]} 
                  />
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInUp.delay(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Animated.View style={sparkleStyle}>
              <Sparkles size={20} color="#f59e0b" />
            </Animated.View>
          </View>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <Animated.View key={action.id} entering={FadeInUp.delay(500 + index * 100)}>
                <TouchableOpacity
                  style={[styles.actionCard, { backgroundColor: action.color }]}
                  onPress={() => handleCardPress(action.route)}
                  activeOpacity={0.9}
                >
                  <View style={styles.actionCardHeader}>
                    <action.icon size={28} color="white" />
                    <ArrowRight size={20} color="white" />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInUp.delay(600)}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#ec489920' }]}>
                <Shirt size={20} color="#ec4899" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Added new outfit</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#3b82f620' }]}>
                <Droplets size={20} color="#3b82f6" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Completed water goal</Text>
                <Text style={styles.activityTime}>4 hours ago</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#10b98120' }]}>
                <Calendar size={20} color="#10b981" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Scheduled grocery delivery</Text>
                <Text style={styles.activityTime}>Yesterday</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* AI Suggestions */}
        <Animated.View entering={FadeInUp.delay(700)} style={styles.aiSuggestionCard}>
          <View style={styles.aiHeader}>
            <Sparkles size={24} color="#6366f1" />
            <Text style={styles.aiTitle}>AI Suggestion</Text>
          </View>
          <Text style={styles.aiText}>
            Based on today's weather, we recommend wearing light layers. 
            Check out your casual collection for the perfect outfit!
          </Text>
          <TouchableOpacity 
            style={styles.aiButton}
            onPress={() => router.push('/fashion')}
          >
            <Text style={styles.aiButtonText}>View Suggestions</Text>
            <ArrowRight size={16} color="#6366f1" />
          </TouchableOpacity>
        </Animated.View>

        {/* Trending */}
        <Animated.View entering={FadeInUp.delay(800)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending</Text>
            <TrendingUp size={20} color="#f59e0b" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScroll}>
            {[
              { title: 'Summer Vibes', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
              { title: 'Minimalist Style', image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
              { title: 'Casual Chic', image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
            ].map((trend, index) => (
              <View key={index} style={styles.trendingCard}>
                <Image source={{ uri: trend.image }} style={styles.trendingImage} />
                <Text style={styles.trendingTitle}>{trend.title}</Text>
              </View>
            ))}
          </ScrollView>
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
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#64748b',
  },
  notificationButton: {
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
    position: 'relative',
  },
  notificationBadge: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: (width - 60) / 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 2,
  },
  statUnit: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  quickActionsGrid: {
    marginBottom: 32,
  },
  actionCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  actionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 14,
    color: '#64748b',
  },
  aiSuggestionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 8,
  },
  aiText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  aiButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    marginRight: 8,
  },
  trendingScroll: {
    marginBottom: 32,
  },
  trendingCard: {
    marginRight: 16,
    alignItems: 'center',
  },
  trendingImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginBottom: 8,
  },
  trendingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
});