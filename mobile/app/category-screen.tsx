import React from 'react';
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
import { useCart } from '@/context/CartContext';
import { mockProducts, Product } from '@/data/mockProducts';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

export default function CategoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { categoryId, categoryTitle, categoryEmoji } = useLocalSearchParams();
  const { addToCart, updateQuantity, getItemQuantity, getTotalItems } = useCart();

  const products = mockProducts[categoryId as string] || [];
  const totalCartItems = getTotalItems();

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: '/product-detail',
      params: { 
        productId: product.id,
        productData: JSON.stringify(product)
      }
    });
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      originalPrice: product.originalPrice,
      discountedPrice: product.discountedPrice,
      category: product.category,
    });
  };

  const handleQuantityChange = (productId: string, change: number) => {
    const currentQuantity = getItemQuantity(productId);
    const newQuantity = currentQuantity + change;
    updateQuantity(productId, newQuantity);
  };

  const renderProduct = ({ item, index }: { item: Product; index: number }) => {
    const quantity = getItemQuantity(item.id);
    
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
            <Text style={[styles.productUnit, { color: colors.textSecondary }]}>
              {item.unit}
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
                  onPress={() => handleAddToCart(item)}
                >
                  <Plus size={16} color="white" />
                  <Text style={styles.addToCartText}>Add</Text>
                </TouchableOpacity>
              ) : (
                <View style={[styles.quantityControls, { backgroundColor: colors.primary }]}>
                  <TouchableOpacity 
                    style={styles.quantityButton} 
                    onPress={() => handleQuantityChange(item.id, -1)}
                  >
                    <Minus size={16} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity 
                    style={styles.quantityButton} 
                    onPress={() => handleQuantityChange(item.id, 1)}
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
        {totalCartItems > 0 && (
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => router.push('/cart')}
          >
            <ShoppingCart size={20} color={colors.primary} />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalCartItems}</Text>
            </View>
          </TouchableOpacity>
        )}
      </Animated.View>

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
    backgroundColor: colors.background 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: { 
    padding: 8, 
    marginRight: 12 
  },
  headerContent: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: colors.text 
  },
  headerEmoji: { 
    fontSize: 24 
  },
  cartButton: { 
    position: 'relative', 
    padding: 8 
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
    fontWeight: 'bold' 
  },
  listHeader: { 
    paddingBottom: 16 
  },
  productsCount: { 
    fontSize: 14, 
    textAlign: 'center' 
  },
  productsList: { 
    padding: 16 
  },
  productRow: { 
    justifyContent: 'space-between' 
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
    fontWeight: 'bold' 
  },
  productImage: { 
    width: '100%', 
    height: 120, 
    resizeMode: 'cover' 
  },
  productInfo: { 
    padding: 12 
  },
  productName: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 4, 
    lineHeight: 18 
  },
  productUnit: {
    fontSize: 12,
    marginBottom: 8,
  },
  priceContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    marginBottom: 12 
  },
  originalPrice: { 
    fontSize: 12, 
    textDecorationLine: 'line-through' 
  },
  discountedPrice: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  cartControls: { 
    alignItems: 'center' 
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
    fontWeight: '600' 
  },
  quantityControls: {
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 20,
    paddingHorizontal: 4, 
    paddingVertical: 4,
  },
  quantityButton: { 
    padding: 6 
  },
  quantityText: {
    color: 'white', 
    fontSize: 14, 
    fontWeight: 'bold',
    minWidth: 24, 
    textAlign: 'center',
  },
});