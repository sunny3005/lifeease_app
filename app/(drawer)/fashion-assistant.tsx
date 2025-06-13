import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Image, 
  Dimensions, 
  TouchableOpacity,
  Platform,
  Alert
} from 'react-native';
import { 
  Camera, 
  ImageIcon, 
  Link, 
  Shirt, 
  ArrowRight, 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown,
  Trash2,
  Plus
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_HEIGHT = 400;
const SWIPE_THRESHOLD = 100;

type OutfitCategory = 'formal' | 'party' | 'sports' | 'daily';

interface Outfit {
  id: string;
  image: string;
  category?: OutfitCategory;
}

interface CategoryData {
  name: string;
  color: string;
  icon: React.ComponentType<any>;
  direction: string;
}

const categories: Record<OutfitCategory, CategoryData> = {
  formal: { name: 'Formal', color: '#1e293b', icon: ArrowRight, direction: 'Swipe Right' },
  party: { name: 'Party', color: '#ec4899', icon: ArrowLeft, direction: 'Swipe Left' },
  sports: { name: 'Sports', color: '#10b981', icon: ArrowUp, direction: 'Swipe Up' },
  daily: { name: 'Daily', color: '#f59e0b', icon: ArrowDown, direction: 'Swipe Down' },
};

export default function FashionAssistant() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [categorizedOutfits, setCategorizedOutfits] = useState<Record<OutfitCategory, Outfit[]>>({
    formal: [],
    party: [],
    sports: [],
    daily: [],
  });
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [currentSwipeDirection, setCurrentSwipeDirection] = useState<OutfitCategory | null>(null);

  // Animation values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  const addOutfit = (imageUri: string) => {
    if (!imageUri.trim()) return;
    
    const newOutfit: Outfit = {
      id: Date.now().toString(),
      image: imageUri,
    };
    setOutfits(prev => [newOutfit, ...prev]);
    setImageUrl('');
    setShowUrlInput(false);
  };

  const removeOutfit = (id: string) => {
    setOutfits(prev => prev.filter(outfit => outfit.id !== id));
  };

  const categorizeOutfit = (outfit: Outfit, category: OutfitCategory) => {
    // Remove from uncategorized
    setOutfits(prev => prev.filter(o => o.id !== outfit.id));
    
    // Add to category
    setCategorizedOutfits(prev => ({
      ...prev,
      [category]: [...prev[category], { ...outfit, category }]
    }));

    // Reset animation values
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    scale.value = withSpring(1);
    rotate.value = withSpring(0);
    opacity.value = withSpring(1);
    setCurrentSwipeDirection(null);
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        addOutfit(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Camera not available', 'Camera is not available on web platform');
      return;
    }

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        addOutfit(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const updateSwipeDirection = (x: number, y: number) => {
    'worklet';
    let direction: OutfitCategory | null = null;
    
    if (Math.abs(x) > Math.abs(y)) {
      if (x > SWIPE_THRESHOLD) direction = 'formal';
      else if (x < -SWIPE_THRESHOLD) direction = 'party';
    } else {
      if (y < -SWIPE_THRESHOLD) direction = 'sports';
      else if (y > SWIPE_THRESHOLD) direction = 'daily';
    }
    
    if (direction !== currentSwipeDirection) {
      runOnJS(setCurrentSwipeDirection)(direction);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      
      const distance = Math.sqrt(event.translationX ** 2 + event.translationY ** 2);
      scale.value = interpolate(distance, [0, 200], [1, 0.95], Extrapolation.CLAMP);
      rotate.value = interpolate(event.translationX, [-200, 200], [-15, 15], Extrapolation.CLAMP);
      
      updateSwipeDirection(event.translationX, event.translationY);
    })
    .onEnd((event) => {
      const { translationX: x, translationY: y } = event;
      
      let category: OutfitCategory | null = null;
      if (Math.abs(x) > Math.abs(y)) {
        if (x > SWIPE_THRESHOLD) category = 'formal';
        else if (x < -SWIPE_THRESHOLD) category = 'party';
      } else {
        if (y < -SWIPE_THRESHOLD) category = 'sports';
        else if (y > SWIPE_THRESHOLD) category = 'daily';
      }

      if (category && outfits.length > 0) {
        // Animate out
        translateX.value = withTiming(x > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH, { duration: 300 });
        translateY.value = withTiming(y, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        
        // Categorize after animation
        setTimeout(() => {
          runOnJS(categorizeOutfit)(outfits[0], category);
        }, 300);
      } else {
        // Spring back
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
        rotate.value = withSpring(0);
        runOnJS(setCurrentSwipeDirection)(null);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const renderSwipeIndicators = () => (
    <View style={styles.swipeIndicators}>
      {Object.entries(categories).map(([key, category]) => {
        const isActive = currentSwipeDirection === key;
        const IconComponent = category.icon;
        
        return (
          <View
            key={key}
            style={[
              styles.swipeIndicator,
              { backgroundColor: isActive ? category.color : '#f1f5f9' }
            ]}
          >
            <IconComponent 
              size={16} 
              color={isActive ? 'white' : '#64748b'} 
            />
            <Text style={[
              styles.swipeIndicatorText,
              { color: isActive ? 'white' : '#64748b' }
            ]}>
              {category.name}
            </Text>
          </View>
        );
      })}
    </View>
  );

  const renderCategorySection = (category: OutfitCategory) => {
    const categoryData = categories[category];
    const outfitsInCategory = categorizedOutfits[category];
    
    if (outfitsInCategory.length === 0) return null;

    return (
      <View key={category} style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: categoryData.color }]}>
            <Shirt size={20} color="white" />
          </View>
          <Text style={styles.categoryTitle}>{categoryData.name} Wear</Text>
          <Text style={styles.categoryCount}>{outfitsInCategory.length}</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {outfitsInCategory.map((outfit) => (
            <View key={outfit.id} style={styles.miniOutfitCard}>
              <Image source={{ uri: outfit.image }} style={styles.miniOutfitImage} />
              <TouchableOpacity
                style={styles.miniDeleteButton}
                onPress={() => {
                  setCategorizedOutfits(prev => ({
                    ...prev,
                    [category]: prev[category].filter(o => o.id !== outfit.id)
                  }));
                }}
              >
                <Trash2 size={12} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Shirt size={28} color="#6366f1" />
          </View>
          <Text style={styles.title}>Fashion Assistant</Text>
          <Text style={styles.subtitle}>
            Upload outfits and swipe to categorize them for different occasions
          </Text>
        </View>

        {/* Upload Section */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Add New Outfit</Text>
          
          <View style={styles.uploadButtons}>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImageFromGallery}>
              <ImageIcon size={24} color="#6366f1" />
              <Text style={styles.uploadButtonText}>Gallery</Text>
            </TouchableOpacity>
            
            {Platform.OS !== 'web' && (
              <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                <Camera size={24} color="#6366f1" />
                <Text style={styles.uploadButtonText}>Camera</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.uploadButton} 
              onPress={() => setShowUrlInput(!showUrlInput)}
            >
              <Link size={24} color="#6366f1" />
              <Text style={styles.uploadButtonText}>URL</Text>
            </TouchableOpacity>
          </View>

          {showUrlInput && (
            <View style={styles.urlInputContainer}>
              <Input
                placeholder="Paste image URL here..."
                value={imageUrl}
                onChangeText={setImageUrl}
                style={styles.urlInput}
              />
              <Button onPress={() => addOutfit(imageUrl)} size="small">
                <Plus size={16} color="white" />
              </Button>
            </View>
          )}
        </View>

        {/* Swipe Card Section */}
        {outfits.length > 0 && (
          <View style={styles.swipeSection}>
            <Text style={styles.sectionTitle}>Categorize Your Outfit</Text>
            <Text style={styles.swipeInstructions}>
              Swipe in any direction to categorize this outfit
            </Text>
            
            {renderSwipeIndicators()}
            
            <View style={styles.cardContainer}>
              <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.swipeCard, animatedCardStyle]}>
                  <Card style={styles.outfitCard}>
                    <CardContent>
                      <Image
                        source={{ uri: outfits[0].image }}
                        style={styles.outfitImage}
                        resizeMode="cover"
                      />
                    </CardContent>
                  </Card>
                </Animated.View>
              </GestureDetector>
              
              {/* Background cards for stack effect */}
              {outfits.slice(1, 3).map((outfit, index) => (
                <View
                  key={outfit.id}
                  style={[
                    styles.backgroundCard,
                    {
                      transform: [
                        { scale: 1 - (index + 1) * 0.05 },
                        { translateY: (index + 1) * 8 }
                      ],
                      zIndex: -index - 1,
                    }
                  ]}
                >
                  <Card style={styles.outfitCard}>
                    <CardContent>
                      <Image
                        source={{ uri: outfit.image }}
                        style={styles.outfitImage}
                        resizeMode="cover"
                      />
                    </CardContent>
                  </Card>
                </View>
              ))}
            </View>

            <View style={styles.cardCounter}>
              <Text style={styles.cardCounterText}>
                {outfits.length} outfit{outfits.length !== 1 ? 's' : ''} remaining
              </Text>
            </View>
          </View>
        )}

        {/* Empty State */}
        {outfits.length === 0 && Object.values(categorizedOutfits).every(arr => arr.length === 0) && (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Shirt size={48} color="#94a3b8" />
            </View>
            <Text style={styles.emptyStateTitle}>No Outfits Yet</Text>
            <Text style={styles.emptyStateText}>
              Upload your first outfit using the buttons above to get started with your digital wardrobe
            </Text>
          </View>
        )}

        {/* Categorized Outfits */}
        <View style={styles.categorizedSection}>
          {Object.keys(categories).map(category => 
            renderCategorySection(category as OutfitCategory)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerIcon: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  uploadSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  urlInputContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  urlInput: {
    flex: 1,
  },
  swipeSection: {
    padding: 20,
    paddingTop: 0,
  },
  swipeInstructions: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  swipeIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  swipeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  swipeIndicatorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardContainer: {
    height: CARD_HEIGHT + 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  swipeCard: {
    position: 'absolute',
    zIndex: 10,
  },
  backgroundCard: {
    position: 'absolute',
  },
  outfitCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  outfitImage: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
  },
  cardCounter: {
    alignItems: 'center',
    marginTop: 16,
  },
  cardCounterText: {
    fontSize: 14,
    color: '#64748b',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    backgroundColor: '#f1f5f9',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  categorizedSection: {
    padding: 20,
    paddingTop: 0,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  categoryCount: {
    fontSize: 14,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryScroll: {
    marginLeft: -10,
  },
  miniOutfitCard: {
    position: 'relative',
    marginLeft: 10,
  },
  miniOutfitImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
  },
  miniDeleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 4,
    borderRadius: 12,
  },
});