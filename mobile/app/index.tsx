import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { LoadingAnimation } from '@/components/ui/LoadingAnimation';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    console.log("isLoading:", isLoading);
    console.log("isAuthenticated:", isAuthenticated);

    if (!isLoading && !showAnimation) {
      if (isAuthenticated) {
        console.log("Redirecting to drawer");
        router.replace('/(drawer)');
      } else {
        console.log("Redirecting to welcome");
        router.replace('/(auth)/welcome');
      }
    }
  }, [isAuthenticated, isLoading, showAnimation]);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  // Show loading animation first
  if (showAnimation) {
    return <LoadingAnimation onComplete={handleAnimationComplete} />;
  }

  // Show loading screen while checking auth status
  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Loading...</Text>
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
  loadingText: {
    fontSize: 18,
    color: '#64748b',
  },
});