import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Sparkles, ArrowRight, Heart, Droplets, Pill, Shirt } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.delay(200)}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Sparkles size={32} color="white" />
            </View>
            <Text style={styles.appName}>LifeEase</Text>
          </View>
          <Text style={styles.tagline}>Your Personal Life Assistant</Text>
        </Animated.View>

        {/* Hero Image */}
        <Animated.View 
          entering={FadeInDown.delay(400)}
          style={styles.heroContainer}
        >
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'
            }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />
        </Animated.View>

        {/* Features */}
        <Animated.View 
          entering={FadeInDown.delay(600)}
          style={styles.featuresContainer}
        >
          <Text style={styles.featuresTitle}>Everything you need in one app</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Shirt size={20} color="#667eea" />
              </View>
              <Text style={styles.featureText}>AI Fashion Assistant</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Pill size={20} color="#667eea" />
              </View>
              <Text style={styles.featureText}>Medicine Reminders</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Droplets size={20} color="#667eea" />
              </View>
              <Text style={styles.featureText}>Hydration Tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Heart size={20} color="#667eea" />
              </View>
              <Text style={styles.featureText}>Wellness Insights</Text>
            </View>
          </View>
        </Animated.View>

        {/* Buttons */}
        <Animated.View 
          entering={FadeInDown.delay(800)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <ArrowRight size={20} color="#667eea" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.9}
          >
            <Text style={styles.secondaryButtonText}>I Already Have an Account</Text>
          </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    paddingTop: 60,
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  heroContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  heroImage: {
    width: width * 0.7,
    height: width * 0.9,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 24,
  },
  featuresContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    backdropFilter: 'blur(10px)',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
    flex: 1,
  },
  buttonContainer: {
    paddingBottom: 40,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  secondaryButton: {
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});