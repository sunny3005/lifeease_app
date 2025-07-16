import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Plus, CreditCard as Edit3, Trash2, Package, Settings } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/context/ThemeContext';
import { Product } from '@/data/mockProducts';

const ADMIN_PRODUCTS_KEY = '@admin_products';

export default function AdminScreen() {
  const { colors } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('dairy');
  
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    originalPrice: '',
    discountedPrice: '',
    description: '',
    category: 'dairy',
    unit: '',
  });

  const categories = [
    { id: 'dairy', name: 'Dairy Products', emoji: '🥛' },
    { id: 'fruits-vegetables', name: 'Fruits & Vegetables', emoji: '🥬🍎' },
    { id: 'groceries', name: 'Groceries', emoji: '🛒' },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const savedProducts = await AsyncStorage.getItem(ADMIN_PRODUCTS_KEY);
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const saveProducts = async (updatedProducts: Product[]) => {
    try {
      await AsyncStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error saving products:', error);
      Alert.alert('Error', 'Failed to save products');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      image: '',
      originalPrice: '',
      discountedPrice: '',
      description: '',
      category: selectedCategory,
      unit: '',
    });
    setEditingProduct(null);
  };

  const handleAddProduct = () => {
    resetForm();
    setModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      image: product.image,
      originalPrice: product.originalPrice.toString(),
      discountedPrice: product.discountedPrice.toString(),
      description: product.description,
      category: product.category,
      unit: product.unit,
    });
    setEditingProduct(product);
    setModalVisible(true);
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.originalPrice || !formData.discountedPrice) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const originalPrice = parseFloat(formData.originalPrice);
    const discountedPrice = parseFloat(formData.discountedPrice);
    
    if (isNaN(originalPrice) || isNaN(discountedPrice)) {
      Alert.alert('Error', 'Please enter valid prices');
      return;
    }

    const discount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

    const productData: Product = {
      id: editingProduct ? editingProduct.id : `${formData.category}_${Date.now()}`,
      name: formData.name,
      image: formData.image || 'https://images.pexels.com/photos/264537/pexels-photo-264537.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      originalPrice,
      discountedPrice,
      description: formData.description,
      discount: `${discount}% OFF`,
      category: formData.category,
      inStock: true,
      unit: formData.unit,
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? productData : p);
    } else {
      updatedProducts = [...products, productData];
    }

    saveProducts(updatedProducts);
    setModalVisible(false);
    resetForm();
    
    Alert.alert('Success', `Product ${editingProduct ? 'updated' : 'added'} successfully!`);
  };

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedProducts = products.filter(p => p.id !== product.id);
            saveProducts(updatedProducts);
            Alert.alert('Success', 'Product deleted successfully!');
          }
        }
      ]
    );
  };

  const filteredProducts = products.filter(p => p.category === selectedCategory);
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Settings size={24} color={colors.primary} />
          <Text style={styles.headerTitle}>Admin Panel</Text>
        </View>
        <Text style={styles.headerSubtitle}>Manage your grocery products</Text>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        style={styles.categoryTabs}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryTabsContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryTab,
              {
                backgroundColor: selectedCategory === category.id ? colors.primary : colors.surface,
                borderColor: colors.border,
              }
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text style={[
              styles.categoryTabText,
              { color: selectedCategory === category.id ? 'white' : colors.text }
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products List */}
      <ScrollView style={styles.productsList} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Products ({filteredProducts.length})
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddProduct}
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>

        {filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Package size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No products yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Add your first product to get started
            </Text>
          </View>
        ) : (
          filteredProducts.map((product, index) => (
            <Animated.View key={product.id} entering={FadeInDown.delay(100 * index)}>
              <View style={[styles.productCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
                  <Text style={[styles.productUnit, { color: colors.textSecondary }]}>{product.unit}</Text>
                  <View style={styles.priceRow}>
                    <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                      ₹{product.originalPrice}
                    </Text>
                    <Text style={[styles.discountedPrice, { color: colors.success }]}>
                      ₹{product.discountedPrice}
                    </Text>
                    <Text style={styles.discount}>{product.discount}</Text>
                  </View>
                </View>
                <View style={styles.productActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.secondary }]}
                    onPress={() => handleEditProduct(product)}
                  >
                    <Edit3 size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.secondary }]}
                    onPress={() => handleDeleteProduct(product)}
                  >
                    <Trash2 size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>

      {/* Add/Edit Product Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={[styles.cancelText, { color: colors.error }]}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <TextInput
              mode="outlined"
              label="Product Name *"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              style={styles.input}
              theme={{ 
                colors: {
                  background: colors.surface,
                  onSurfaceVariant: colors.textSecondary,
                  outline: colors.border,
                }
              }}
            />

            <TextInput
              mode="outlined"
              label="Image URL"
              value={formData.image}
              onChangeText={(text) => setFormData({ ...formData, image: text })}
              style={styles.input}
              placeholder="https://example.com/image.jpg"
              theme={{ 
                colors: {
                  background: colors.surface,
                  onSurfaceVariant: colors.textSecondary,
                  outline: colors.border,
                }
              }}
            />

            <TextInput
              mode="outlined"
              label="Unit (e.g., 1kg, 500ml)"
              value={formData.unit}
              onChangeText={(text) => setFormData({ ...formData, unit: text })}
              style={styles.input}
              theme={{ 
                colors: {
                  background: colors.surface,
                  onSurfaceVariant: colors.textSecondary,
                  outline: colors.border,
                }
              }}
            />

            <View style={styles.priceInputs}>
              <TextInput
                mode="outlined"
                label="Original Price *"
                value={formData.originalPrice}
                onChangeText={(text) => setFormData({ ...formData, originalPrice: text })}
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
                theme={{ 
                  colors: {
                    background: colors.surface,
                    onSurfaceVariant: colors.textSecondary,
                    outline: colors.border,
                  }
                }}
              />
              <TextInput
                mode="outlined"
                label="Discounted Price *"
                value={formData.discountedPrice}
                onChangeText={(text) => setFormData({ ...formData, discountedPrice: text })}
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
                theme={{ 
                  colors: {
                    background: colors.surface,
                    onSurfaceVariant: colors.textSecondary,
                    outline: colors.border,
                  }
                }}
              />
            </View>

            <TextInput
              mode="outlined"
              label="Description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              style={styles.input}
              multiline
              numberOfLines={3}
              theme={{ 
                colors: {
                  background: colors.surface,
                  onSurfaceVariant: colors.textSecondary,
                  outline: colors.border,
                }
              }}
            />

            <Button
              mode="contained"
              onPress={handleSaveProduct}
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              labelStyle={styles.saveButtonText}
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  categoryTabs: {
    paddingVertical: 16,
  },
  categoryTabsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  productsList: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
    borderRadius: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  productCard: {
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
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productUnit: {
    fontSize: 12,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  discount: {
    fontSize: 10,
    color: '#FF6B6B',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  modal: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  priceInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 8,
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});