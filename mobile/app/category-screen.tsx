import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

// Mock data for different categories
const mockProducts = {
  dairy: [
    {
      id: "1",
      name: "Amul Milk 500ml",
      image: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 30,
      discountedPrice: 25,
      description: "Fresh full cream milk from Amul dairy",
      discount: "17% OFF",
    },
    {
      id: "2",
      name: "Mother Dairy Paneer 200g",
      image: "https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 80,
      discountedPrice: 65,
      description: "Soft and fresh paneer for cooking",
      discount: "19% OFF",
    },
    {
      id: "3",
      name: "Amul Butter 100g",
      image: "https://images.pexels.com/photos/479643/pexels-photo-479643.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 50,
      discountedPrice: 42,
      description: "Creamy butter made from fresh cream",
      discount: "16% OFF",
    },
    {
      id: "4",
      name: "Nestle Yogurt 400g",
      image: "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 60,
      discountedPrice: 48,
      description: "Thick and creamy yogurt",
      discount: "20% OFF",
    },
  ],
  'fruits-vegetables': [
    {
      id: "5",
      name: "Fresh Red Apples 1kg",
      image: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 120,
      discountedPrice: 95,
      description: "Crisp and sweet red apples",
      discount: "21% OFF",
    },
    {
      id: "6",
      name: "Fresh Bananas 1kg",
      image: "https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 40,
      discountedPrice: 32,
      description: "Ripe yellow bananas",
      discount: "20% OFF",
    },
    {
      id: "7",
      name: "Fresh Tomatoes 500g",
      image: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 25,
      discountedPrice: 20,
      description: "Fresh red tomatoes",
      discount: "20% OFF",
    },
    {
      id: "8",
      name: "Fresh Onions 1kg",
      image: "https://images.pexels.com/photos/144248/onions-food-vegetables-healthy-144248.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 30,
      discountedPrice: 24,
      description: "Fresh white onions",
      discount: "20% OFF",
    },
  ],
  groceries: [
    {
      id: "9",
      name: "Basmati Rice 5kg",
      image: "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 400,
      discountedPrice: 320,
      description: "Premium basmati rice",
      discount: "20% OFF",
    },
    {
      id: "10",
      name: "Toor Dal 1kg",
      image: "https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 120,
      discountedPrice: 95,
      description: "High quality toor dal",
      discount: "21% OFF",
    },
    {
      id: "11",
      name: "Sunflower Oil 1L",
      image: "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 150,
      discountedPrice: 125,
      description: "Pure sunflower cooking oil",
      discount: "17% OFF",
    },
    {
      id: "12",
      name: "Mixed Spices Pack",
      image: "https://images.pexels.com/photos/277253/pexels-photo-277253.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 200,
      discountedPrice: 160,
      description: "Essential spices for cooking",
      discount: "20% OFF",
    },
  ],
};

export default function CategoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { categoryId, categoryTitle, categoryEmoji } = useLocalSearchParams();
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});

  const products = mockProducts[categoryId as keyof typeof mockProducts] || [];

  const handleProductPress = (product: any) => {
    router.push({
      pathname: '/product-detail',
      params: {
        productId: product.id,
        productData: JSON.stringify(product)
      }
    });
  };

  const updateCartQuantity = (productId: string, change: number) => {
    setCartItems(prev => {
      const currentQuantity = prev[productId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      
      if (newQuantity === 0) {
        const { [productId]: removed, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [productId]: newQuantity };
    });
  };

  const renderProduct = ({ item, index }: { item: any; index: number }) => {
    const quantity = cartItems[item.id] || 0;
    
    return (
      <Animated.View entering={FadeInDown.delay(100 * index)}>
        <TouchableOpacity
          style={[styles.productCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => handleProductPress(item)}
          activeOpacity={0.9}
        >
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}</Text>
          </View>
          
          <Image source={{ uri: item.image }} style={styles.productImage} />
          
          <View style={styles.productInfo}>
            <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
              {item.name}
            </Text>
            
            <View style={styles.priceContainer}>
              <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                ₹{item.originalPrice}
              </Text>
              <Text style={[styles.discountedPrice, { color: colors.success }]}>
                ₹{item.discountedPrice}
              </Text>
            </View>
            
            <View style={styles.cartControls}>
              {quantity === 0 ? (
                <TouchableOpacity
                  style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
                  onPress={() => updateCartQuantity(item.id, 1)}
                >
                  <Plus size={16} color="white" />
                  <Text style={styles.addToCartText}>Add</Text>
                </TouchableOpacity>
              ) : (
                <View style={[styles.quantityControls, { backgroundColor: colors.primary }]}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateCartQuantity(item.id, -1)}
                  >
                    <Minus size={16} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateCartQuantity(item.id, 1)}
                  >
                    <Plus size={16} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const totalItems = Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{categoryTitle}</Text>
          <Text style={styles.headerEmoji}>{categoryEmoji}</Text>
        </View>
        {totalItems > 0 && (
          <TouchableOpacity style={styles.cartButton}>
            <ShoppingCart size={20} color={colors.primary} />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Products List */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productsList}
        columnWrapperStyle={styles.productRow}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Animated.View entering={FadeInUp.delay(200)} style={styles.listHeader}>
            <Text style={[styles.productsCount, { color: colors.textSecondary }]}>
              {products.length} products available
            </Text>
          </Animated.View>
        }
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerEmoji: {
    fontSize: 24,
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
  listHeader: {
    paddingBottom: 16,
  },
  productsCount: {
    fontSize: 14,
    textAlign: 'center',
  },
  productsList: {
    padding: 16,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: cardWidth,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartControls: {
    alignItems: 'center',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addToCartText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  quantityButton: {
    padding: 6,
  },
  quantityText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 24,
    textAlign: 'center',
  },
});