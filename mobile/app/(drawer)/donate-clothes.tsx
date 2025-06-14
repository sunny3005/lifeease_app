import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, Alert } from 'react-native';
import axios from 'axios';
import { Button } from '@/components/ui/Button'; // Ensure this is working correctly or replace with TouchableOpacity

const BACKEND_URL = 'http://192.168.1.7:5000/api';

export default function DonateClothes() {
  const [donated, setDonated] = useState([]);

  useEffect(() => {
    fetchDonatedClothes();
  }, []);

  const fetchDonatedClothes = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/donate`);
      setDonated(res.data);
    } catch (err) {
      console.error('Error fetching donated clothes:', err.message);
    }
  };

  const handleRestore = async (id: number, image: string, category: string) => {
    try {
      await axios.post(`${BACKEND_URL}/donate/restore`, {
        id,
        image,
        category,
      });
      Alert.alert('✅ Restored', 'Outfit moved back to wardrobe');
      fetchDonatedClothes();
    } catch (err) {
      console.error('Error restoring outfit:', err.message);
      Alert.alert('❌ Failed', 'Could not restore outfit');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.category}>{item.category}</Text>
      <Button
        icon="undo"
        onPress={() => handleRestore(item.id, item.image, item.category)}
        style={styles.restoreButton}
      >
        Restore
      </Button>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Donated Clothes</Text>
      <FlatList
        data={donated}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    color: '#1e293b',
    textAlign: 'center',
  },
  list: { paddingHorizontal: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  category: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  restoreButton: {
    marginTop: 10,
  },
});
