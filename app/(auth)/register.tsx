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
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { TextInput, Button } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, User, Mail, Lock, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(false);

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData(prev => ({ ...prev, avatar: result.assets[0].uri }));
    }
  };

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        avatar: formData.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face`,
        membershipType: 'Free' as const,
        joinedDate: new Date().toISOString(),
      };

      await login(userData);
      router.replace('/(tabs)');
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

          {/* Avatar Selection */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={handleImagePicker} style={styles.avatarButton}>
              {formData.avatar ? (
                <Image source={{ uri: formData.avatar }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Camera size={32} color="#64748b" />
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.avatarText}>Tap to add profile photo</Text>
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
                left={<TextInput.Icon icon={() => <User size={20} color="#64748b" />} />}
              />
            </View>

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
                secureTextEntry
                style={styles.input}
                theme={{ roundness: 12 }}
                disabled={loading}
                left={<TextInput.Icon icon={() => <Lock size={20} color="#64748b" />} />}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                secureTextEntry
                style={styles.input}
                theme={{ roundness: 12 }}
                disabled={loading}
                left={<TextInput.Icon icon={() => <Lock size={20} color="#64748b" />} />}
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarButton: {
    marginBottom: 12,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#6366f1',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  avatarText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
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
  },
  registerButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 8,
    marginTop: 10,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
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