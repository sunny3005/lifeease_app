import React from 'react';
import { TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
}

export function Input({
  placeholder,
  value,
  onChangeText,
  style,
  textStyle,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  keyboardType = 'default'
}: InputProps) {
  return (
    <TextInput
      style={[styles.input, style, textStyle]}
      placeholder={placeholder}
      placeholderTextColor="#94a3b8"
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      numberOfLines={numberOfLines}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#1e293b',
  },
});