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
} from 'react-native';
// FashionAssistant.tsx

import fashionStyles from '../../styles/Fashion-assistant';



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

const defaultCategories = ['Casual', 'Formal', 'Sports', 'Party', 'Others'];
const CARD_WIDTH = Dimensions.get('window').width * 0.45;
const CARD_HEIGHT = CARD_WIDTH * 1.3;
const BACKEND_URL = 'http://192.168.1.7:5000/api';

const BOT_ICON_URI =
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop';

export default function FashionAssistant() {
  const [selectedCategory, setSelectedCategory] = useState('Casual');
  const [categorizedOutfits, setCategorizedOutfits] = useState({});
  const [urlInput, setUrlInput] = useState('');
  const [chatVisible, setChatVisible] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [categories, setCategories] = useState(defaultCategories);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchAllOutfits();
  }, []);

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
      
      if (res.ok) {
        const data = await res.json();
        if (data.image) {
          await uploadImage(data.image, selectedCategory);
          setUrlInput('');
        } else {
          throw new Error('No image found');
        }
      } else {
        throw new Error('Failed to extract image');
      }
    } catch (err) {
      Alert.alert('Invalid URL', 'Could not extract image from the provided URL.');
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
    console.log('Donate Res Status:', donateRes.status);

    if (!donateRes.ok) {
      const text = await donateRes.text();
      console.error('Donate error:', text);
      throw new Error('Donate API failed');
    }

    // DELETE the outfit
    const deleteRes = await fetch(`${BACKEND_URL}/outfits/${outfitId}`, {
      method: 'DELETE',
    });
    console.log('Delete Res Status:', deleteRes.status);

    if (!deleteRes.ok) {
      const text = await deleteRes.text();
      console.error('Delete error:', text);
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

  return (
    <>
      <ScrollView style={fashionStyles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={fashionStyles.header}>
          <View style={fashionStyles.headerInner}>
            <HeaderAnimatedText />
            <IconButton
              icon="refresh"
              size={22}
              onPress={fetchAllOutfits}
              style={fashionStyles.refreshButton}
              iconColor="#0f172a"
              disabled={loading}
            />
          </View>
        </View>

        {/* Category Tabs */}
       <ScrollView
  horizontal
  style={fashionStyles.tabsContainer}
  contentContainerStyle={fashionStyles.tabsContent}
  showsHorizontalScrollIndicator={false}
>

          {categories.map(cat => (
            <Button
              key={cat}
              mode={selectedCategory === cat ? 'contained' : 'outlined'}
              onPress={() => setSelectedCategory(cat)}
              style={[
                fashionStyles.categoryTab,
                {
                  backgroundColor: selectedCategory === cat ? '#e0761f' : '#fff',
                  borderColor: '#202020',
                }
              ]}
              labelStyle={[
                fashionStyles.categoryTabLabel,
                { color: selectedCategory === cat ? 'white' : '#202020' }
              ]}
            >
              {cat}
            </Button>
          ))}

          {/* Add New Category */}
          {!addingNew ? (
            <Button
              icon="plus"
              mode="outlined"
              onPress={() => setAddingNew(true)}
              style={fashionStyles.addCategoryButton}
              labelStyle={fashionStyles.addCategoryLabel}
            />
          ) : (
            <View style={fashionStyles.addCategoryContainer}>
              <TextInput
                mode="outlined"
                placeholder="New Category"
                value={customCategory}
                onChangeText={setCustomCategory}
                style={fashionStyles.categoryInput}
                theme={{ roundness: 10 }}
              />
              <Button
                mode="contained"
                onPress={handleAddCustomCategory}
                style={fashionStyles.addButton}
                labelStyle={fashionStyles.addButtonLabel}
              >
                Add
              </Button>
              <IconButton
                icon="close"
                onPress={() => {
                  setAddingNew(false);
                  setCustomCategory('');
                }}
                style={fashionStyles.cancelButton}
                iconColor="#ef4444"
              />
            </View>
          )}
        </ScrollView>

        {/* Upload Buttons */}
        <View style={fashionStyles.uploadButtonRow}>
          <Button 
            mode="contained" 
            icon="camera" 
            onPress={handleCamera} 
            style={fashionStyles.cameraButton} 
            labelStyle={fashionStyles.buttonLabel1}
            disabled={loading}
          >
            Camera
          </Button>
          <Button 
            mode="contained" 
            icon="image" 
            onPress={handleGallery} 
            style={fashionStyles.galleryButton} 
            labelStyle={fashionStyles.buttonLabel2}
            disabled={loading}
          >
            Gallery
          </Button>
        </View>

        {/* URL Input */}
        <View style={fashionStyles.urlInputRow}>
          <TextInput
            mode="outlined"
            placeholder="Paste product URL (Myntra, Ajio, etc.)"
            value={urlInput}
            onChangeText={setUrlInput}
            style={fashionStyles.urlInput}
            theme={{ roundness: 10 }}
            disabled={loading}
          />
          <Button 
            mode="contained" 
            onPress={handleUrlSubmit} 
            style={fashionStyles.urlAddButton} 
            labelStyle={fashionStyles.urlAddButtonLabel}
            disabled={loading || !urlInput.trim()}
          >
            Add
          </Button>
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={fashionStyles.loadingContainer}>
            <Text style={fashionStyles.loadingText}>Processing...</Text>
          </View>
        )}

        {/* Outfit Cards */}
        <View style={fashionStyles.outfitsSection}>
          <Text style={fashionStyles.sectionTitle}>
            {selectedCategory} Outfits ({categorizedOutfits[selectedCategory]?.length || 0})
          </Text>
          
          {categorizedOutfits[selectedCategory]?.length ? (
            <View style={fashionStyles.outfitContainer}>
              {categorizedOutfits[selectedCategory].map((item, index) => (
                <View key={item.id || index} style={fashionStyles.card}>
                  <Image source={{ uri: item.image }} style={fashionStyles.cardImage} />
                  <View style={fashionStyles.cardActions}>
                    <Button
  mode="outlined"
  onPress={() => handleDonateOutfit(item.id, item.image, selectedCategory)}
  style={fashionStyles.donateButton}
  labelStyle={fashionStyles.donateButtonLabel}
>
  💖 Donate
</Button>

                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => handleDeleteOutfit(item.id, selectedCategory)}
                      iconColor="#ef4444"
                      style={fashionStyles.deleteButton}
                    />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={fashionStyles.emptyState}>
              <Text style={fashionStyles.emptyStateTitle}>No outfits yet</Text>
              <Text style={fashionStyles.emptyStateSubtitle}>
                Add your first {selectedCategory.toLowerCase()} outfit using the camera, gallery, or URL
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Bot Icon */}
      <TouchableOpacity onPress={toggleChat} style={fashionStyles.botIcon}>
        {chatVisible ? (
          <View style={fashionStyles.closeBotIcon}>
            <Text style={fashionStyles.closeBotText}>✖</Text>
          </View>
        ) : (
          <Image source={{ uri: BOT_ICON_URI }} style={fashionStyles.botImage} />
        )}
      </TouchableOpacity>

      {/* Sliding Chat Window */}
      {chatVisible && (
        <Animated.View style={[
          fashionStyles.chatBoxRight, 
          { transform: [{ translateX: slideUp }] }
        ]}>
          <Text style={fashionStyles.chatTitle}>🤖 Hi! I'm your Fashion Buddy</Text>
          <Text style={fashionStyles.chatSubtitle}>How can I help you today?</Text>

          {!showMainMenu ? (
            <Button
              mode="contained"
              onPress={() => setShowMainMenu(true)}
              style={fashionStyles.mainMenuButton}
              labelStyle={fashionStyles.mainMenuButtonLabel}
            >
              Browse Categories
            </Button>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={fashionStyles.chatMenuContent}
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
                    fashionStyles.chatCategoryButton,
                    {
                      backgroundColor: selectedCategory === cat ? '#e0761f' : '#fff',
                      borderColor: '#202020',
                    }
                  ]}
                  labelStyle={[
                    fashionStyles.chatCategoryButtonLabel,
                    { color: selectedCategory === cat ? 'white' : '#202020' }
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