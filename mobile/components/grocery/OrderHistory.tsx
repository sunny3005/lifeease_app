import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import { Package, Clock, CircleCheck as CheckCircle, Truck, Calendar } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

const BACKEND_URL = 'http://192.168.1.4:5000/api';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface Order {
  orderId: string;
  items: OrderItem[];
  total: number;
  deliveryFee: number;
  finalTotal: number;
  status: string;
  estimatedDeliveryTime: number;
  createdAt: string;
  updatedAt: string;
}

export default function OrderHistory() {
  const { colors } = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/orders`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
        console.log('[ORDER_HISTORY] Fetched orders:', data.orders.length);
      } else {
        throw new Error(data.error || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('[ORDER_HISTORY] Fetch error:', error);
      Alert.alert('Error', 'Failed to load order history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} color={colors.warning} />;
      case 'confirmed':
      case 'preparing':
        return <Package size={16} color={colors.info} />;
      case 'out_for_delivery':
        return <Truck size={16} color={colors.primary} />;
      case 'delivered':
        return <CheckCircle size={16} color={colors.success} />;
      default:
        return <Clock size={16} color={colors.textSecondary} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'confirmed':
      case 'preparing':
        return colors.info;
      case 'out_for_delivery':
        return colors.primary;
      case 'delivered':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const renderOrderItem = ({ item: order, index }: { item: Order; index: number }) => {
    const isExpanded = expandedOrder === order.orderId;

    return (
      <Animated.View entering={FadeInDown.delay(100 * index)}>
        <TouchableOpacity
          style={[styles.orderCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => toggleOrderExpansion(order.orderId)}
          activeOpacity={0.9}
        >
          {/* Order Header */}
          <View style={styles.orderHeader}>
            <View style={styles.orderInfo}>
              <Text style={[styles.orderId, { color: colors.text }]}>
                Order #{order.orderId}
              </Text>
              <View style={styles.orderMeta}>
                <Calendar size={14} color={colors.textSecondary} />
                <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
                  {formatDate(order.createdAt)}
                </Text>
              </View>
            </View>
            <View style={styles.orderStatus}>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
                {getStatusIcon(order.status)}
                <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          {/* Order Summary */}
          <View style={styles.orderSummary}>
            <Text style={[styles.itemCount, { color: colors.textSecondary }]}>
              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
            </Text>
            <Text style={[styles.orderTotal, { color: colors.text }]}>
              ₹{order.finalTotal.toFixed(0)}
            </Text>
          </View>

          {/* Expanded Order Details */}
          {isExpanded && (
            <View style={styles.orderDetails}>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              
              {/* Order Items */}
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Items Ordered</Text>
              {order.items.map((item, itemIndex) => (
                <View key={`${item.id}-${itemIndex}`} style={styles.orderItem}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={[styles.itemCategory, { color: colors.textSecondary }]}>
                      {item.category}
                    </Text>
                    <View style={styles.itemPricing}>
                      <Text style={[styles.itemPrice, { color: colors.success }]}>
                        ₹{item.price} × {item.quantity}
                      </Text>
                      <Text style={[styles.itemTotal, { color: colors.text }]}>
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

              {/* Order Totals */}
              <View style={styles.orderTotals}>
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Subtotal</Text>
                  <Text style={[styles.totalValue, { color: colors.text }]}>₹{order.total.toFixed(0)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Delivery Fee</Text>
                  <Text style={[styles.totalValue, { color: order.deliveryFee === 0 ? colors.success : colors.text }]}>
                    {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                  </Text>
                </View>
                <View style={[styles.totalRow, styles.finalTotalRow]}>
                  <Text style={[styles.finalTotalLabel, { color: colors.text }]}>Total</Text>
                  <Text style={[styles.finalTotalValue, { color: colors.primary }]}>₹{order.finalTotal.toFixed(0)}</Text>
                </View>
              </View>

              {/* Delivery Info */}
              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <View style={[styles.deliveryInfo, { backgroundColor: colors.secondary }]}>
                  <Truck size={16} color={colors.primary} />
                  <Text style={[styles.deliveryText, { color: colors.text }]}>
                    Estimated delivery: {order.estimatedDeliveryTime} minutes
                  </Text>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const styles = createStyles(colors);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Package size={48} color={colors.textSecondary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading orders...</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Package size={64} color={colors.textSecondary} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Orders Yet</Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Your order history will appear here once you place your first order
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.orderId}
        contentContainerStyle={styles.ordersList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  ordersList: {
    padding: 16,
    paddingBottom: 20,
  },
  orderCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderDate: {
    fontSize: 12,
  },
  orderStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCount: {
    fontSize: 14,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderDetails: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  itemPricing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderTotals: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  finalTotalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    marginTop: 8,
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  finalTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  deliveryText: {
    fontSize: 12,
    fontWeight: '500',
  },
});