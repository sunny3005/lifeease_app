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
import { ArrowLeft, User, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;
    
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name');
      return false;
    }
    
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!password) {
      Alert.alert('Validation Error', 'Please enter a password');
      return false;
    }
    
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const success = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
      });
      
      if (success) {
        Alert.alert(
          '🎉 Registration Successful!',
          'Welcome to LifeEase! Your account has been created.',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/(tabs)')
            }
          ]
        );
      } else {
        Alert.alert('Registration Failed', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      Alert.alert('Registration Failed', 'Something went wrong. Please try again.');
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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#1e293b" />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join LifeEase and start your journey</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200)} style={styles.form}>
            <View style={styles.inputContainer}>
              <User size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                mode="outlined"
                label="Full Name"
                value={formData.name}
                onChangeText={text => setFormData({ ...formData, name: text })}
                style={styles.input}
                theme={{
                  colors: {
                    primary: '#6366f1',
                    outline: '#e2e8f0',
                  }
                }}
                disabled={loading}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                mode="outlined"
                label="Email Address"
                value={formData.email}
                onChangeText={text => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                theme={{
                  colors: {
                    primary: '#6366f1',
                    outline: '#e2e8f0',
                  }
                }}
                disabled={loading}
                placeholder="Enter your email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Phone size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                mode="outlined"
                label="Phone Number (Optional)"
                value={formData.phone}
                onChangeText={text => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
                style={styles.input}
                theme={{
                  colors: {
                    primary: '#6366f1',
                    outline: '#e2e8f0',
                  }
                }}
                disabled={loading}
                placeholder="Enter your phone number"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                mode="outlined"
                label="Password"
                value={formData.password}
                onChangeText={text => setFormData({ ...formData, password: text })}
                secureTextEntry={!showPassword}
                style={styles.input}
                theme={{
                  colors: {
                    primary: '#6366f1',
                    outline: '#e2e8f0',
                  }
                }}
                disabled={loading}
                placeholder="Create a password"
                right={
                  <TextInput.Icon 
                    icon={() => showPassword ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                mode="outlined"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={text => setFormData({ ...formData, confirmPassword: text })}
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
                theme={{
                  colors: {
                    primary: '#6366f1',
                    outline: '#e2e8f0',
                  }
                }}
                disabled={loading}
                placeholder="Confirm your password"
                right={
                  <TextInput.Icon 
                    icon={() => showConfirmPassword ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
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
          </Animated.View>
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
    paddingLeft: 16,
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
    color: 'white',
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
    fontWeight: '600',
    color: '#6366f1',
  },
});