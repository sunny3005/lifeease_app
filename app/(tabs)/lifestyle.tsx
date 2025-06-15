import React, { useState } from 'react';
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
import {
  Calendar,
  ShoppingCart,
  MapPin,
  Clock,
  Star,
  Plus,
  ChevronRight,
  Truck,
  Package,
  Coffee,
  Utensils,
  Home,
  Car,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const upcomingEvents = [
  {
    id: 1,
    title: 'Team Meeting',
    time: '10:00 AM',
    date: 'Today',
    type: 'work',
    color: '#3b82f6',
  },
  {
    id: 2,
    title: 'Grocery Shopping',
    time: '2:00 PM',
    date: 'Today',
    type: 'personal',
    color: '#10b981',
  },
  {
    id: 3,
    title: 'Dinner with Friends',
    time: '7:00 PM',
    date: 'Tomorrow',
    type: 'social',
    color: '#ec4899',
  },
];

const quickServices = [
  { id: 'grocery', name: 'Grocery', icon: ShoppingCart, color: '#10b981', delivery: '30 min' },
  { id: 'food', name: 'Food', icon: Utensils, color: '#f59e0b', delivery: '25 min' },
  { id: 'coffee', name: 'Coffee', icon: Coffee, color: '#8b5cf6', delivery: '15 min' },
  { id: 'pharmacy', name: 'Pharmacy', icon: Package, color: '#ef4444', delivery: '45 min' },
];

const recentOrders = [
  {
    id: 1,
    service: 'Grocery Delivery',
    items: 'Fresh vegetables, Milk, Bread',
    status: 'Delivered',
    time: '2 hours ago',
    image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
  },
  {
    id: 2,
    service: 'Food Delivery',
    items: 'Pizza Margherita, Garlic Bread',
    status: 'On the way',
    time: '15 min',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
  },
];

const lifestyleCategories = [
  { id: 'home', name: 'Home Services', icon: Home, color: '#6366f1', count: 12 },
  { id: 'transport', name: 'Transportation', icon: Car, color: '#f59e0b', count: 8 },
  { id: 'wellness', name: 'Wellness', icon: Star, color: '#ec4899', count: 15 },
  { id: 'delivery', name: 'Delivery', icon: Truck, color: '#10b981', count: 20 },
];

export default function LifestyleTab() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Lifestyle Hub</Text>
            <Text style={styles.headerSubtitle}>Simplify your daily tasks</Text>
          </View>
          <TouchableOpacity style={styles.locationButton}>
            <MapPin size={20} color="#6366f1" />
            <Text style={styles.locationText}>Home</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Today's Schedule */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color="#6366f1" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventsScroll}>
            {upcomingEvents.map((event, index) => (
              <Animated.View key={event.id} entering={FadeInUp.delay(300 + index * 100)}>
                <TouchableOpacity style={[styles.eventCard, { borderLeftColor: event.color }]}>
                  <View style={styles.eventTime}>
                    <Clock size={16} color={event.color} />
                    <Text style={[styles.timeText, { color: event.color }]}>{event.time}</Text>
                  </View>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDate}>{event.date}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
            <TouchableOpacity style={styles.addEventCard}>
              <Plus size={24} color="#6366f1" />
              <Text style={styles.addEventText}>Add Event</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>

        {/* Quick Services */}
        <Animated.View entering={FadeInUp.delay(400)}>
          <Text style={styles.sectionTitle}>Quick Services</Text>
          <View style={styles.servicesGrid}>
            {quickServices.map((service, index) => (
              <Animated.View key={service.id} entering={FadeInUp.delay(500 + index * 50)}>
                <TouchableOpacity style={styles.serviceCard}>
                  <View style={[styles.serviceIcon, { backgroundColor: `${service.color}20` }]}>
                    <service.icon size={24} color={service.color} />
                  </View>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <View style={styles.deliveryInfo}>
                    <Truck size={12} color="#64748b" />
                    <Text style={styles.deliveryTime}>{service.delivery}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Categories */}
        <Animated.View entering={FadeInUp.delay(600)}>
          <Text style={styles.sectionTitle}>Lifestyle Categories</Text>
          <View style={styles.categoriesGrid}>
            {lifestyleCategories.map((category, index) => (
              <Animated.View key={category.id} entering={FadeInUp.delay(700 + index * 50)}>
                <TouchableOpacity 
                  style={[styles.categoryCard, { backgroundColor: category.color }]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <category.icon size={28} color="white" />
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>{category.count} services</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Orders */}
        <Animated.View entering={FadeInUp.delay(800)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color="#6366f1" />
            </TouchableOpacity>
          </View>
          <View style={styles.ordersList}>
            {recentOrders.map((order, index) => (
              <Animated.View key={order.id} entering={FadeInUp.delay(900 + index * 100)}>
                <TouchableOpacity style={styles.orderCard}>
                  <Image source={{ uri: order.image }} style={styles.orderImage} />
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderService}>{order.service}</Text>
                    <Text style={styles.orderItems}>{order.items}</Text>
                    <View style={styles.orderStatus}>
                      <View style={[
                        styles.statusDot, 
                        { backgroundColor: order.status === 'Delivered' ? '#10b981' : '#f59e0b' }
                      ]} />
                      <Text style={styles.statusText}>{order.status}</Text>
                      <Text style={styles.orderTime}>• {order.time}</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#94a3b8" />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* AI Recommendations */}
        <Animated.View entering={FadeInUp.delay(1000)} style={styles.recommendationsCard}>
          <View style={styles.recommendationsHeader}>
            <Star size={24} color="#f59e0b" />
            <Text style={styles.recommendationsTitle}>Smart Recommendations</Text>
          </View>
          <Text style={styles.recommendationsText}>
            Based on your schedule, we suggest ordering groceries now to avoid the evening rush.
          </Text>
          <TouchableOpacity style={styles.recommendationsCta}>
            <Text style={styles.ctaText}>Order Groceries</Text>
            <ShoppingCart size={16} color="#6366f1" />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Calendar size={24} color="white" />
      </TouchableOpacity>
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
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  eventsScroll: {
    marginBottom: 32,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 200,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#64748b',
  },
  addEventCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 16,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  addEventText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
    marginTop: 8,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  serviceCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliveryTime: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  categoryCard: {
    width: (width - 60) / 2,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  ordersList: {
    marginBottom: 32,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  orderImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderService: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },
  orderTime: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  recommendationsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  recommendationsText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 20,
  },
  recommendationsCta: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});