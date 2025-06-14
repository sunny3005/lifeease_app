import React, { useState, useEffect } from 'react';
import { Text, Animated, Easing, View, StyleSheet } from 'react-native';

const messages = [
  '👗 Fashion is your instant language',
  '✨ Discover your perfect look today',
  '🛍️ Elevate your style with AI picks',
  '🎉 Get ready to turn heads with every outfit',
];

export const HeaderAnimatedText = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    let charIndex = 0;
    const fullText = messages[textIndex];
    setDisplayedText('');

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + fullText[charIndex]);
      charIndex++;
      if (charIndex === fullText.length) clearInterval(interval);
    }, 40);

    // Fade animation
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      setTextIndex((prev) => (prev + 1) % messages.length);
    }, fullText.length * 40 + 2000); // show full message + delay

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [textIndex]);

  return (
    <Animated.Text style={[styles.animatedText, { opacity: fadeAnim }]}>
      {displayedText}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  animatedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
  },
});
