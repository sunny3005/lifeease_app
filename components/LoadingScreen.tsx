import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const appName = 'LifeEase';
  
  // Animation values for each letter
  const letterAnimations = appName.split('').map(() => ({
    opacity: useSharedValue(0),
    translateY: useSharedValue(50),
    scale: useSharedValue(0.5),
  }));

  const logoScale = useSharedValue(0);
  const logoRotation = useSharedValue(0);

  useEffect(() => {
    // Animate logo first
    logoScale.value = withTiming(1, { 
      duration: 800, 
      easing: Easing.out(Easing.back(1.5)) 
    });
    
    logoRotation.value = withTiming(360, { 
      duration: 1000, 
      easing: Easing.out(Easing.ease) 
    });

    // Animate letters one by one
    const animateLetters = () => {
      letterAnimations.forEach((animation, index) => {
        const delay = index * 150; // 150ms delay between each letter
        
        animation.opacity.value = withDelay(delay + 500, withTiming(1, { duration: 300 }));
        animation.translateY.value = withDelay(delay + 500, withTiming(0, { 
          duration: 500, 
          easing: Easing.out(Easing.back(1.2)) 
        }));
        animation.scale.value = withDelay(delay + 500, withSequence(
          withTiming(1.2, { duration: 200 }),
          withTiming(1, { duration: 200 })
        ));
      });
    };

    animateLetters();

    // Complete animation after all letters are shown
    const totalDuration = 500 + (appName.length * 150) + 1000;
    const timer = setTimeout(() => {
      onComplete();
    }, totalDuration);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: logoScale.value },
        { rotate: `${logoRotation.value}deg` }
      ],
    };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Animated Logo */}
          <Animated.View style={[styles.logoContainer, logoStyle]}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>✨</Text>
            </View>
          </Animated.View>

          {/* Animated App Name */}
          <View style={styles.nameContainer}>
            {appName.split('').map((letter, index) => {
              const letterStyle = useAnimatedStyle(() => {
                return {
                  opacity: letterAnimations[index].opacity.value,
                  transform: [
                    { translateY: letterAnimations[index].translateY.value },
                    { scale: letterAnimations[index].scale.value }
                  ],
                };
              });

              return (
                <Animated.Text key={index} style={[styles.letter, letterStyle]}>
                  {letter}
                </Animated.Text>
              );
            })}
          </View>

          <Text style={styles.tagline}>Your Personal Life Assistant</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
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
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 40,
  },
  nameContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  letter: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 2,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
});