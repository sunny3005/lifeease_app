import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { Button } from 'react-native-paper';
import { useTheme } from '@/context/ThemeContext';
import { Heart, RotateCcw } from 'lucide-react-native';

const BACKEND_URL = 'http://192.168.1.7:5000/api';

export default function DonateClothes() {
  const { colors } = useTheme();
  const [donated, setDonated] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDonatedClothes = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/donate`);
      setDonated(res.data);
    } catch (err) {
      console.error('Error fetching donated clothes:', err.message);
    }
  };

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchDonatedClothes();
    }, [])
  );

  useEffect(() => {
    fetchDonatedClothes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDonatedClothes();
    setRefreshing(false);
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
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={[styles.category, { color: colors.text }]}>{item.category}</Text>
        <Button
          icon={() => <RotateCcw size={16} color={colors.primary} />}
          mode="outlined"
          onPress={() => handleRestore(item.id, item.image, item.category)}
          style={[styles.restoreButton, { borderColor: colors.primary }]}
          labelStyle={{ color: colors.primary }}
        >
          Restore
        </Button>
      </View>
    </View>
  );

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Heart size={24} color={colors.primary} />
        <Text style={styles.title}>Donated Clothes</Text>
      </View>
      
      {donated.length === 0 ? (
        <View style={styles.emptyState}>
          <Heart size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Donated Items</Text>
          <Text style={styles.emptySubtitle}>
            Items you donate from your wardrobe will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={donated}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  list: { 
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  restoreButton: {
    borderRadius: 8,
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
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});