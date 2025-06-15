import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <Animated.View 
          entering={FadeInUp.delay(200)}
          style={styles.logoContainer}
        >
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>LifeEase</Text>
          <Text style={styles.tagline}>Your Personal Life Assistant</Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400)}
          style={styles.contentContainer}
        >
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>👗</Text>
              <Text style={styles.featureText}>Fashion Assistant</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💊</Text>
              <Text style={styles.featureText}>Medicine Reminders</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💧</Text>
              <Text style={styles.featureText}>Water Tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🤖</Text>
              <Text style={styles.featureText}>AI Suggestions</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => router.push('/(auth)/register')}
              style={styles.primaryButton}
              labelStyle={styles.primaryButtonText}
            >
              Get Started
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => router.push('/(auth)/login')}
              style={styles.secondaryButton}
              labelStyle={styles.secondaryButtonText}
            >
              I Already Have an Account
            </Button>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  featureList: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 8,
  },
  primaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});