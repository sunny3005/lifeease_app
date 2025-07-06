import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, Alert,
  KeyboardAvoidingView, Platform, TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { TextInput, Button, Avatar } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; 
import { ArrowLeft, Lock, Phone, Eye, EyeOff } from 'lucide-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://192.168.1.15:5000';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { colors } = useTheme();
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const { phone, password } = formData;
    
    if (!phone.trim()) {
      Alert.alert('Validation Error', 'Please enter your phone number');
      return false;
    }
    
    if (!password.trim()) {
      Alert.alert('Validation Error', 'Please enter your password');
      return false;
    }
    
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const { phone, password } = formData;

    setLoading(true);
    try {
      console.log('[LOGIN] Attempting login with phone:', phone.trim());
      
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        phone: phone.trim(),
        password: password.trim(),
      });

      const { token, user, success } = res.data;
      
      if (!success || !token || !user) {
        throw new Error('Invalid response from server');
      }

      console.log('[LOGIN] Login successful, received user:', user);

      // Save token separately
      await AsyncStorage.setItem('token', token);

      // Use login from context
      await login({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar || '',
        gender: user.gender || '',
        membershipType: user.membershipType || 'Free',
        joinedDate: user.joinedDate || new Date().toISOString(),
      });

      // Show success message
      Alert.alert(
        '🎉 Welcome Back!',
        `Hello ${user.name}, you're successfully logged in.`,
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(drawer)')
          }
        ]
      );

    } catch (error) {
      console.error('[LOGIN] API Error:', error?.response?.data || error.message);
      const message = error?.response?.data?.error || 'Login failed. Please check your credentials and try again.';
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your style journey</Text>
          </View>

          <View style={styles.avatarContainer}>
            <Avatar.Icon 
              size={80} 
              icon="account" 
              style={[styles.avatar, { backgroundColor: colors.primary }]} 
            />
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Phone size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                mode="outlined"
                label="Phone Number"
                value={formData.phone}
                onChangeText={text => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
                autoCapitalize="none"
                style={styles.input}
                theme={{ 
                  roundness: 12,
                  colors: {
                    background: colors.surface,
                    onSurfaceVariant: colors.textSecondary,
                    outline: colors.border,
                  }
                }}
                disabled={loading}
                placeholder="Enter your phone number"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                mode="outlined"
                label="Password"
                value={formData.password}
                onChangeText={text => setFormData({ ...formData, password: text })}
                secureTextEntry={!showPassword}
                style={styles.input}
                theme={{ 
                  roundness: 12,
                  colors: {
                    background: colors.surface,
                    onSurfaceVariant: colors.textSecondary,
                    outline: colors.border,
                  }
                }}
                disabled={loading}
                placeholder="Enter your password"
                right={
                  <TextInput.Icon 
                    icon={() => showPassword ? <EyeOff size={20} color={colors.textSecondary} /> : <Eye size={20} color={colors.textSecondary} />}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            </View>

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
              labelStyle={styles.loginButtonText}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: colors.textSecondary }]}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={[styles.registerLink, { color: colors.primary }]}>Create Account</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 20 },
  header: { marginBottom: 40 },
  backButton: { alignSelf: 'flex-start', padding: 8, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary, lineHeight: 24 },
  avatarContainer: { alignItems: 'center', marginBottom: 40 },
  avatar: { backgroundColor: colors.secondary },
  form: { gap: 20 },
  inputContainer: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 16, top: 28, zIndex: 1 },
  input: { backgroundColor: colors.surface, paddingLeft: 16 },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 8,
    marginTop: 10
  },
  loginButtonText: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  registerText: { fontSize: 16 },
  registerLink: { fontSize: 16, fontWeight: '600' },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
});