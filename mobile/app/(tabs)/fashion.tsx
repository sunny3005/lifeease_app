import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { 
  Camera, 
  Image as ImageIcon, 
  Sparkles, 
  Heart, 
  Trash2, 
  Plus,
  Bot,
  X,
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

const categories = ['Casual', 'Formal', 'Sports', 'Party', 'Others'];

const mockOutfits = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    category: 'Casual',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    category: 'Formal',
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    category: 'Sports',
  },
];

export default function FashionTab() {
  const [selectedCategory, setSelectedCategory] = useState('Casual');
  const [outfits, setOutfits] = useState(mockOutfits);
  const [urlInput, setUrlInput] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [loading, setLoading] = useState(false);

  // Animation values
  const sparkleRotation = useSharedValue(0);
  const chatSlide = useSharedValue(300);

  useEffect(() => {
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 3000 }),
      -1,
      false
    );
  }, []);

  const sparkleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${sparkleRotation.value}deg` }],
    };
  });

  const chatStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: chatSlide.value }],
    };
  });

  const toggleAIChat = () => {
    if (showAIChat) {
      chatSlide.value = withSpring(300);
      setTimeout(() => setShowAIChat(false), 300);
    } else {
      setShowAIChat(true);
      chatSlide.value = withSpring(0);
    }
  };

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
      const newOutfit = {
        id: Date.now(),
        image: result.assets[0].uri,
        category: selectedCategory,
      };
      setOutfits([newOutfit, ...outfits]);
      Alert.alert('✅ Success', 'Outfit added successfully!');
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
      const newOutfit = {
        id: Date.now(),
        image: result.assets[0].uri,
        category: selectedCategory,
      };
      setOutfits([newOutfit, ...outfits]);
      Alert.alert('✅ Success', 'Outfit added successfully!');
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      Alert.alert('Invalid URL', 'Please enter a valid URL.');
      return;
    }

    const newOutfit = {
      id: Date.now(),
      image: urlInput.trim(),
      category: selectedCategory,
    };
    setOutfits([newOutfit, ...outfits]);
    setUrlInput('');
    Alert.alert('✅ Success', 'Outfit added successfully!');
  };

  const handleDeleteOutfit = (id: number) => {
    Alert.alert(
      'Delete Outfit',
      'Are you sure you want to delete this outfit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setOutfits(outfits.filter(outfit => outfit.id !== id));
            Alert.alert('✅ Deleted', 'Outfit removed successfully');
          }
        }
      ]
    );
  };

  const handleDonateOutfit = (id: number) => {
    Alert.alert(
      'Donate Outfit',
      'Are you sure you want to donate this outfit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Donate',
          onPress: () => {
            setOutfits(outfits.filter(outfit => outfit.id !== id));
            Alert.alert('💝 Success', 'Outfit donated successfully! Thank you for giving back.');
          }
        }
      ]
    );
  };

  const currentOutfits = outfits.filter(outfit => outfit.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Fashion Assistant</Text>
            <Text style={styles.headerSubtitle}>AI-powered style recommendations</Text>
          </View>
          <Animated.View style={sparkleStyle}>
            <Sparkles size={28} color="#ec4899" />
          </Animated.View>
        </Animated.View>

        {/* Category Tabs */}
        <Animated.View entering={FadeInUp.delay(200)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryTab,
                  selectedCategory === category && styles.activeCategoryTab
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryTabText,
                  selectedCategory === category && styles.activeCategoryTabText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Upload Buttons */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.uploadSection}>
          <View style={styles.uploadButtons}>
            <Button
              mode="contained"
              icon={() => <Camera size={20} color="white" />}
              onPress={handleCamera}
              style={[styles.uploadButton, { backgroundColor: '#ec4899' }]}
              labelStyle={styles.uploadButtonText}
            >
              Camera
            </Button>
            <Button
              mode="contained"
              icon={() => <ImageIcon size={20} color="white" />}
              onPress={handleGallery}
              style={[styles.uploadButton, { backgroundColor: '#6366f1' }]}
              labelStyle={styles.uploadButtonText}
            >
              Gallery
            </Button>
          </View>

          <View style={styles.urlInputContainer}>
            <TextInput
              mode="outlined"
              placeholder="Paste product URL (Myntra, Ajio, etc.)"
              value={urlInput}
              onChangeText={setUrlInput}
              style={styles.urlInput}
              theme={{
                colors: {
                  primary: '#ec4899',
                  outline: '#e2e8f0',
                }
              }}
            />
            <Button
              mode="contained"
              onPress={handleUrlSubmit}
              style={[styles.urlButton, { backgroundColor: '#ec4899' }]}
              labelStyle={styles.urlButtonText}
              disabled={!urlInput.trim()}
            >
              Add
            </Button>
          </View>
        </Animated.View>

        {/* Outfits Grid */}
        <Animated.View entering={FadeInUp.delay(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory} Outfits ({currentOutfits.length})
            </Text>
            <TouchableOpacity onPress={toggleAIChat} style={styles.aiButton}>
              <Bot size={20} color="#ec4899" />
              <Text style={styles.aiButtonText}>AI Tips</Text>
            </TouchableOpacity>
          </View>

          {currentOutfits.length > 0 ? (
            <View style={styles.outfitsGrid}>
              {currentOutfits.map((outfit, index) => (
                <Animated.View key={outfit.id} entering={FadeInUp.delay(500 + index * 100)}>
                  <View style={styles.outfitCard}>
                    <Image source={{ uri: outfit.image }} style={styles.outfitImage} />
                    <View style={styles.outfitActions}>
                      <TouchableOpacity
                        style={styles.donateButton}
                        onPress={() => handleDonateOutfit(outfit.id)}
                      >
                        <Heart size={16} color="#ef4444" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteOutfit(outfit.id)}
                      >
                        <Trash2 size={16} color="#64748b" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Sparkles size={48} color="#94a3b8" />
              <Text style={styles.emptyStateTitle}>No outfits yet</Text>
              <Text style={styles.emptyStateText}>
                Add your first {selectedCategory.toLowerCase()} outfit using the camera, gallery, or URL
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* AI Chat Overlay */}
      {showAIChat && (
        <Animated.View style={[styles.aiChatOverlay, chatStyle]}>
          <View style={styles.aiChatHeader}>
            <Text style={styles.aiChatTitle}>🤖 AI Fashion Assistant</Text>
            <TouchableOpacity onPress={toggleAIChat}>
              <X size={24} color="#1e293b" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.aiChatContent}>
            <Text style={styles.aiChatText}>
              Hi! I'm your AI fashion assistant. Here are some tips for your {selectedCategory.toLowerCase()} collection:
            </Text>
            <View style={styles.aiTipCard}>
              <Text style={styles.aiTipTitle}>✨ Style Tips</Text>
              <Text style={styles.aiTipText}>
                • Mix textures for visual interest{'\n'}
                • Layer pieces to create depth{'\n'}
                • Choose comfortable shoes{'\n'}
                • Add a pop of color with accessories
              </Text>
            </View>
            <View style={styles.aiTipCard}>
              <Text style={styles.aiTipTitle}>🎨 Color Recommendations</Text>
              <View style={styles.colorChips}>
                {['Navy Blue', 'White', 'Beige', 'Soft Pink'].map(color => (
                  <View key={color} style={styles.colorChip}>
                    <Text style={styles.colorChipText}>{color}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      )}

      {/* Floating AI Button */}
      <TouchableOpacity style={styles.floatingAIButton} onPress={toggleAIChat}>
        <Bot size={24} color="white" />
      </TouchableOpacity>
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
  categoriesScroll: {
    marginBottom: 24,
  },
  categoriesContent: {
    gap: 12,
    paddingHorizontal: 4,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeCategoryTab: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeCategoryTabText: {
    color: 'white',
  },
  uploadSection: {
    marginBottom: 32,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  uploadButton: {
    flex: 1,
    borderRadius: 12,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  urlInputContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  urlInput: {
    flex: 1,
    backgroundColor: 'white',
  },
  urlButton: {
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  urlButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  aiButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ec4899',
  },
  outfitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  outfitCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  outfitImage: {
    width: '100%',
    height: 200,
  },
  outfitActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  donateButton: {
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 8,
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
  floatingAIButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ec4899',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  aiChatOverlay: {
    position: 'absolute',
    top: 100,
    bottom: 100,
    right: 0,
    width: '85%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  aiChatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  aiChatTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  aiChatContent: {
    flex: 1,
    padding: 20,
  },
  aiChatText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 20,
  },
  aiTipCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  aiTipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  aiTipText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  colorChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorChip: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  colorChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
});