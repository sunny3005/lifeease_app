import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.2, { duration: 600 }),
      withSpring(1, { duration: 400 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <Animated.View entering={FadeInDown.delay(200)} style={styles.content}>
          <Animated.View style={[styles.iconContainer, animatedStyle]}>
            <CheckCircle size={80} color="white" />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400)} style={styles.textContainer}>
            <Text style={styles.title}>Order Placed Successfully! 🎉</Text>
            <Text style={styles.subtitle}>
              Thank you for your order. A delivery executive will contact you via WhatsApp shortly.
            </Text>
            <Text style={styles.orderInfo}>
              Order ID: ORD{Date.now().toString().slice(-6)}
            </Text>
            <Text style={styles.deliveryTime}>
              ⏱️ Estimated delivery: 10-15 minutes
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(600)} style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/(drawer)')}
            >
              <Home size={20} color="#667eea" />
              <Text style={styles.primaryButtonText}>Go to Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/grocery-delivery')}
            >
              <ShoppingBag size={20} color="white" />
              <Text style={styles.secondaryButtonText}>Shop More</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(800)} style={styles.infoCard}>
            <Text style={styles.infoTitle}>What happens next?</Text>
            <View style={styles.stepsList}>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.stepText}>Order confirmed and being prepared</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepText}>Delivery executive assigned</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.stepText}>You'll receive a WhatsApp message</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>4</Text>
                <Text style={styles.stepText}>Fresh groceries delivered to your door</Text>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 30,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  orderInfo: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
  },
  deliveryTime: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  actionButtons: {
    width: '100%',
    gap: 12,
    marginBottom: 30,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    gap: 8,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  stepsList: {
    gap: 12,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    color: '#667eea',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});