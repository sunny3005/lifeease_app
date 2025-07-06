import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/welcome');
      }
    }
  }, [isAuthenticated, isLoading]);

  // Show loading screen while checking auth status
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn} style={styles.content}>
        <Sparkles size={48} color="#6366f1" />
        <Text style={styles.loadingText}>LifeEase</Text>
        <Text style={styles.subText}>Loading...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subText: {
    fontSize: 16,
    color: '#64748b',
  },
});