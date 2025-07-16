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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Plus, Minus, ShoppingCart, Heart, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/mockProducts';

const { width, height } = Dimensions.get('window');

export default function ProductDetail() {
  const router = useRouter();
  const { colors } = useTheme();
  const { productId, productData } = useLocalSearchParams();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);

  const product: Product = productData ? JSON.parse(productData as string) : null;
  const quantity = getItemQuantity(productId as string);

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Product not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backToListButton}>
            <Text style={styles.backToListText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    if (quantity === 0) {
      addToCart({
        id: product.id,
        name: product.name,
        image: product.image,
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice,
        category: product.category,
      });
    } else {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    updateQuantity(product.id, newQuantity);
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setIsFavorite(!isFavorite)} 
            style={styles.favoriteButton}
          >
            <Heart 
              size={24} 
              color={isFavorite ? "#FF6B6B" : "white"} 
              fill={isFavorite ? "#FF6B6B" : "transparent"} 
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Product Image */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{product.discount}</Text>
          </View>
        </Animated.View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Animated.View entering={FadeInLeft.delay(300)} style={styles.productHeader}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productUnit}>{product.unit}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>4.5 (120 reviews)</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInRight.delay(400)} style={styles.priceSection}>
            <View style={styles.priceContainer}>
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
              <Text style={styles.discountedPrice}>₹{product.discountedPrice}</Text>
              <Text style={styles.savingsText}>
                You save ₹{product.originalPrice - product.discountedPrice}
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500)} style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(600)} style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureBullet}>•</Text>
                <Text style={styles.featureText}>Fresh and high quality</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureBullet}>•</Text>
                <Text style={styles.featureText}>Fast delivery within 10 minutes</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureBullet}>•</Text>
                <Text style={styles.featureText}>100% satisfaction guaranteed</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(700)} style={styles.deliveryInfo}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.deliveryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.deliveryTitle}>🚚 Fast Delivery</Text>
              <Text style={styles.deliveryText}>Get it delivered in 10 minutes</Text>
            </LinearGradient>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <Animated.View entering={FadeInUp.delay(800)} style={styles.bottomBar}>
        <View style={styles.quantitySection}>
          <Text style={styles.quantityLabel}>Quantity</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: colors.secondary }]}
              onPress={() => handleQuantityChange(-1)}
              disabled={quantity === 0}
            >
              <Minus size={20} color={quantity === 0 ? colors.textSecondary : colors.text} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: colors.secondary }]}
              onPress={() => handleQuantityChange(1)}
            >
              <Plus size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
          onPress={handleAddToCart}
        >
          <ShoppingCart size={20} color="white" />
          <Text style={styles.addToCartText}>
            {quantity === 0 ? 'Add to Cart' : `Add ${quantity} to Cart`}
          </Text>
          {quantity > 0 && (
            <Text style={styles.totalPrice}>
              ₹{(product.discountedPrice * quantity).toFixed(0)}
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 12,
    borderRadius: 24,
  },
  favoriteButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 12,
    borderRadius: 24,
  },
  imageContainer: {
    position: 'relative',
    height: height * 0.4,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  discountText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productInfo: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  productHeader: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  productUnit: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  priceSection: {
    marginBottom: 24,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  originalPrice: {
    fontSize: 16,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.success,
  },
  savingsText: {
    fontSize: 14,
    color: colors.success,
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureBullet: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  deliveryInfo: {
    marginBottom: 100,
    borderRadius: 16,
    overflow: 'hidden',
  },
  deliveryGradient: {
    padding: 16,
    alignItems: 'center',
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  deliveryText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantitySection: {
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    padding: 8,
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPrice: {
    color: 'white',
    fontSize: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
  },
  backToListButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backToListText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});