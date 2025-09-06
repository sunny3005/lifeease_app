import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, Alert, RefreshControl, Modal, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { Button, TextInput, FAB, Chip, IconButton } from 'react-native-paper';
import { useTheme } from '@/context/ThemeContext';
import { Heart, RotateCcw, Sparkles, Plus, Trash2, Package, Shirt, ShoppingBag, X } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const BACKEND_URL = 'http://192.168.1.4:5000/api';

interface DonationItem {
  id: number;
  name: string;
  category: 'clothes' | 'shoes';
  image?: string;
  description?: string;
  condition: 'excellent' | 'good' | 'fair';
  isDeleted: boolean;
  donatedAt: string;
}

export default function DonateClothes() {
  const { colors } = useTheme();
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [restoringItems, setRestoringItems] = useState(new Set());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'clothes' | 'shoes'>('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'clothes' as 'clothes' | 'shoes',
    description: '',
    condition: 'good' as 'excellent' | 'good' | 'fair',
    image: '',
  });

  const conditions = [
    { value: 'excellent', label: 'Excellent', color: '#10b981' },
    { value: 'good', label: 'Good', color: '#f59e0b' },
    { value: 'fair', label: 'Fair', color: '#ef4444' },
  ];

  const fetchDonations = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/donations`);
      setDonations(res.data);
      console.log('[DONATE] Fetched donations:', res.data.length);
    } catch (err) {
      console.error('Error fetching donations:', err.message);
      Alert.alert('Error', 'Failed to load donations. Please try again.');
    }
  };

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchDonations();
    }, [])
  );

  useEffect(() => {
    fetchDonations();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDonations();
    setRefreshing(false);
  };

  const addDonation = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/donations`, formData);
      if (response.status === 201) {
        Alert.alert('✅ Added', 'Item added to donation list successfully!');
        await fetchDonations();
        resetForm();
        setModalVisible(false);
      }
    } catch (err) {
      console.error('Error adding donation:', err.message);
      Alert.alert('❌ Failed', 'Could not add item. Please try again.');
    }
  };

  const handleRestore = async (id: number, name: string) => {
  if (restoringItems.has(id)) return;

  Alert.alert(
    'Restore Item',
    `Are you sure you want to restore "${name}" from donations? This will add it back to your fashion collection.`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Restore',
        onPress: async () => {
          setRestoringItems(prev => new Set(prev).add(id));

          try {
            // ✅ Get donation details
            const donation = donations.find(d => d.id === id);
            if (!donation) {
              throw new Error('Donation not found');
            }

            // 🟡 DEBUG: Log the category
            console.log('Restoring donation:', donation);
            console.log('🗂️ Category:', donation.category);
            console.log('🖼️ Image:', donation.image);

            // ✅ Add back to outfits
            const outfitRes = await fetch(`${BACKEND_URL}/outfits`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                image: donation.image || 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
                category: donation.name || 'Others'
              }),
            });

            if (!outfitRes.ok) {
              throw new Error('Failed to restore to fashion collection');
            }

            // ✅ Remove from donations
            const deleteRes = await axios.delete(`${BACKEND_URL}/donations/${id}`);

            if (deleteRes.status === 200) {
              Alert.alert('✅ Restored', 'Item restored to your fashion collection successfully!');
              await fetchDonations();
            } else {
              throw new Error('Failed to remove from donations');
            }
          } catch (err) {
            console.error('Error restoring item:', err.message);
            Alert.alert('❌ Failed', 'Could not restore item. Please try again.');
          } finally {
            setRestoringItems(prev => {
              const newSet = new Set(prev);
              newSet.delete(id);
              return newSet;
            });
          }
        }
      }
    ]
  );
};


  const handleSoftDelete = async (id: number, name: string) => {
    Alert.alert(
      'Remove from Donations',
      `Remove "${name}" from donation list? You can restore it later.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          onPress: async () => {
            try {
              const response = await axios.put(`${BACKEND_URL}/donations/${id}/soft-delete`);
              if (response.status === 200) {
                Alert.alert('✅ Removed', 'Item removed from donations');
                await fetchDonations();
              }
            } catch (err) {
              console.error('Error soft deleting item:', err.message);
              Alert.alert('❌ Failed', 'Could not remove item. Please try again.');
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'clothes',
      description: '',
      condition: 'good',
      image: '',
    });
  };

  const getFilteredDonations = () => {
    let filtered = donations;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Show all items (both active and removed)
    return filtered;
  };

  const getConditionColor = (condition: string) => {
    const conditionObj = conditions.find(c => c.value === condition);
    return conditionObj?.color || colors.textSecondary;
  };

  const getStats = () => {
    const active = donations.filter(d => !d.isDeleted);
    const deleted = donations.filter(d => d.isDeleted);
    const clothes = active.filter(d => d.category === 'clothes').length;
    const shoes = active.filter(d => d.category === 'shoes').length;

    return { total: active.length, deleted: deleted.length, clothes, shoes };
  };

  const renderItem = ({ item, index }: { item: DonationItem; index: number }) => {
    const isRestoring = restoringItems.has(item.id);
    
    return (
      <Animated.View entering={FadeInDown.delay(100 * index)}>
        <View style={[
          styles.card, 
          { 
            backgroundColor: item.isDeleted ? colors.secondary : colors.card,
            borderColor: colors.border,
            opacity: item.isDeleted ? 0.7 : 1,
          }
        ]}>
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.itemImage} />
          )}
          
          <View style={styles.cardContent}>
            <View style={styles.itemHeader}>
              <Text style={[
                styles.itemName, 
                { 
                  color: item.isDeleted ? colors.textSecondary : colors.text,
                  textDecorationLine: item.isDeleted ? 'line-through' : 'none',
                }
              ]}>
                {item.name}
              </Text>
              <View style={styles.itemBadges}>
                <Chip
                  mode="outlined"
                  style={[styles.categoryChip, { borderColor: item.category === 'clothes' ? '#ec4899' : '#8b5cf6' }]}
                  textStyle={[styles.categoryText, { color: item.category === 'clothes' ? '#ec4899' : '#8b5cf6' }]}
                  icon={() => item.category === 'clothes' ? 
                    <Shirt size={12} color={item.category === 'clothes' ? '#ec4899' : '#8b5cf6'} /> :
                    <ShoppingBag size={12} color={item.category === 'clothes' ? '#ec4899' : '#8b5cf6'} />
                  }
                >
                  {item.category}
                </Chip>
                <Chip
                  mode="outlined"
                  style={[styles.conditionChip, { borderColor: getConditionColor(item.condition) }]}
                  textStyle={[styles.conditionText, { color: getConditionColor(item.condition) }]}
                >
                  {item.condition}
                </Chip>
              </View>
            </View>

            {item.description && (
              <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>
                {item.description}
              </Text>
            )}

            <Text style={[styles.donatedDate, { color: colors.textSecondary }]}>
              {item.isDeleted ? 'Removed' : 'Added'}: {new Date(item.donatedAt).toLocaleDateString()}
            </Text>

           <View style={styles.cardActions}>
  <>
    <Button
      icon={() => <RotateCcw size={16} color={isRestoring ? colors.textSecondary : colors.success} />}
      mode="outlined"
      onPress={() => handleRestore(item.id, item.name)}
      style={[
        styles.restoreButton,
        {
          borderColor: isRestoring ? colors.textSecondary : colors.success,
          opacity: isRestoring ? 0.6 : 1
        }
      ]}
      labelStyle={{ color: isRestoring ? colors.textSecondary : colors.success }}
      disabled={isRestoring}
      loading={isRestoring}
    >
      {isRestoring ? 'Restoring...' : 'Restore'}
    </Button>
    <Button
      icon={() => <ShoppingBag size={16} color={colors.primary} />}
      mode="outlined"
      onPress={() => handleAddToCart(item)}
      style={[styles.cartButton, { borderColor: colors.primary }]}
      labelStyle={{ color: colors.primary }}
    >
      Add to Cart
    </Button>
  </>
</View>

          </View>
        </View>
      </Animated.View>
    );
  };

  const stats = getStats();
  const filteredDonations = getFilteredDonations();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
        <View style={styles.headerContent}>
          <Heart size={24} color={colors.primary} />
          <Text style={styles.title}>Donation Center</Text>
          <Sparkles size={20} color={colors.secondary} />
        </View>
      </Animated.View>
      
      {/* Stats */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statText}>Active Items</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: '#ec4899' }]}>{stats.clothes}</Text>
          <Text style={styles.statText}>Clothes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: '#8b5cf6' }]}>{stats.shoes}</Text>
          <Text style={styles.statText}>Shoes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.textSecondary }]}>{stats.deleted}</Text>
          <Text style={styles.statText}>Removed</Text>
        </View>
      </Animated.View>

      {/* Filters */}
      <Animated.View entering={FadeInDown.delay(300)} style={styles.filtersContainer}>
        <View style={styles.categoryFilters}>
          {['all', 'clothes', 'shoes'].map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterButton,
                {
                  backgroundColor: selectedCategory === category ? colors.primary : colors.surface,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setSelectedCategory(category as any)}
            >
              <Text style={[
                styles.filterButtonText,
                { color: selectedCategory === category ? 'white' : colors.text }
              ]}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
      
      {/* Items List */}
      {filteredDonations.length === 0 ? (
        <Animated.View entering={FadeInUp.delay(400)} style={styles.emptyState}>
          <Package size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Donation Items Yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Start building your donation list by adding clothes and shoes you want to give away!
          </Text>
        </Animated.View>
      ) : (
        <FlatList
          data={filteredDonations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
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
      )}

      {/* Add Item FAB */}
      <FAB
        icon={() => <Plus size={24} color="white" />}
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      />

      {/* Add Item Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Donation Item</Text>
            <IconButton
              icon={() => <X size={24} color={colors.text} />}
              onPress={() => setModalVisible(false)}
            />
          </View>

          <View style={styles.modalContent}>
            <TextInput
              mode="outlined"
              label="Item Name"
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
              label="Description (Optional)"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={3}
              style={styles.input}
              theme={{ 
                colors: {
                  background: colors.surface,
                  onSurfaceVariant: colors.textSecondary,
                  outline: colors.border,
                }
              }}
            />

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Category</Text>
            <View style={styles.categoryContainer}>
              {['clothes', 'shoes'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryOption,
                    {
                      backgroundColor: formData.category === category ? colors.primary : colors.surface,
                      borderColor: colors.border,
                    }
                  ]}
                  onPress={() => setFormData({ ...formData, category: category as any })}
                >
                  {category === 'clothes' ? 
                    <Shirt size={20} color={formData.category === category ? 'white' : colors.text} /> :
                    <ShoppingBag size={20} color={formData.category === category ? 'white' : colors.text} />
                  }
                  <Text style={[
                    styles.categoryOptionText,
                    { color: formData.category === category ? 'white' : colors.text }
                  ]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Condition</Text>
            <View style={styles.conditionContainer}>
              {conditions.map((condition) => (
                <TouchableOpacity
                  key={condition.value}
                  style={[
                    styles.conditionOption,
                    {
                      backgroundColor: formData.condition === condition.value ? condition.color : colors.surface,
                      borderColor: condition.color,
                    }
                  ]}
                  onPress={() => setFormData({ ...formData, condition: condition.value as any })}
                >
                  <Text style={[
                    styles.conditionOptionText,
                    {
                      color: formData.condition === condition.value ? 'white' : condition.color,
                    }
                  ]}>
                    {condition.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={addDonation}
                style={[styles.addButton, { backgroundColor: colors.primary }]}
              >
                Add Item
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
    justifyContent: 'center',
    padding: 20,
    gap: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  categoryFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  list: { 
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 16,
    borderWidth: 1,
  },
  itemImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  itemBadges: {
    gap: 4,
  },
  categoryChip: {
    height: 24,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  conditionChip: {
    height: 24,
  },
  conditionText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  donatedDate: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  restoreButton: {
    flex: 1,
    borderRadius: 8,
  },
  removeButton: {
    flex: 1,
    borderRadius: 8,
  },
  cartButton: {
    flex: 1,
    borderRadius: 8,
  },
  deleteButton: {
    borderRadius: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    borderRadius: 28,
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
  modalContent: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  categoryOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  conditionContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  conditionOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  conditionOptionText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
  },
  addButton: {
    flex: 1,
  },
});