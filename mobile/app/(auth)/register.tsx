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
} from 'react-native';
import { useRouter } from 'expo-router';
import { TextInput, Button, Avatar } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, User, Mail, Lock } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        avatar: `https://i.pravatar.cc/300?u=${formData.email}`,
        membershipType: 'Free' as const,
        joinedDate: new Date().toISOString(),
      };

      await login(userData);
      router.replace('/(drawer)');
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join LifeEase and start organizing your life</Text>
          </View>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Avatar.Icon 
              size={80} 
              icon="account" 
              style={styles.avatar}
            />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <User size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                mode="outlined"
                label="Full Name"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                style={styles.input}
                theme={{ roundness: 12 }}
                disabled={loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#64748b" style={styles.inputIcon} />
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
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                mode="outlined"
                label="Password"
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                secureTextEntry
                style={styles.input}
                theme={{ roundness: 12 }}
                disabled={loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                mode="outlined"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                secureTextEntry
                style={styles.input}
                theme={{ roundness: 12 }}
                disabled={loading}
              />
            </View>

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.registerButton}
              labelStyle={styles.registerButtonText}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.loginLink}>Sign In</Text>
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
    marginBottom: 30,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    backgroundColor: '#e2e8f0',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 28,
    zIndex: 1,
  },
  input: {
    backgroundColor: 'white',
    paddingLeft: 40,
  },
  registerButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 8,
    marginTop: 10,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#64748b',
  },
  loginLink: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
});