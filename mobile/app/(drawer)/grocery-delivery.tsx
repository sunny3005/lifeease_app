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
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '@/context/ThemeContext';
import GroceryShop from '@/components/grocery/GroceryShop';
import OrderHistory from '@/components/grocery/OrderHistory';
import { ShoppingCart, History } from 'lucide-react-native';

const Tab = createMaterialTopTabNavigator();

export default function GroceryDelivery() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛒 Grocery Delivery</Text>
        <Text style={styles.headerSubtitle}>Fresh groceries delivered to your door</Text>
      </View>

      {/* Tab Navigator */}
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.primary,
            height: 3,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
            textTransform: 'none',
          },
        }}
      >
        <Tab.Screen
          name="GroceryShop"
          component={GroceryShop}
          options={{
            tabBarLabel: '🛍️ Grocery Shop',
            tabBarIcon: ({ color }) => <ShoppingCart size={20} color={color} />,
          }}
        />
        <Tab.Screen
          name="OrderHistory"
          component={OrderHistory}
          options={{
            tabBarLabel: '📜 Order History',
            tabBarIcon: ({ color }) => <History size={20} color={color} />,
          }}
        />
      </Tab.Navigator>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});