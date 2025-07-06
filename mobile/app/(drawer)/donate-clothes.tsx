import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { Button } from 'react-native-paper';
import { useTheme } from '@/context/ThemeContext';
import { Heart, RotateCcw, Sparkles } from 'lucide-react-native';

const BACKEND_URL = 'http://192.168.1.15:5000/api';

export default function DonateClothes() {
  const { colors } = useTheme();
  const [donated, setDonated] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [restoringItems, setRestoringItems] = useState(new Set());

  const fetchDonatedClothes = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/donate`);
      setDonated(res.data);
      console.log('[DONATE] Fetched donated clothes:', res.data.length);
    } catch (err) {
      console.error('Error fetching donated clothes:', err.message);
      Alert.alert('Error', 'Failed to load donated clothes. Please try again.');
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
  if (restoringItems.has(id)) return;

  Alert.alert(
    'Restore Outfit',
    'Are you sure you want to move this outfit back to your wardrobe?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Restore',
        onPress: async () => {
          setRestoringItems(prev => new Set(prev).add(id));

          try {
            const response = await axios.post(`${BACKEND_URL}/donate/restore`, {
              id,
              image,
              category,
            });

            if (response.status === 200) {
              Alert.alert('✅ Restored', 'Outfit moved back to wardrobe successfully!');
              await fetchDonatedClothes(); // Refresh list after restore
            } else {
              throw new Error('Restore failed');
            }
          } catch (err) {
            console.error('Error restoring outfit:', err.message);
            Alert.alert('❌ Failed', 'Could not restore outfit. Please try again.');
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

  const renderItem = ({ item, index }) => {
    const isRestoring = restoringItems.has(item.id);
    
    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={[styles.category, { color: colors.text }]}>{item.category}</Text>
          <Text style={[styles.donatedText, { color: colors.textSecondary }]}>
            Donated • Making a difference
          </Text>
          <Button
            icon={() => <RotateCcw size={16} color={isRestoring ? colors.textSecondary : colors.primary} />}
            mode="outlined"
            onPress={() => handleRestore(item.id, item.image, item.category)}
            style={[
              styles.restoreButton, 
              { 
                borderColor: isRestoring ? colors.textSecondary : colors.primary,
                opacity: isRestoring ? 0.6 : 1
              }
            ]}
            labelStyle={{ color: isRestoring ? colors.textSecondary : colors.primary }}
            disabled={isRestoring}
            loading={isRestoring}
          >
            {isRestoring ? 'Restoring...' : 'Restore'}
          </Button>
        </View>
      </View>
    );
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Heart size={24} color={colors.primary} />
        <Text style={styles.title}>Donated Clothes</Text>
        <Sparkles size={20} color={colors.secondary} />
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={[styles.statsText, { color: colors.textSecondary }]}>
          💝 You've donated {donated.length} item{donated.length !== 1 ? 's' : ''} • Thank you for giving back!
        </Text>
      </View>
      
      {donated.length === 0 ? (
        <View style={styles.emptyState}>
          <Heart size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Donated Items Yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            When you donate clothes from your wardrobe, they'll appear here.{'\n'}
            Start spreading kindness by donating outfits you no longer wear!
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
          showsVerticalScrollIndicator={false}
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
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  statsContainer: {
    padding: 16,
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  list: { 
    paddingHorizontal: 16,
    paddingTop: 16,
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
    marginBottom: 4,
  },
  donatedText: {
    fontSize: 12,
    marginBottom: 12,
    fontStyle: 'italic',
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
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});