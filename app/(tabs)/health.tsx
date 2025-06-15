import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Pill,
  Droplets,
  Heart,
  Activity,
  Clock,
  Plus,
  Bell,
  Calendar,
  TrendingUp,
  CheckCircle,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const healthStats = [
  { id: 'water', label: 'Water Intake', value: '6/8', unit: 'glasses', progress: 75, color: '#3b82f6', icon: Droplets },
  { id: 'medicine', label: 'Medications', value: '2/3', unit: 'taken', progress: 67, color: '#10b981', icon: Pill },
  { id: 'heart', label: 'Heart Rate', value: '72', unit: 'bpm', progress: 85, color: '#ef4444', icon: Heart },
  { id: 'steps', label: 'Steps Today', value: '8.2k', unit: 'steps', progress: 82, color: '#f59e0b', icon: Activity },
];

const medications = [
  { id: 1, name: 'Vitamin D', time: '8:00 AM', taken: true, color: '#10b981' },
  { id: 2, name: 'Omega-3', time: '12:00 PM', taken: true, color: '#3b82f6' },
  { id: 3, name: 'Magnesium', time: '8:00 PM', taken: false, color: '#f59e0b' },
];

const waterIntake = [
  { time: '7:00 AM', amount: 250 },
  { time: '9:30 AM', amount: 300 },
  { time: '11:15 AM', amount: 200 },
  { time: '1:45 PM', amount: 350 },
  { time: '3:20 PM', amount: 250 },
  { time: '5:00 PM', amount: 300 },
];

export default function HealthTab() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const renderOverview = () => (
    <>
      {/* Health Stats Grid */}
      <Animated.View entering={FadeInDown.delay(200)}>
        <Text style={styles.sectionTitle}>Today's Health Overview</Text>
        <View style={styles.statsGrid}>
          {healthStats.map((stat, index) => (
            <Animated.View key={stat.id} entering={FadeInUp.delay(300 + index * 100)}>
              <TouchableOpacity style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                  <stat.icon size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
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
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View entering={FadeInUp.delay(500)} style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: '#3b82f6' }]}>
            <Droplets size={24} color="white" />
            <Text style={styles.quickActionText}>Log Water</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: '#10b981' }]}>
            <Pill size={24} color="white" />
            <Text style={styles.quickActionText}>Take Medicine</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: '#f59e0b' }]}>
            <Plus size={24} color="white" />
            <Text style={styles.quickActionText}>Add Reminder</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );

  const renderMedications = () => (
    <Animated.View entering={FadeInDown.delay(200)}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Medications</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#6366f1" />
        </TouchableOpacity>
      </View>
      <View style={styles.medicationsList}>
        {medications.map((med, index) => (
          <Animated.View key={med.id} entering={FadeInUp.delay(300 + index * 100)}>
            <View style={styles.medicationCard}>
              <View style={styles.medicationInfo}>
                <View style={[styles.medicationDot, { backgroundColor: med.color }]} />
                <View style={styles.medicationDetails}>
                  <Text style={styles.medicationName}>{med.name}</Text>
                  <View style={styles.medicationTime}>
                    <Clock size={14} color="#64748b" />
                    <Text style={styles.timeText}>{med.time}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={[styles.medicationStatus, med.taken && styles.medicationTaken]}>
                {med.taken ? (
                  <CheckCircle size={24} color="#10b981" />
                ) : (
                  <View style={styles.medicationPending} />
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const renderWater = () => (
    <Animated.View entering={FadeInDown.delay(200)}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Water Intake Today</Text>
        <Text style={styles.waterGoal}>Goal: 2000ml</Text>
      </View>
      
      <View style={styles.waterProgress}>
        <View style={styles.waterBottle}>
          <View style={styles.waterLevel} />
          <Text style={styles.waterAmount}>1650ml</Text>
        </View>
        <View style={styles.waterStats}>
          <Text style={styles.waterPercentage}>83%</Text>
          <Text style={styles.waterRemaining}>350ml remaining</Text>
        </View>
      </View>

      <View style={styles.waterHistory}>
        <Text style={styles.historyTitle}>Today's Log</Text>
        {waterIntake.map((entry, index) => (
          <Animated.View key={index} entering={FadeInUp.delay(300 + index * 50)}>
            <View style={styles.waterEntry}>
              <View style={styles.waterTime}>
                <Text style={styles.timeText}>{entry.time}</Text>
              </View>
              <View style={styles.waterAmount}>
                <Droplets size={16} color="#3b82f6" />
                <Text style={styles.amountText}>{entry.amount}ml</Text>
              </View>
            </View>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Health Tracker</Text>
          <Text style={styles.headerSubtitle}>Monitor your wellness journey</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color="#6366f1" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Tab Navigation */}
      <Animated.View entering={FadeInDown.delay(150)} style={styles.tabNavigation}>
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'medications', label: 'Medications', icon: Pill },
          { id: 'water', label: 'Water', icon: Droplets },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, selectedTab === tab.id && styles.activeTab]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <tab.icon size={20} color={selectedTab === tab.id ? '#6366f1' : '#64748b'} />
            <Text style={[styles.tabText, selectedTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'medications' && renderMedications()}
        {selectedTab === 'water' && renderWater()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
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
  tabNavigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#f1f5f9',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#6366f1',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 2,
  },
  statUnit: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  quickActionsSection: {
    marginBottom: 32,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  medicationsList: {
    gap: 12,
  },
  medicationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  medicationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  medicationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  medicationDetails: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  medicationTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#64748b',
  },
  medicationStatus: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicationTaken: {
    backgroundColor: '#f0fdf4',
  },
  medicationPending: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  waterGoal: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  waterProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  waterBottle: {
    width: 80,
    height: 120,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#3b82f6',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
    marginRight: 24,
  },
  waterLevel: {
    position: 'absolute',
    bottom: 3,
    left: 3,
    right: 3,
    height: '83%',
    backgroundColor: '#3b82f6',
    borderRadius: 37,
    opacity: 0.3,
  },
  waterAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6',
    zIndex: 1,
  },
  waterStats: {
    flex: 1,
  },
  waterPercentage: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  waterRemaining: {
    fontSize: 14,
    color: '#64748b',
  },
  waterHistory: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  waterEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  waterTime: {
    flex: 1,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
});