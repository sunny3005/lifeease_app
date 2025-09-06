import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  Alert, Image, KeyboardAvoidingView, Platform, Modal,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  TextInput, Button, RadioButton,
} from 'react-native-paper';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

 const BACKEND_URL = 'http://192.168.1.4:5000';
//const BACKEND_URL = 'http://192.168.7.193:5000/api';
const maleAvatars = [
  'https://21st.dev/kokonutd/avatar-picker/assets/avatars/male_01.png',
  'https://21st.dev/kokonutd/avatar-picker/assets/avatars/male_02.png',
  'https://21st.dev/kokonutd/avatar-picker/assets/avatars/male_03.png',
  'https://21st.dev/kokonutd/avatar-picker/assets/avatars/male_04.png',
];

const femaleAvatars = [
  'https://21st.dev/kokonutd/avatar-picker/assets/avatars/female_01.png',
  'https://21st.dev/kokonutd/avatar-picker/assets/avatars/female_02.png',
  'https://21st.dev/kokonutd/avatar-picker/assets/avatars/female_03.png',
  'https://21st.dev/kokonutd/avatar-picker/assets/avatars/female_04.png',
];

export default function Register() {
  const router = useRouter();
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', gender: '', password: '', confirmPassword: '', avatar: '',
  });
  const [avatarModal, setAvatarModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'We need access to your media to pick an image.');
      }
    })();
  }, []);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!res.canceled) {
      setFormData({ ...formData, avatar: res.assets[0].uri });
    }
  };

  const chooseAvatar = (url: string) => {
    setFormData({ ...formData, avatar: url });
    setAvatarModal(false);
  };

  const validateForm = () => {
    const { name, email, phone, gender, password, confirmPassword, avatar } = formData;
    
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name');
      return false;
    }
    
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!phone.trim()) {
      Alert.alert('Validation Error', 'Please enter your phone number');
      return false;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.trim().replace(/\D/g, ''))) {
      Alert.alert('Validation Error', 'Please enter a valid phone number');
      return false;
    }
    
    if (!gender) {
      Alert.alert('Validation Error', 'Please select your gender');
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
    
    if (!avatar) {
      Alert.alert('Validation Error', 'Please select an avatar');
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    const { name, email, phone, gender, password, avatar } = formData;
    
    setLoading(true);
    try {
      console.log('[REGISTER] Attempting registration with data:', {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        gender,
        avatar
      });

      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim(), 
          phone: phone.trim(), 
          gender, 
          password, 
          avatar 
        }),
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.error || 'Registration failed');
      }

      console.log('[REGISTER] Registration successful:', json);

      // Show success message and redirect to login
      Alert.alert(
        '🎉 Registration Successful!', 
        json.message || 'Your account has been created successfully. Please login to continue.',
        [
          {
            text: 'Login Now',
            onPress: () => router.replace('/(auth)/login')
          }
        ]
      );

    } catch (err: any) {
      console.error('[REGISTER] Error:', err.message);
      Alert.alert('Registration Failed', err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={28} color={colors.text} />
          </TouchableOpacity>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join LifeEase and start your style journey</Text>

          <View style={styles.avatarContainer}>
            {formData.avatar
              ? <Image source={{ uri: formData.avatar }} style={styles.avatarImage} />
              : <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarPlaceholderText}>Choose Avatar</Text>
                </View>}
            <View style={styles.avatarButtons}>
              <Button 
                mode="outlined" 
                onPress={pickImage} 
                textColor={colors.primary}
                style={styles.avatarButton}
                disabled={loading}
              >
                Upload
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => {
                  if (!formData.gender) {
                    Alert.alert('Select Gender First', 'Please select your gender before choosing an avatar');
                    return;
                  }
                  setAvatarModal(true);
                }} 
                textColor={colors.primary}
                style={styles.avatarButton}
                disabled={loading}
              >
                Avatar
              </Button>
            </View>
          </View>

          <TextInput
            label="Full Name" 
            mode="outlined" 
            style={styles.input}
            value={formData.name}
            onChangeText={t => setFormData({ ...formData, name: t })} 
            disabled={loading}
            theme={{ 
              colors: {
                background: colors.surface,
                onSurfaceVariant: colors.textSecondary,
                outline: colors.border,
              }
            }}
          />
          
          <TextInput
            label="Email Address" 
            mode="outlined" 
            style={styles.input}
            value={formData.email}
            onChangeText={t => setFormData({ ...formData, email: t })} 
            disabled={loading}
            keyboardType="email-address"
            autoCapitalize="none"
            theme={{ 
              colors: {
                background: colors.surface,
                onSurfaceVariant: colors.textSecondary,
                outline: colors.border,
              }
            }}
          />
          
          <TextInput
            label="Phone Number" 
            mode="outlined" 
            style={styles.input} 
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={t => setFormData({ ...formData, phone: t })} 
            disabled={loading}
            theme={{ 
              colors: {
                background: colors.surface,
                onSurfaceVariant: colors.textSecondary,
                outline: colors.border,
              }
            }}
          />

          <View style={styles.radioSection}>
            <Text style={[styles.genderLabel, { color: colors.text }]}>Gender:</Text>
            <RadioButton.Group
              onValueChange={g => setFormData({ ...formData, gender: g })}
              value={formData.gender}
            >
              <View style={styles.radioRow}>
                <View style={styles.radioOption}>
                  <RadioButton value="male" disabled={loading} />
                  <Text style={[styles.radioText, { color: colors.text }]}>Male</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="female" disabled={loading} />
                  <Text style={[styles.radioText, { color: colors.text }]}>Female</Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>

          <TextInput
            label="Password" 
            mode="outlined" 
            secureTextEntry
            value={formData.password}
            onChangeText={t => setFormData({ ...formData, password: t })} 
            disabled={loading}
            style={styles.input}
            theme={{ 
              colors: {
                background: colors.surface,
                onSurfaceVariant: colors.textSecondary,
                outline: colors.border,
              }
            }}
          />
          
          <TextInput
            label="Confirm Password" 
            mode="outlined" 
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={t => setFormData({ ...formData, confirmPassword: t })} 
            disabled={loading}
            style={styles.input}
            theme={{ 
              colors: {
                background: colors.surface,
                onSurfaceVariant: colors.textSecondary,
                outline: colors.border,
              }
            }}
          />

          <Button
            mode="contained" 
            onPress={handleRegister} 
            disabled={loading} 
            loading={loading}
            style={styles.submit}
            labelStyle={styles.submitLabel}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.textSecondary }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Avatar Modal */}
      <Modal visible={avatarModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>
          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Choose Your Avatar</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Select an avatar that represents you
            </Text>
            
            <View style={styles.avatarGrid}>
              {(formData.gender === 'female' ? femaleAvatars : maleAvatars).map((url, i) => (
                <TouchableOpacity 
                  key={i} 
                  onPress={() => chooseAvatar(url)}
                  style={styles.avatarOption}
                >
                  <Image source={{ uri: url }} style={styles.avatarOptionImage} />
                </TouchableOpacity>
              ))}
            </View>
            
            <Button 
              onPress={() => setAvatarModal(false)} 
              mode="contained"
              style={styles.closeButton}
            >
              Close
            </Button>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  body: { padding: 20, paddingBottom: 40 },
  backButton: { alignSelf: 'flex-start', padding: 8, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8, color: colors.text },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 32, lineHeight: 24 },
  avatarContainer: { alignItems: 'center', marginBottom: 24 },
  avatarPlaceholder: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  avatarPlaceholderText: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  avatarImage: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatarButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 16,
    gap: 12,
  },
  avatarButton: {
    flex: 1,
  },
  input: { backgroundColor: colors.surface, marginBottom: 16 },
  radioSection: { marginBottom: 20 },
  genderLabel: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  radioRow: { flexDirection: 'row', justifyContent: 'space-around' },
  radioOption: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radioText: { fontSize: 16 },
  submit: { 
    marginTop: 24, 
    backgroundColor: colors.primary, 
    paddingVertical: 8,
    borderRadius: 12,
  },
  submitLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: { fontSize: 16 },
  loginLink: { fontSize: 16, fontWeight: '600' },
  modal: { flex: 1 },
  modalContent: { padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  modalSubtitle: { fontSize: 16, textAlign: 'center', marginBottom: 32 },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 16,
  },
  avatarOption: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  avatarOptionImage: {
    width: 80, height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
  },
});