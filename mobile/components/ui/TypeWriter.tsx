import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

type Props = {
  text: string[];
  speed?: number;
  deleteSpeed?: number;
  waitTime?: number;
  textStyle?: any;
  cursorChar?: string;
};

export const Typewriter: React.FC<Props> = ({
  text,
  speed = 80,
  deleteSpeed = 40,
  waitTime = 1500,
  textStyle,
  cursorChar = '|',
}) => {
  const [currentText, setCurrentText] = useState('');
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = text[index % text.length];

      if (isDeleting) {
        setCurrentText(fullText.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      } else {
        setCurrentText(fullText.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }

      if (!isDeleting && charIndex === fullText.length) {
        setTimeout(() => setIsDeleting(true), waitTime);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setIndex(prev => (prev + 1) % text.length);
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? deleteSpeed : speed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting]);

  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={textStyle}>{currentText}</Text>
      <Text style={[textStyle, styles.cursor]}>{cursorChar}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cursor: {
    opacity: 1,
  },
});
