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
import { LinearGradient } from 'expo-linear-gradient';
import { ShoppingCart, Milk, Apple, Package } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';

const { width } = Dimensions.get('window');

const categories = [
  {
    id: 'dairy',
    title: 'Dairy Products',
    subtitle: 'Milk, Paneer, Butter, Yogurt, Cheese',
    icon: Milk,
    gradient: ['#e3f2fd', '#90caf9'],
    emoji: '🥛',
  },
  {
    id: 'fruits-vegetables',
    title: 'Veggies & Fruits',
    subtitle: 'Fresh Apples, Bananas, Tomatoes, Onions',
    icon: Apple,
    gradient: ['#e8f5e8', '#a5d6a7'],
    emoji: '🥬🍎',
  },
  {
    id: 'groceries',
    title: 'Groceries',
    subtitle: 'Rice, Dal, Oil, Spices, Snacks',
    icon: Package,
    gradient: ['#fff3e0', '#ffcc80'],
    emoji: '🛒',
  },
];

export default function GroceryDelivery() {
  const router = useRouter();
  const { colors } = useTheme();
  const { getTotalItems } = useCart();

  const handleCategoryPress = (category: any) => {
    router.push({
      pathname: '/category-screen',
      params: { 
        categoryId: category.id,
        categoryTitle: category.title,
        categoryEmoji: category.emoji
      }
    });
  };

  const handleCartPress = () => {
    router.push('/cart');
  };

  const totalCartItems = getTotalItems();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>🛒 Grocery Delivery</Text>
              <Text style={styles.subtitle}>Fresh groceries delivered to your door</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.deliveryBadge}>
                <Text style={styles.deliveryText}>🚚 10 min</Text>
              </View>
              {totalCartItems > 0 && (
                <TouchableOpacity style={styles.cartButton} onPress={handleCartPress}>
                  <ShoppingCart size={24} color={colors.primary} />
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{totalCartItems}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Promotional Banner */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.promoBanner}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.promoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.promoTitle}>🎉 Special Offer!</Text>
            <Text style={styles.promoSubtitle}>Get 20% off on your first order</Text>
            <Text style={styles.promoCode}>Use code: FRESH20</Text>
          </LinearGradient>
        </Animated.View>

        {/* Categories Section */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <Text style={styles.sectionSubtitle}>Choose from our fresh collection</Text>
          
          <View style={styles.categoriesContainer}>
            {categories.map((category, index) => (
              <Animated.View
                key={category.id}
                entering={FadeInDown.delay(400 + index * 100)}
              >
                <TouchableOpacity
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress(category)}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={category.gradient}
                    style={styles.categoryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.categoryHeader}>
                      <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                      <View style={styles.categoryIconContainer}>
                        <category.icon size={24} color="#1e293b" />
                      </View>
                    </View>
                    
                    <View style={styles.categoryContent}>
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                      <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                    </View>

                    <View style={styles.categoryFooter}>
                      <Text style={styles.shopNowText}>Shop Now →</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View entering={FadeInUp.delay(700)} style={styles.statsSection}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>10 min</Text>
              <Text style={styles.statLabel}>Avg Delivery</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>50K+</Text>
              <Text style={styles.statLabel}>Happy Customers</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: colors.surface,
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deliveryBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  deliveryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  promoBanner: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  promoGradient: {
    padding: 20,
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  promoCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFE066',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoriesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  categoriesContainer: {
    gap: 16,
  },
  categoryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  categoryGradient: {
    padding: 20,
    minHeight: 140,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 12,
  },
  categoryContent: {
    flex: 1,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  categorySubtitle: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  categoryFooter: {
    alignItems: 'flex-end',
  },
  shopNowText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
  },
  statsSection: {
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});