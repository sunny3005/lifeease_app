import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
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
  ArrowRight
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 cards per row with margins

interface FeatureCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  route: string;
  color: string;
  gradient: string[];
}

const features: FeatureCard[] = [
  {
    id: 'fashion',
    title: 'Fashion Assistant',
    subtitle: 'Style recommendations',
    icon: Shirt,
    route: '/fashion-assistant',
    color: '#ec4899',
    gradient: ['#ec4899', '#be185d']
  },
  {
    id: 'medicine',
    title: 'Medicine Reminder',
    subtitle: 'Never miss a dose',
    icon: Pill,
    route: '/medicine-reminder',
    color: '#10b981',
    gradient: ['#10b981', '#047857']
  },
  {
    id: 'water',
    title: 'Water Reminder',
    subtitle: 'Stay hydrated',
    icon: Droplets,
    route: '/water-reminder',
    color: '#3b82f6',
    gradient: ['#3b82f6', '#1d4ed8']
  },
  {
    id: 'scheduler',
    title: 'Scheduler',
    subtitle: 'Manage appointments',
    icon: Calendar,
    route: '/scheduler',
    color: '#f59e0b',
    gradient: ['#f59e0b', '#d97706']
  },
  {
    id: 'grocery',
    title: 'Grocery Delivery',
    subtitle: 'Order essentials',
    icon: ShoppingCart,
    route: '/grocery-delivery',
    color: '#8b5cf6',
    gradient: ['#8b5cf6', '#7c3aed']
  },
  {
    id: 'donate',
    title: 'Donate Clothes',
    subtitle: 'Give back',
    icon: Heart,
    route: '/donate-clothes',
    color: '#ef4444',
    gradient: ['#ef4444', '#dc2626']
  },
  {
    id: 'planner',
    title: 'Day Planner',
    subtitle: 'Plan your day',
    icon: ClipboardList,
    route: '/day-planner',
    color: '#06b6d4',
    gradient: ['#06b6d4', '#0891b2']
  },
  {
    id: 'ai',
    title: 'AI Suggestions',
    subtitle: 'Smart recommendations',
    icon: Sparkles,
    route: '/ai-suggestions',
    color: '#6366f1',
    gradient: ['#6366f1', '#4f46e5']
  }
];

export default function AssistantDashboard() {
  const router = useRouter();

  const handleCardPress = (route: string) => {
    router.push(route as any);
  };

  const renderFeatureCard = (feature: FeatureCard, index: number) => {
    const IconComponent = feature.icon;
    
    return (
      <TouchableOpacity
        key={feature.id}
        style={[
          styles.featureCard,
          { 
            backgroundColor: feature.color,
            marginRight: index % 2 === 0 ? 10 : 0,
            marginLeft: index % 2 === 1 ? 10 : 0,
          }
        ]}
        onPress={() => handleCardPress(feature.route)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <IconComponent size={28} color="white" />
          </View>
          <View style={styles.arrowContainer}>
            <ArrowRight size={20} color="rgba(255,255,255,0.8)" />
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{feature.title}</Text>
          <Text style={styles.cardSubtitle}>{feature.subtitle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.headerTitle}>LifeEase Dashboard</Text>
            <Text style={styles.headerSubtitle}>
              Your personal lifestyle assistant is here to help you manage your daily life with ease.
            </Text>
          </View>
          
         
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Active Features</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>Smart</Text>
            <Text style={styles.statLabel}>AI Powered</Text>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Your Features</Text>
          <Text style={styles.sectionSubtitle}>
            Tap any card to access your lifestyle tools
          </Text>
          
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => renderFeatureCard(feature, index))}
          </View>
        </View>

        {/* Profile Quick Access */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => handleCardPress('/profile')}
          activeOpacity={0.8}
        >
          <View style={styles.profileContent}>
            <View style={styles.profileIconContainer}>
              <User size={24} color="#6366f1" />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileTitle}>Manage Profile</Text>
              <Text style={styles.profileSubtitle}>Update your preferences and settings</Text>
            </View>
            <ArrowRight size={20} color="#6366f1" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  welcomeContainer: {
    flex: 1,
    paddingRight: 15,
  },
  welcomeText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
  },
  dashboardIconContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  featureCard: {
    width: cardWidth,
    height: 140,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowContainer: {
    opacity: 0.8,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  profileCard: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIconContainer: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  profileText: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
});