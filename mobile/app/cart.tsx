import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useCart, CartItem } from '@/context/CartContext';

export default function CartScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  const handleQuantityChange = (productId: string, change: number) => {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert(
      'Remove Item',
      `Remove ${productName} from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(productId) }
      ]
    );
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before placing an order.');
      return;
    }

    placeOrder();
  };

  const placeOrder = async () => {
    try {
      const orderData = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.discountedPrice,
          quantity: item.quantity,
          image: item.image,
          category: item.category,
        })),
        total: totalPrice,
        deliveryFee: deliveryFee,
        customerInfo: {
          name: 'Guest User',
          phone: '+91 9876543210',
          address: 'Default Address'
        }
      };

      console.log('[CART] Placing order:', orderData);

      const response = await fetch('http://192.168.1.4:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        console.log('[CART] Order placed successfully:', result.order.orderId);
        
        Alert.alert(
          '🎉 Order Placed Successfully!',
          `Order ID: ${result.order.orderId}\n\nYour order has been placed. A delivery executive will contact you via WhatsApp shortly.`,
          [
            {
              text: 'OK',
              onPress: () => {
                clearCart();
                router.push('/order-success');
              }
            }
          ]
        );
      } else {
        throw new Error(result.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('[CART] Order placement error:', error);
      Alert.alert(
        'Order Failed',
        'Failed to place your order. Please check your internet connection and try again.',
        [
          { text: 'Retry', onPress: placeOrder },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const renderCartItem = ({ item, index }: { item: CartItem; index: number }) => (
    <Animated.View entering={FadeInDown.delay(100 * index)}>
      <View style={[styles.cartItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
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
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: colors.secondary }]}
              onPress={() => handleQuantityChange(item.id, -1)}
            >
              <Minus size={16} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.quantityText, { color: colors.text }]}>{item.quantity}</Text>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: colors.secondary }]}
              onPress={() => handleQuantityChange(item.id, 1)}
            >
              <Plus size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.itemActions}>
          <Text style={[styles.itemTotal, { color: colors.text }]}>
            ₹{(item.discountedPrice * item.quantity).toFixed(0)}
          </Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.id, item.name)}
          >
            <Trash2 size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const totalPrice = getTotalPrice();
  const deliveryFee = totalPrice > 200 ? 0 : 20;
  const finalTotal = totalPrice + deliveryFee;

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={styles.headerRight}>
          <Text style={styles.itemCount}>{cartItems.length} items</Text>
        </View>
      </Animated.View>

      {cartItems.length === 0 ? (
        <Animated.View entering={FadeInUp.delay(200)} style={styles.emptyCart}>
          <ShoppingBag size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Your cart is empty</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Add some items to get started
          </Text>
          <TouchableOpacity
            style={[styles.shopNowButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/grocery-delivery')}
          >
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          {/* Order Summary */}
          <Animated.View entering={FadeInUp.delay(300)} style={styles.orderSummary}>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Order Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Subtotal</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>₹{totalPrice.toFixed(0)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Delivery Fee</Text>
              <Text style={[styles.summaryValue, { color: deliveryFee === 0 ? colors.success : colors.text }]}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </Text>
            </View>
            
            {deliveryFee === 0 && (
              <Text style={[styles.freeDeliveryText, { color: colors.success }]}>
                🎉 Free delivery on orders above ₹200
              </Text>
            )}
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>₹{finalTotal.toFixed(0)}</Text>
            </View>

            <TouchableOpacity
              style={[styles.placeOrderButton, { backgroundColor: colors.primary }]}
              onPress={handlePlaceOrder}
            >
              <Text style={styles.placeOrderText}>Place Order</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  itemCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  shopNowButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shopNowText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartList: {
    padding: 16,
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    padding: 6,
    borderRadius: 6,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  removeButton: {
    padding: 8,
  },
  orderSummary: {
    backgroundColor: colors.surface,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  freeDeliveryText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeOrderButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});