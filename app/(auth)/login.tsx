import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { TextInput, Button } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        id: '1',
        name: 'Alex Johnson',
        email: formData.email.trim().toLowerCase(),
        avatar: `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face`,
        membershipType: 'Premium' as const,
        joinedDate: '2024-01-15T00:00:00.000Z',
      };

      await login(userData);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please check your credentials.');
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#1e293b" />
            </TouchableOpacity>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue to LifeEase</Text>
          </View>

          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <View style={styles.illustration}>
              <Text style={styles.illustrationEmoji}>👋</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                label="Email Address"
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                theme={{ roundness: 12 }}
                disabled={loading}
                left={<TextInput.Icon icon={() => <Mail size={20} color="#64748b" />} />}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                label="Password"
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                secureTextEntry={!showPassword}
                style={styles.input}
                theme={{ roundness: 12 }}
                disabled={loading}
                left={<TextInput.Icon icon={() => <Lock size={20} color="#64748b" />} />}
                right={
                  <TextInput.Icon 
                    icon={() => showPassword ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

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
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  illustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  illustrationEmoji: {
    fontSize: 48,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: 'white',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -10,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 8,
    marginTop: 10,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
    color: '#64748b',
  },
  registerLink: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
});