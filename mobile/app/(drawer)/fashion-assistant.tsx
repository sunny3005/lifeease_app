import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  Alert,
  Animated,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  IconButton,
  Button,
  TextInput,
} from 'react-native-paper';
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import { HeaderAnimatedText } from '@/components/ui/HeaderAnimatedText';
import { useTheme } from '@/context/ThemeContext';
import { Camera, Image as ImageIcon, Plus, X, Trash2, Heart } from 'lucide-react-native';

const defaultCategories = ['Casual', 'Formal', 'Sports', 'Party', 'Others'];
const CARD_WIDTH = Dimensions.get('window').width * 0.45;
const BACKEND_URL = 'http://192.168.1.7:5000/api';

const BOT_ICON_URI =
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop';

export default function FashionAssistant() {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('Casual');
  const [categorizedOutfits, setCategorizedOutfits] = useState({});
  const [urlInput, setUrlInput] = useState('');
  const [chatVisible, setChatVisible] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [categories, setCategories] = useState(defaultCategories);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchAllOutfits();
    }, [categories])
  );

  useEffect(() => {
    fetchAllOutfits();
  }, [categories]);

  const fetchAllOutfits = async () => {
    setLoading(true);
    const results = {};
    for (const cat of categories) {
      try {
        const res = await fetch(`${BACKEND_URL}/outfits/${cat}`);
        if (res.ok) {
          const data = await res.json();
          results[cat] = data;
        } else {
          results[cat] = [];
        }
      } catch (err) {
        console.error(`Failed to fetch ${cat} outfits`, err);
        results[cat] = [];
      }
    }
    setCategorizedOutfits(results);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllOutfits();
    setRefreshing(false);
  };

  const uploadImage = async (imageUri, category) => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/outfits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageUri, category }),
      });

      if (res.ok) {
        const data = await res.json();
        setCategorizedOutfits((prev) => ({
          ...prev,
          [category]: [data, ...(prev[category] || [])],
        }));
        Alert.alert('Success', 'Outfit uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      Alert.alert('Upload failed', 'Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCamera = async () => {
    const permission = await requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert('Permission needed', 'Camera access is required to take photos.');
    }

    const result = await launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
      aspect: [4, 3]
    });

    if (!result.canceled && result.assets[0].uri) {
      await uploadImage(result.assets[0].uri, selectedCategory);
    }
  };

  const handleGallery = async () => {
    const permission = await requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert('Permission needed', 'Gallery access is required to select photos.');
    }

    const result = await launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      aspect: [4, 3]
    });

    if (!result.canceled && result.assets[0].uri) {
      await uploadImage(result.assets[0].uri, selectedCategory);
    }
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) {
      Alert.alert('Invalid URL', 'Please enter a valid URL.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/extract-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productUrl: urlInput.trim() }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('❌ Backend error:', error);
        throw new Error(error?.error || 'Failed to extract image');
      }

      const data = await res.json();

      if (!data.image) {
        throw new Error('No image found in the page');
      }

      await uploadImage(data.image, selectedCategory);
      setUrlInput('');

    } catch (err) {
      console.error('❌ Extract error:', err);
      Alert.alert('Error', err.message || 'Could not extract image from the provided URL.');
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    if (!chatVisible) {
      setChatVisible(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setChatVisible(false);
        setShowMainMenu(false);
      });
    }
  };

  const handleAddCustomCategory = () => {
    const trimmed = customCategory.trim();
    if (!trimmed) {
      Alert.alert('Invalid Category', 'Please enter a category name.');
      return;
    }

    if (categories.includes(trimmed)) {
      Alert.alert('Category Exists', 'This category already exists.');
      return;
    }

    const newCategories = [...categories, trimmed];
    setCategories(newCategories);
    setCategorizedOutfits((prev) => ({ ...prev, [trimmed]: [] }));
    setSelectedCategory(trimmed);
    setAddingNew(false);
    setCustomCategory('');
  };

  const handleDeleteOutfit = async (outfitId, category) => {
    Alert.alert(
      'Delete Outfit',
      'Are you sure you want to delete this outfit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${BACKEND_URL}/outfits/${outfitId}`, {
                method: 'DELETE',
              });
              if (!res.ok) throw new Error('Delete failed');

              setCategorizedOutfits((prev) => ({
                ...prev,
                [category]: prev[category].filter(item => item.id !== outfitId),
              }));
            } catch (err) {
              Alert.alert('Error', 'Failed to delete from database.');
            }
          }
        }
      ]
    );
  };

  const slideUp = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const handleDonateOutfit = async (outfitId, imageUri, category) => {
    try {
      setLoading(true);

      // POST to donate
      const donateRes = await fetch(`${BACKEND_URL}/donate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: outfitId, image: imageUri, category }),
      });

      if (!donateRes.ok) {
        throw new Error('Donate API failed');
      }

      // DELETE the outfit
      const deleteRes = await fetch(`${BACKEND_URL}/outfits/${outfitId}`, {
        method: 'DELETE',
      });

      if (!deleteRes.ok) {
        throw new Error('Delete API failed');
      }

      // Update UI state
      setCategorizedOutfits(prev => ({
        ...prev,
        [category]: prev[category].filter(item => item.id !== outfitId),
      }));

      Alert.alert('Success', 'Outfit donated successfully!');
    } catch (err) {
      console.error('DonateFlow failed:', err);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(colors);

  return (
    <>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <HeaderAnimatedText />
            <IconButton
              icon="refresh"
              size={22}
              onPress={fetchAllOutfits}
              style={styles.refreshButton}
              iconColor={colors.text}
              disabled={loading}
            />
          </View>
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
          showsHorizontalScrollIndicator={false}
        >
          {categories.map(cat => (
            <Button
              key={cat}
              mode={selectedCategory === cat ? 'contained' : 'outlined'}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryTab,
                {
                  backgroundColor: selectedCategory === cat ? colors.primary : colors.surface,
                  borderColor: colors.border,
                }
              ]}
              labelStyle={[
                styles.categoryTabLabel,
                { color: selectedCategory === cat ? 'white' : colors.text }
              ]}
            >
              {cat}
            </Button>
          ))}

          {/* Add New Category */}
          {!addingNew ? (
            <Button
              icon={() => <Plus size={16} color={colors.primary} />}
              mode="outlined"
              onPress={() => setAddingNew(true)}
              style={[styles.addCategoryButton, { borderColor: colors.border }]}
              labelStyle={[styles.addCategoryLabel, { color: colors.primary }]}
            />
          ) : (
            <View style={styles.addCategoryContainer}>
              <TextInput
                mode="outlined"
                placeholder="New Category"
                value={customCategory}
                onChangeText={setCustomCategory}
                style={styles.categoryInput}
                theme={{ 
                  roundness: 10,
                  colors: {
                    background: colors.surface,
                    onSurfaceVariant: colors.textSecondary,
                    outline: colors.border,
                  }
                }}
              />
              <Button
                mode="contained"
                onPress={handleAddCustomCategory}
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                labelStyle={styles.addButtonLabel}
              >
                Add
              </Button>
              <IconButton
                icon={() => <X size={16} color={colors.error} />}
                onPress={() => {
                  setAddingNew(false);
                  setCustomCategory('');
                }}
                style={[styles.cancelButton, { backgroundColor: colors.surface }]}
              />
            </View>
          )}
        </ScrollView>

        {/* Upload Buttons */}
        <View style={styles.uploadButtonRow}>
          <Button
            mode="contained"
            icon={() => <Camera size={20} color="white" />}
            onPress={handleCamera}
            style={[styles.cameraButton, { backgroundColor: colors.primary }]}
            labelStyle={styles.buttonLabel1}
            disabled={loading}
          >
            Camera
          </Button>
          <Button
            mode="contained"
            icon={() => <ImageIcon size={20} color="white" />}
            onPress={handleGallery}
            style={[styles.galleryButton, { backgroundColor: colors.success }]}
            labelStyle={styles.buttonLabel2}
            disabled={loading}
          >
            Gallery
          </Button>
        </View>

        {/* URL Input */}
        <View style={styles.urlInputRow}>
          <TextInput
            mode="outlined"
            placeholder="Paste product URL (Myntra, Ajio, etc.)"
            value={urlInput}
            onChangeText={setUrlInput}
            style={styles.urlInput}
            theme={{ 
              roundness: 10,
              colors: {
                background: colors.surface,
                onSurfaceVariant: colors.textSecondary,
                outline: colors.border,
              }
            }}
            disabled={loading}
          />
          <Button
            mode="contained"
            onPress={handleUrlSubmit}
            style={[styles.urlAddButton, { backgroundColor: colors.primary }]}
            labelStyle={styles.urlAddButtonLabel}
            disabled={loading || !urlInput.trim()}
          >
            Add
          </Button>
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Processing...</Text>
          </View>
        )}

        {/* Outfit Cards */}
        <View style={styles.outfitsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {selectedCategory} Outfits ({categorizedOutfits[selectedCategory]?.length || 0})
          </Text>

          {categorizedOutfits[selectedCategory]?.length ? (
            <View style={styles.outfitContainer}>
              {categorizedOutfits[selectedCategory].map((item, index) => (
                <View key={item.id || index} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Image source={{ uri: item.image }} style={styles.cardImage} />
                  <View style={styles.cardActions}>
                    <Button
                      mode="outlined"
                      icon={() => <Heart size={16} color={colors.error} />}
                      onPress={() => handleDonateOutfit(item.id, item.image, selectedCategory)}
                      style={[styles.donateButton, { borderColor: colors.error }]}
                      labelStyle={[styles.donateButtonLabel, { color: colors.error }]}
                    >
                      Donate
                    </Button>

                    <IconButton
                      icon={() => <Trash2 size={16} color={colors.error} />}
                      size={20}
                      onPress={() => handleDeleteOutfit(item.id, selectedCategory)}
                      style={[styles.deleteButton, { backgroundColor: colors.surface }]}
                    />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateTitle, { color: colors.textSecondary }]}>No outfits yet</Text>
              <Text style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}>
                Add your first {selectedCategory.toLowerCase()} outfit using the camera, gallery, or URL
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Bot Icon */}
      <TouchableOpacity onPress={toggleChat} style={styles.botIcon}>
        {chatVisible ? (
          <View style={[styles.closeBotIcon, { backgroundColor: colors.error }]}>
            <X size={24} color="white" />
          </View>
        ) : (
          <Image source={{ uri: BOT_ICON_URI }} style={styles.botImage} />
        )}
      </TouchableOpacity>

      {/* Sliding Chat Window */}
      {chatVisible && (
        <Animated.View style={[
          styles.chatBoxRight,
          { 
            transform: [{ translateX: slideUp }],
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }
        ]}>
          <Text style={[styles.chatTitle, { color: colors.text }]}>🤖 Hi! I'm your Fashion Buddy</Text>
          <Text style={[styles.chatSubtitle, { color: colors.textSecondary }]}>How can I help you today?</Text>

          {!showMainMenu ? (
            <Button
              mode="contained"
              onPress={() => setShowMainMenu(true)}
              style={[styles.mainMenuButton, { backgroundColor: colors.primary }]}
              labelStyle={styles.mainMenuButtonLabel}
            >
              Browse Categories
            </Button>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.chatMenuContent}
            >
              {categories.map(cat => (
                <Button
                  key={cat}
                  mode={selectedCategory === cat ? 'contained' : 'outlined'}
                  onPress={() => {
                    setSelectedCategory(cat);
                    toggleChat();
                    setShowMainMenu(false);
                  }}
                  style={[
                    styles.chatCategoryButton,
                    {
                      backgroundColor: selectedCategory === cat ? colors.primary : colors.surface,
                      borderColor: colors.border,
                    }
                  ]}
                  labelStyle={[
                    styles.chatCategoryButtonLabel,
                    { color: selectedCategory === cat ? 'white' : colors.text }
                  ]}
                >
                  {cat} ({categorizedOutfits[cat]?.length || 0})
                </Button>
              ))}
            </ScrollView>
          )}
        </Animated.View>
      )}
    </>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 1,
    borderColor: colors.border,
    elevation: 3,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
  },
  refreshButton: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
  },
  tabsContainer: {
    marginTop: 14,
  },
  tabsContent: {
    gap: 10,
    paddingHorizontal: 16,
  },
  categoryTab: {
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryTabLabel: {
    fontWeight: 'bold',
  },
  addCategoryButton: {
    borderRadius: 20,
  },
  addCategoryLabel: {
    fontWeight: 'bold',
  },
  addCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryInput: {
    width: 120,
    height: 44,
  },
  addButton: {
    height: 44,
    borderRadius: 10,
  },
  addButtonLabel: {
    color: '#fff',
  },
  cancelButton: {
    borderRadius: 50,
  },
  uploadButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 10,
  },
  cameraButton: {
    flex: 1,
    borderRadius: 12,
  },
  galleryButton: {
    flex: 1,
    borderRadius: 12,
  },
  buttonLabel1: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonLabel2: {
    color: '#fff',
    fontWeight: 'bold',
  },
  urlInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    gap: 10,
  },
  urlInput: {
    flex: 1,
    borderRadius: 10,
  },
  urlAddButton: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  urlAddButtonLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  outfitsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  outfitContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  donateButton: {
    flex: 1,
    marginRight: 8,
  },
  donateButtonLabel: {
    fontSize: 12,
  },
  deleteButton: {
    borderRadius: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  botIcon: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 99,
    borderRadius: 50,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  closeBotIcon: {
    padding: 15,
    borderRadius: 30,
  },
  chatBoxRight: {
    position: 'absolute',
    top: 100,
    bottom: 100,
    right: 0,
    width: '80%',
    padding: 20,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    elevation: 8,
    zIndex: 99,
    borderWidth: 1,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chatSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  mainMenuButton: {
    marginBottom: 12,
    borderRadius: 12,
  },
  mainMenuButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  chatMenuContent: {
    gap: 10,
    paddingBottom: 30,
  },
  chatCategoryButton: {
    borderRadius: 12,
    borderWidth: 1,
  },
  chatCategoryButtonLabel: {
    fontWeight: 'bold',
  },
});