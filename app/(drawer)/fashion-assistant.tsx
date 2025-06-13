// app/(drawer)/fashion-assistant.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SegmentedButtons, Button, TextInput } from 'react-native-paper';
import { launchCameraAsync, launchImageLibraryAsync, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

type Outfit = {
  id?: string;
  image: string;
  category: string;
};

const categories = ['Casual', 'Formal', 'Sports', 'Others'];
const CARD_WIDTH = Dimensions.get('window').width * 0.8;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

export default function FashionAssistant() {
  const [selectedCategory, setSelectedCategory] = useState('Casual');
  const [categorizedOutfits, setCategorizedOutfits] = useState<{ [key: string]: Outfit[] }>({});
  const [urlInput, setUrlInput] = useState('');

  useEffect(() => {
    fetchAllOutfits();
  }, []);

  const fetchAllOutfits = async () => {
    const results: { [key: string]: Outfit[] } = {};
    for (const cat of categories) {
      const q = query(collection(db, 'outfits'), where('category', '==', cat));
      const snapshot = await getDocs(q);
      results[cat] = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Outfit) }));
    }
    setCategorizedOutfits(results);
  };

 const uploadImage = async (imageUri: string, category: string) => {
  const docRef = await addDoc(collection(db, 'outfits'), {
    image: imageUri,
    category,
  });

  const newOutfit: Outfit = {
    id: docRef.id,
    image: imageUri,
    category,
  };

  setCategorizedOutfits(prev => ({
    ...prev,
    [category]: [newOutfit, ...(prev[category] || [])],
  }));
};


  const handleCamera = async () => {
    const permission = await requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Denied', 'Camera access is needed.');
      return;
    }
    const result = await launchCameraAsync({ allowsEditing: true, quality: 0.7 });
    if (!result.canceled && result.assets[0].uri) {
      await uploadImage(result.assets[0].uri, selectedCategory);
    }
  };

  const handleGallery = async () => {
    const permission = await requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Denied', 'Gallery access is needed.');
      return;
    }
    const result = await launchImageLibraryAsync({ allowsEditing: true, quality: 0.7 });
    if (!result.canceled && result.assets[0].uri) {
      await uploadImage(result.assets[0].uri, selectedCategory);
    }
  };

  const handleUrlSubmit = async () => {
    if (urlInput.trim()) {
      await uploadImage(urlInput.trim(), selectedCategory);
      setUrlInput('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <SegmentedButtons
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          buttons={categories.map(cat => ({ label: cat, value: cat }))}
        />
      </View>

      {/* Upload Buttons */}
      <View style={styles.uploadButtons}>
        <Button mode="contained" icon="camera" onPress={handleCamera} style={styles.button}>
          Camera
        </Button>
        <Button mode="contained" icon="image" onPress={handleGallery} style={styles.button}>
          Gallery
        </Button>
      </View>

      {/* URL Input */}
      <View style={styles.urlInput}>
        <TextInput
          mode="outlined"
          placeholder="Paste Image URL"
          value={urlInput}
          onChangeText={setUrlInput}
          style={{ flex: 1 }}
        />
        <Button mode="contained" onPress={handleUrlSubmit} style={{ marginLeft: 10 }}>
          Add
        </Button>
      </View>

      {/* Cards */}
      <View style={styles.cards}>
        {categorizedOutfits[selectedCategory]?.length ? (
          categorizedOutfits[selectedCategory].map(item => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No outfits in this category yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 16 },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  urlInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  cards: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 20,
    marginTop: 20,
    paddingBottom: 60,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  empty: {
    marginTop: 40,
    fontSize: 16,
    color: '#94a3b8',
  },
});
