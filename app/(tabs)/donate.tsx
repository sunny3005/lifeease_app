import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import {
  Heart,
  Camera,
  Image as ImageIcon,
  RotateCcw,
  Trash2,
  Plus,
  Gift,
  Sparkles,
  Users,
} from 'lucide-react-native';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Button, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

interface DonatedItem {
  id: number;
  image: string;
  category: string;
  description: string;
  donatedAt: string;
}

const categories = ['Clothes', 'Shoes', 'Accessories', 'Others'];

export default function DonateTab() {
  const [donatedItems, setDonatedItems] = useState<DonatedItem[]>([
    {
      id: 1,
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      category: 'Clothes',
      description: 'Blue denim jacket',
      donatedAt: '2024-01-15',
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      category: 'Shoes',
      description: 'White sneakers',
      donatedAt: '2024-01-14',
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    image: '',
    category: 'Clothes',
    description: '',
  });

  // Animation values
  const heartBeat = useSharedValue(1);
  const sparkleRotation = useSharedValue(0);

  useEffect(() => {
    // Heart beat animation
    heartBeat.value = withRepeat(
      withTiming(1.2, { duration: 800 }),
      -1,
      true
    );

    // Sparkle rotation
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 3000 }),
      -1,
      false
    );
  }, []);

  const heartStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heartBeat.value }],
    };
  });

  const sparkleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${sparkleRotation.value}deg` }],
    };
  });

  const handleCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Camera access is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
      aspect: [3, 4],
    });

    if (!result.canceled && result.assets[0].uri) {
      setNewItem({ ...newItem, image: result.assets[0].uri });
    }
  };

  const handleGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Gallery access is required to select photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      aspect: [3, 4],
    });

    if (!result.canceled && result.assets[0].uri) {
      setNewItem({ ...newItem, image: result.assets[0].uri });
    }
  };

  const addDonatedItem = async () => {
    if (!newItem.image || !newItem.description.trim()) {
      Alert.alert('Error', 'Please add an image and description');
      return;
    }

    const item: DonatedItem = {
      id: Date.now(),
      image: newItem.image,
      category: newItem.category,
      description: newItem.description.trim(),
      donatedAt: new Date().toISOString().split('T')[0],
    };

    try {
      // Mock API call
      await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      setDonatedItems([item, ...donatedItems]);
      setNewItem({ image: '', category: 'Clothes', description: '' });
      setShowAddModal(false);
      Alert.alert('💝 Success', 'Item donated successfully! Thank you for giving back.');
    } catch (error) {
      console.error('Error donating item:', error);
      Alert.alert('Error', 'Failed to donate item');
    }
  };

  const restoreItem = async (id: number) => {
    Alert.alert(
      'Restore Item',
      'Are you sure you want to restore this item back to your collection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          onPress: async () => {
            try {
              // Mock API call
              await fetch(`/api/donate/${id}/restore`, { method: 'POST' });
              setDonatedItems(donatedItems.filter(item => item.id !== id));
              Alert.alert('✅ Restored', 'Item restored to your collection!');
            } catch (error) {
              console.error('Error restoring item:', error);
            }
          }
        }
      ]
    );
  };

  const deleteItem = async (id: number) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to permanently delete this donated item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Mock API call
              await fetch(`/api/donate/${id}`, { method: 'DELETE' });
              setDonatedItems(donatedItems.filter(item => item.id !== id));
            } catch (error) {
              console.error('Error deleting item:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Donate Clothes</Text>
            <Text style={styles.headerSubtitle}>Give back to the community</Text>
          </View>
          <Animated.View style={[styles.heartIcon, heartStyle]}>
            <Heart size={28} color="#ef4444" fill="#ef4444" />
          </Animated.View>
        </Animated.View>

        {/* Impact Stats */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.impactCard}>
          <View style={styles.impactHeader}>
            <Animated.View style={sparkleStyle}>
              <Sparkles size={24} color="#f59e0b" />
            </Animated.View>
            <Text style={styles.impactTitle}>Your Impact</Text>
          </View>
          <View style={styles.impactStats}>
            <View style={styles.impactStat}>
              <Text style={styles.impactNumber}>{donatedItems.length}</Text>
              <Text style={styles.impactLabel}>Items Donated</Text>
            </View>
            <View style={styles.impactStat}>
              <Text style={styles.impactNumber}>
                {donatedItems.filter(item => item.category === 'Clothes').length}
              </Text>
              <Text style={styles.impactLabel}>Clothes</Text>
            </View>
            <View style={styles.impactStat}>
              <Text style={styles.impactNumber}>
                {donatedItems.filter(item => item.category === 'Shoes').length}
              </Text>
              <Text style={styles.impactLabel}>Shoes</Text>
            </View>
          </View>
          <Text style={styles.impactMessage}>
            🌟 You've helped make a difference in someone's life!
          </Text>
        </Animated.View>

        {/* Add New Donation */}
        <Animated.View entering={FadeInUp.delay(300)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Add Donation</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Donated Items */}
        <Animated.View entering={FadeInUp.delay(400)}>
          <Text style={styles.sectionTitle}>Donated Items</Text>
          {donatedItems.length > 0 ? (
            <View style={styles.itemsGrid}>
              {donatedItems.map((item, index) => (
                <Animated.View key={item.id} entering={FadeInUp.delay(500 + index * 100)}>
                  <View style={styles.itemCard}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    <View style={styles.itemContent}>
                      <Text style={styles.itemCategory}>{item.category}</Text>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                      <Text style={styles.itemDate}>
                        Donated on {new Date(item.donatedAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.itemActions}>
                      <TouchableOpacity
                        style={styles.restoreButton}
                        onPress={() => restoreItem(item.id)}
                      >
                        <RotateCcw size={16} color="#6366f1" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteItem(item.id)}
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Gift size={48} color="#94a3b8" />
              <Text style={styles.emptyStateTitle}>No donations yet</Text>
              <Text style={styles.emptyStateText}>
                Start giving back by donating clothes you no longer wear
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Community Impact */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.communityCard}>
          <View style={styles.communityHeader}>
            <Users size={24} color="#10b981" />
            <Text style={styles.communityTitle}>Community Impact</Text>
          </View>
          <Text style={styles.communityText}>
            Your donations help provide clothing to those in need. Every item makes a difference 
            in someone's life and helps reduce textile waste.
          </Text>
          <View style={styles.communityStats}>
            <Text style={styles.communityStatText}>
              💚 Eco-friendly • 🤝 Community support • ❤️ Making a difference
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Add Item Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Donate Item</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Image Selection */}
            <View style={styles.imageSection}>
              <Text style={styles.inputLabel}>Item Photo</Text>
              {newItem.image ? (
                <View style={styles.selectedImageContainer}>
                  <Image source={{ uri: newItem.image }} style={styles.selectedImage} />
                  <TouchableOpacity 
                    style={styles.changeImageButton}
                    onPress={() => setNewItem({ ...newItem, image: '' })}
                  >
                    <Text style={styles.changeImageText}>Change Photo</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.imageButtons}>
                  <Button
                    mode="outlined"
                    icon={() => <Camera size={20} color="#6366f1" />}
                    onPress={handleCamera}
                    style={styles.imageButton}
                  >
                    Camera
                  </Button>
                  <Button
                    mode="outlined"
                    icon={() => <ImageIcon size={20} color="#6366f1" />}
                    onPress={handleGallery}
                    style={styles.imageButton}
                  >
                    Gallery
                  </Button>
                </View>
              )}
            </View>

            {/* Category Selection */}
            <View style={styles.categorySection}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryButtons}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      newItem.category === category && styles.selectedCategoryButton
                    ]}
                    onPress={() => setNewItem({ ...newItem, category })}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      newItem.category === category && styles.selectedCategoryButtonText
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Description */}
            <TextInput
              mode="outlined"
              label="Description"
              value={newItem.description}
              onChangeText={text => setNewItem({ ...newItem, description: text })}
              style={styles.descriptionInput}
              theme={{
                colors: {
                  primary: '#ef4444',
                  outline: '#e2e8f0',
                }
              }}
              placeholder="Describe the item (e.g., Blue denim jacket, size M)"
              multiline
              numberOfLines={3}
            />

            <Button
              mode="contained"
              onPress={addDonatedItem}
              style={styles.donateButton}
              labelStyle={styles.donateButtonText}
              disabled={!newItem.image || !newItem.description.trim()}
            >
              Donate Item
            </Button>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  heartIcon: {
    padding: 8,
  },
  impactCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  impactStat: {
    alignItems: 'center',
  },
  impactNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ef4444',
  },
  impactLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  impactMessage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsGrid: {
    marginBottom: 32,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: '#64748b',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  restoreButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  communityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  communityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  communityText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  communityStats: {
    alignItems: 'center',
  },
  communityStatText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalClose: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  imageSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  selectedImageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 12,
  },
  changeImageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  changeImageText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  imageButton: {
    flex: 1,
    borderColor: '#6366f1',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedCategoryButton: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  selectedCategoryButtonText: {
    color: 'white',
  },
  descriptionInput: {
    backgroundColor: 'white',
    marginBottom: 24,
  },
  donateButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 8,
  },
  donateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});