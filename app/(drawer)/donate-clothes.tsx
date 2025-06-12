import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Heart } from 'lucide-react-native';

export default function DonateClothes() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Heart size={64} color="#6366f1" style={styles.icon} />
        <Text style={styles.title}>Donate Clothes</Text>
        <Text style={styles.subtitle}>Give back to your community</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});