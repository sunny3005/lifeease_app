import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  Heart,
  Share,
  Plus,
  Shirt,
  ShoppingBag,
  Palette,
  TrendingUp,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

const outfitCategories = [
  { id: 'casual', name: 'Casual', color: '#3b82f6', count: 12 },
  { id: 'formal', name: 'Formal', color: '#1e293b', count: 8 },
  { id: 'party', name: 'Party', color: '#ec4899', count: 6 },
  { id: 'sports', name: 'Sports', color: '#10b981', count: 4 },
];

const trendingOutfits = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    title: 'Summer Vibes',
    category: 'Casual',
    likes: 24,
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    title: 'Business Chic',
    category: 'Formal',
    likes: 18,
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    title: 'Night Out',
    category: 'Party',
    likes: 32,
  },
  {
    id: 4,
    image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    title: 'Workout Ready',
    category: 'Sports',
    likes: 15,
  },
];

export default function FashionTab() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('casual');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Fashion Assistant</Text>
            <Text style={styles.headerSubtitle}>AI-powered style recommendations</Text>
          </View>
          <TouchableOpacity style={styles.aiButton}>
            <Sparkles size={24} color="#6366f1" />
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Camera size={24} color="white" />
            <Text style={styles.actionButtonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <ImageIcon size={24} color="white" />
            <Text style={styles.actionButtonText}>Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <ShoppingBag size={24} color="white" />
            <Text style={styles.actionButtonText}>Shop</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Categories */}
        <Animated.View entering={FadeInUp.delay(300)}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {outfitCategories.map((category, index) => (
              <Animated.View key={category.id} entering={FadeInUp.delay(400 + index * 50)}>
                <TouchableOpacity
                  style={[
                    styles.categoryCard,
                    { backgroundColor: category.color },
                    selectedCategory === category.id && styles.selectedCategory
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Shirt size={24} color="white" />
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>{category.count} items</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Trending Outfits */}
        <Animated.View entering={FadeInUp.delay(500)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Outfits</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <TrendingUp size={16} color="#6366f1" />
            </TouchableOpacity>
          </View>
          <View style={styles.outfitsGrid}>
            {trendingOutfits.map((outfit, index) => (
              <Animated.View key={outfit.id} entering={FadeInUp.delay(600 + index * 100)}>
                <TouchableOpacity style={styles.outfitCard}>
                  <Image source={{ uri: outfit.image }} style={styles.outfitImage} />
                  <View style={styles.outfitOverlay}>
                    <View style={styles.outfitActions}>
                      <TouchableOpacity style={styles.actionIcon}>
                        <Heart size={16} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionIcon}>
                        <Share size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.outfitInfo}>
                    <Text style={styles.outfitTitle}>{outfit.title}</Text>
                    <Text style={styles.outfitCategory}>{outfit.category}</Text>
                    <View style={styles.outfitStats}>
                      <Heart size={12} color="#ef4444" />
                      <Text style={styles.likesCount}>{outfit.likes}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* AI Suggestions */}
        <Animated.View entering={FadeInUp.delay(700)} style={styles.aiSuggestions}>
          <View style={styles.aiHeader}>
            <Sparkles size={24} color="#6366f1" />
            <Text style={styles.aiTitle}>AI Style Suggestions</Text>
          </View>
          <Text style={styles.aiDescription}>
            Based on your preferences and current weather, here are some outfit ideas for today.
          </Text>
          <TouchableOpacity style={styles.aiCta}>
            <Text style={styles.aiCtaText}>Get Personalized Suggestions</Text>
            <Palette size={20} color="#6366f1" />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Plus size={24} color="white" />
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
  aiButton: {
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
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
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  categoriesScroll: {
    marginBottom: 32,
  },
  categoryCard: {
    width: 120,
    height: 100,
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedCategory: {
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  categoryName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  categoryCount: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  outfitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  outfitCard: {
    width: cardWidth,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  outfitImage: {
    width: '100%',
    height: cardWidth * 1.3,
    resizeMode: 'cover',
  },
  outfitOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 12,
  },
  outfitActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outfitInfo: {
    padding: 16,
  },
  outfitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  outfitCategory: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  outfitStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likesCount: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  aiSuggestions: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  aiDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 20,
  },
  aiCta: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  aiCtaText: {
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