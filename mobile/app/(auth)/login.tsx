import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, Alert,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { TextInput, Button, Avatar } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Lock } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://192.168.1.7:5000'; // Make sure your backend runs here

export default function Login() {
  const router = useRouter();
const { login } = useAuth(); 
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  const { phone, password } = formData;

  if (!phone.trim() || !password.trim()) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  setLoading(true);
  try {
    const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      phone,
      password,
    });

    const { token, user } = res.data;

    // Save token separately if needed
    await AsyncStorage.setItem('token', token);

    // Use login from context (it sets the user)
  await login({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  avatar: user.avatar || '',
  membershipType: user.membershipType || 'Free',
  joinedDate: user.joinedDate || new Date().toISOString(),
});


    router.replace('/(drawer)');

  } catch (error) {
    console.error('[LOGIN] API Error:', error?.response?.data || error.message);
    const message = error?.response?.data?.error || 'Login failed.';
    Alert.alert('Error', message);
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#1e293b" />
            </TouchableOpacity>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue to LifeEase</Text>
          </View>

          <View style={styles.avatarContainer}>
            <Avatar.Icon size={80} icon="account" style={styles.avatar} />
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                label="Phone Number"
                value={formData.phone}
                onChangeText={text => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
                autoCapitalize="none"
                style={styles.input}
                theme={{ roundness: 12 }}
                disabled={loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                mode="outlined"
                label="Password"
                value={formData.password}
                onChangeText={text => setFormData({ ...formData, password: text })}
                secureTextEntry
                style={styles.input}
                theme={{ roundness: 12 }}
                disabled={loading}
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
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.registerLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 20 },
  header: { marginBottom: 30 },
  backButton: { alignSelf: 'flex-start', padding: 8, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64748b', lineHeight: 24 },
  avatarContainer: { alignItems: 'center', marginBottom: 30 },
  avatar: { backgroundColor: '#e2e8f0' },
  form: { gap: 20 },
  inputContainer: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 16, top: 28, zIndex: 1 },
  input: { backgroundColor: 'white', paddingLeft: 16 },
  loginButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 8,
    marginTop: 10
  },
  loginButtonText: { fontSize: 16, fontWeight: 'bold' },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  registerText: { fontSize: 16, color: '#64748b' },
  registerLink: { fontSize: 16, color: '#6366f1', fontWeight: '600' }
});
