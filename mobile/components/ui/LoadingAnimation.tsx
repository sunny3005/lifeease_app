import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  Easing 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface LoadingAnimationProps {
  onComplete?: () => void;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const appName = 'LifeEase';
  
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    // Start the animation
    opacity.value = withTiming(1, { duration: 500 });
    scale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.back(1.5)) });
    
    // Animate logo
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));

    // Typewriter effect for app name
    const interval = setInterval(() => {
      if (currentIndex < appName.length) {
        setDisplayedText(appName.substring(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      } else {
        clearInterval(interval);
        // Complete animation after a delay
        setTimeout(() => {
          onComplete?.();
        }, 1000);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, containerStyle]}>
          <Animated.View style={[styles.logoContainer, logoStyle]}>
            <View style={styles.logo}>
              <Text style={styles.logoIcon}>✨</Text>
            </View>
          </Animated.View>
          
          <View style={styles.textContainer}>
            <Text style={styles.appName}>
              {displayedText}
              <Text style={styles.cursor}>|</Text>
            </Text>
            <Text style={styles.tagline}>Your Personal Life Assistant</Text>
          </View>

          <View style={styles.loadingDots}>
            <Animated.View style={[styles.dot, { opacity: logoOpacity }]} />
            <Animated.View style={[styles.dot, { opacity: logoOpacity }]} />
            <Animated.View style={[styles.dot, { opacity: logoOpacity }]} />
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoIcon: {
    fontSize: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cursor: {
    opacity: 0.7,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});