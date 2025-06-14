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
import {
  IconButton,
  SegmentedButtons,
  Button,
  TextInput,
} from 'react-native-paper';
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import { HeaderAnimatedText } from '@/components/ui/HeaderAnimatedText';

const categories = ['Casual', 'Formal', 'Sports', 'Party', 'Others'];
const CARD_WIDTH = Dimensions.get('window').width * 0.45;
const CARD_HEIGHT = CARD_WIDTH * 1.3;
const BACKEND_URL = 'http://192.168.1.7:5000/api';

const headerMessages = [
  '👗 Fashion is your instant language',
  '✨ Discover your perfect look today',
  '🛍️ Elevate your style with AI picks',
  '🎉 Get ready to turn heads with every outfit',
];

const BOT_ICON_URI =
  'https://images.openai.com/thumbnails/url/Vdc6AXicu1mSUVJSUGylr5-al1xUWVCSmqJbkpRnoJdeXJJYkpmsl5yfq5-Zm5ieWmxfaAuUsXL0S7F0Tw42dS-JiEz0SDEJDveMdPF2Ms7I9Ux1LPH1DkqLLHUyDgl0zE91KgyqLMypygrPDw7yNbQoKTB2cswzDlQrBgALcSmH';

export default function FashionAssistant() {
  const [selectedCategory, setSelectedCategory] = useState('Casual');
  const [categorizedOutfits, setCategorizedOutfits] = useState({});
  const [urlInput, setUrlInput] = useState('');
  const [chatVisible, setChatVisible] = useState(false);
  const [headerTextIndex, setHeaderTextIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

const [customCategory, setCustomCategory] = useState('');
const [addingNew, setAddingNew] = useState(false);
const [customCategoryInputVisible, setCustomCategoryInputVisible] = useState(false);
const [showMainMenu, setShowMainMenu] = useState(false);


  useEffect(() => {
    fetchAllOutfits();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeaderTextIndex((prev) => (prev + 1) % headerMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllOutfits = async () => {
    const results = {};
    for (const cat of categories) {
      try {
        const res = await fetch(`${BACKEND_URL}/outfits/${cat}`);
        const data = await res.json();
        results[cat] = data;
      } catch (err) {
        console.error(`Failed to fetch ${cat} outfits`, err);
      }
    }
    setCategorizedOutfits(results);
  };

  const uploadImage = async (imageUri, category) => {
    try {
      const res = await fetch(`${BACKEND_URL}/outfits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageUri, category }),
      });
      const data = await res.json();
      setCategorizedOutfits((prev) => ({
        ...prev,
        [category]: [data, ...(prev[category] || [])],
      }));
    } catch (err) {
      Alert.alert('Upload failed');
    }
  };

  const handleCamera = async () => {
    const permission = await requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert('Permission needed');
    const result = await launchCameraAsync({ allowsEditing: true, quality: 0.7 });
    if (!result.canceled && result.assets[0].uri)
      await uploadImage(result.assets[0].uri, selectedCategory);
  };

  const handleGallery = async () => {
    const permission = await requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert('Permission needed');
    const result = await launchImageLibraryAsync({ allowsEditing: true, quality: 0.7 });
    if (!result.canceled && result.assets[0].uri)
      await uploadImage(result.assets[0].uri, selectedCategory);
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;
    try {
      const res = await fetch(`${BACKEND_URL}/extract-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productUrl: urlInput.trim() }),
      });
      const data = await res.json();
      if (!data.image) throw new Error('No image found');
      await uploadImage(data.image, selectedCategory);
      setUrlInput('');
    } catch (err) {
      Alert.alert('Invalid URL');
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
      setShowMainMenu(false); // Reset menu
    });
  }
};

  const slideUp = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const handleAddCustomCategory = async () => {
    const trimmed = customCategoryName.trim();
    if (!trimmed || categories.includes(trimmed)) return;

    try {
      await fetch(`${BACKEND_URL}/add-category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: trimmed }),
      });

      setCategorizedOutfits((prev) => ({ ...prev, [trimmed]: [] }));
      categories.push(trimmed); // Not best practice, better to manage via state
      setSelectedCategory(trimmed);
      setCustomCategoryInputVisible(false);
      setCustomCategoryName('');
    } catch (err) {
      Alert.alert('Error', 'Failed to add new category.');
    }
  };

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: '#f0f4f8' }}>
        {/* Header */}
        <View style={styles.header}>
         <View style={styles.headerInner}>
  <HeaderAnimatedText />
  <IconButton
    icon="refresh"
    size={22}
    onPress={fetchAllOutfits}
    style={styles.refreshButton}
    iconColor="#0f172a"
  />
</View>

        </View>

        {/* Tabs */}
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={{ marginTop: 14 }}
  contentContainerStyle={{ gap: 10, paddingHorizontal: 6 }}
>
  {[...categories, ...Object.keys(categorizedOutfits).filter(cat => !categories.includes(cat))].map(cat => (
    <Button
      key={cat}
      mode={selectedCategory === cat ? 'contained' : 'outlined'}
      onPress={() => setSelectedCategory(cat)}
      style={{
        borderRadius: 20,
        backgroundColor: selectedCategory === cat ? '#e0761f' : '#fff',
        borderColor: '#202020',
      }}
      labelStyle={{ fontWeight: 'bold', color: selectedCategory === cat ? 'white' : '#202020' }}
    >
      {cat}
    </Button>
  ))}

  {/* + Add New Category */}
{!addingNew ? (
  <Button
    icon="plus"
    mode="outlined"
    onPress={() => setAddingNew(true)}
    style={{ borderRadius: 20, borderColor: '#202020' }}
    labelStyle={{ color: '#e0761f' }}
  />
) : (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
    <TextInput
      mode="outlined"
      placeholder="New Category"
      value={customCategory}
      onChangeText={setCustomCategory}
      style={{ width: 120, backgroundColor: '#fff', height: 44 }}
      theme={{ roundness: 10 }}
    />
    <Button
      mode="outlined"
      onPress={() => {
        if (customCategory.trim()) {
          setSelectedCategory(customCategory.trim());
          setCategorizedOutfits(prev => ({
            ...prev,
            [customCategory.trim()]: [],
          }));
          setAddingNew(false);
          setCustomCategory('');
        }
      }}
      style={{ height: 44, borderRadius: 10, backgroundColor: '#e0761f' }}
      labelStyle={{ color: '#fff' }}
    >
      Add
    </Button>
    <IconButton
      icon="minus"
      onPress={() => {
        setAddingNew(false);
        setCustomCategory('');
      }}
      style={{ backgroundColor: '#f8fafc', borderRadius: 50 }}
      iconColor="#ef4444"
    />
  </View>
)}



</ScrollView>


        {customCategoryInputVisible && (
          <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginTop: 8, alignItems: 'center', gap: 10 }}>
            <TextInput
              mode="outlined"
              placeholder="New Category"
              value={customCategoryName}
              onChangeText={setCustomCategoryName}
              style={{ flex: 1 }}
            />
            <Button mode="contained" onPress={handleAddCustomCategory}>
              Add
            </Button>
          </View>
        )}


        {/* Upload Buttons */}
        <View style={styles.uploadButtonRow}>
          <Button mode="contained" icon="camera" onPress={handleCamera} style={styles.cameraButton} labelStyle={styles.buttonLabel1}>Camera</Button>
          <Button mode="contained" icon="image" onPress={handleGallery} style={styles.galleryButton} labelStyle={styles.buttonLabel2}>Gallery</Button>
        </View>

        {/* URL Input */}
        <View style={styles.urlInputRow}>
          <TextInput
            mode="outlined"
            placeholder="Paste Image URL"
            value={urlInput}
            onChangeText={setUrlInput}
            style={styles.urlInput}
            theme={{ roundness: 10 }}
          />
          <Button mode="contained" onPress={handleUrlSubmit} style={styles.urlAddButton} labelStyle={{ color: '#fff', fontWeight: 'bold' }}>Add</Button>
        </View>

        {/* Outfit Cards */}
        <View style={{ padding: 16 }}>
          {categorizedOutfits[selectedCategory]?.length ? (
            <View style={styles.outfitContainer}>
              {categorizedOutfits[selectedCategory].map((item, index) => (
                <View key={index} style={styles.card}>
                  <Image source={{ uri: item.image }} style={styles.cardImage} />
                  <Button mode="outlined" onPress={() => Alert.alert('Donate', 'Thank you for your support!')} style={{ margin: 10 }}>💖 Donate</Button>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noOutfits}>No outfits in this category yet.</Text>
          )}
        </View>
      </ScrollView>

      {/* Floating Bot Icon */}
      <TouchableOpacity onPress={toggleChat} style={styles.botIcon}>
  {chatVisible ? (
    <View style={{ backgroundColor: '#f87171', padding: 10, borderRadius: 30 }}>
      <Text style={{ fontSize: 22, color: '#fff' }}>✖</Text>
    </View>
  ) : (
    <Image source={{ uri: BOT_ICON_URI }} style={styles.botImage} />
  )}
</TouchableOpacity>


      {/* Sliding Chat Window */}
      {chatVisible && (
        <Animated.View style={[styles.chatBoxRight, { transform: [{ translateX: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] }) }] }]}>
  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>🤖 Hi! I'm Buddy</Text>

  {!showMainMenu ? (
    <Button
      mode="contained"
      onPress={() => setShowMainMenu(true)}
      style={{ marginBottom: 12, backgroundColor: '#0284c7', borderRadius: 12 }}
      labelStyle={{ color: 'white', fontWeight: 'bold' }}
    >
      Main Menu
    </Button>
  ) : (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 10, paddingBottom: 30 }}
    >
      {[...categories, ...Object.keys(categorizedOutfits).filter(cat => !categories.includes(cat))].map(cat => (
        <Button
          key={cat}
          mode={selectedCategory === cat ? 'contained' : 'outlined'}
          onPress={() => {
            setSelectedCategory(cat);
            toggleChat();
            setShowMainMenu(false);
          }}
          style={{
            borderRadius: 12,
            backgroundColor: selectedCategory === cat ? '#e0761f' : '#fff',
            borderColor: '#202020',
            borderWidth: 1,
          }}
          labelStyle={{ fontWeight: 'bold', color: selectedCategory === cat ? 'white' : '#202020' }}
        >
          {cat}
        </Button>
      ))}
    </ScrollView>
  )}
</Animated.View>



      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#f0fdfa',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 1,
    borderColor: '#cbd5e1',
    elevation: 3,
  },
 headerInner: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between', // keeps space between text and refresh
  paddingVertical: 16,
  paddingHorizontal: 20,
  borderRadius: 18,
  backgroundColor: 'white', // remove green background
  borderWidth: 1,
  borderColor: '#e2e8f0',
  elevation: 3,
},
 headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065f46',
    flex: 1,
  },
  refreshButton: {
  backgroundColor: '#e5e7eb', // soft gray
  borderRadius: 20,
},
  uploadButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 10,
  },
  cameraButton: {
    flex: 1,
    backgroundColor: '#c25d0a',
    borderRadius: 12,
  },
  galleryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  buttonLabel1: {
    color: '#fff',
    fontWeight: 'bold',
  },
   buttonLabel2: {
    color: '#c25d0a',
    fontWeight: 'bold',
  },
  urlInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  urlInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
  },
  urlAddButton: {
    backgroundColor: '#e0761f',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  outfitContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  noOutfits: {
    textAlign: 'center',
    color: '#64748b',
    fontStyle: 'italic',
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
    width: 90,
    height: 90,
    borderRadius: 30,
  },
chatBoxRight: {
  position: 'absolute',
  top: 100, 
  bottom: 100,
  right: 0,
  width: '80%',
  backgroundColor: '#f8fafc',
  padding: 20,
  borderTopLeftRadius: 16,
  borderBottomLeftRadius: 16,
  elevation: 8,
  zIndex: 99,
},

});
