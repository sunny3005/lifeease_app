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


const BACKEND_URL = 'http://192.168.1.7:5000';

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

  const handleRegister = async () => {
    const { name, email, phone, gender, password, confirmPassword, avatar } = formData;
    
    if (!name.trim() || !email.trim() || !phone.trim() || !gender || !password || !avatar) {
      return Alert.alert('Error', 'All fields including avatar are required');
    }
    
    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match');
    }

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
        'Registration Successful!', 
        'Your account has been created. Please login to continue.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login')
          }
        ]
      );

    } catch (err: any) {
      console.error('[REGISTER] Error:', err.message);
      Alert.alert('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.body}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={28} color={colors.text} />
          </TouchableOpacity>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join LifeEase today</Text>

          <View style={styles.avatarContainer}>
            {formData.avatar
              ? <Image source={{ uri: formData.avatar }} style={styles.avatarImage} />
              : <View style={styles.avatarPlaceholder} />}
            <View style={styles.avatarButtons}>
              <Button mode="outlined" onPress={pickImage} textColor={colors.primary}>Upload</Button>
              <Button mode="outlined" onPress={() => {
                if (!formData.gender) return Alert.alert('Select gender first');
                setAvatarModal(true);
              }} textColor={colors.primary}>Avatar</Button>
            </View>
          </View>

          <TextInput
            label="Name" mode="outlined" style={styles.input}
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
            label="Email" mode="outlined" style={styles.input}
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
            label="Phone" mode="outlined" style={styles.input} keyboardType="phone-pad"
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

          <View style={styles.radioRow}>
            <Text style={styles.genderLabel}>Gender:</Text>
            <RadioButton.Group
              onValueChange={g => setFormData({ ...formData, gender: g })}
              value={formData.gender}
            >
              <View style={styles.radioOption}>
                <RadioButton value="male" />
                <Text style={styles.radioText}>Male</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="female" />
                <Text style={styles.radioText}>Female</Text>
              </View>
            </RadioButton.Group>
          </View>

          <TextInput
            label="Password" mode="outlined" secureTextEntry
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
            label="Confirm Password" mode="outlined" secureTextEntry
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
            mode="contained" onPress={handleRegister} disabled={loading} loading={loading}
            style={styles.submit}
          >
            Sign Up
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Avatar Modal */}
      <Modal visible={avatarModal} animationType="slide">
        <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>
          <ScrollView contentContainerStyle={styles.grid}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Choose Avatar</Text>
            <View style={styles.avatarGrid}>
              {(formData.gender === 'female' ? femaleAvatars : maleAvatars).map((url, i) => (
                <TouchableOpacity key={i} onPress={() => chooseAvatar(url)}>
                  <Image source={{ uri: url }} style={styles.avOption} />
                </TouchableOpacity>
              ))}
            </View>
            <Button onPress={() => setAvatarModal(false)} mode="contained">Close</Button>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  body: { padding: 20 },
  title: { fontSize: 28, fontWeight: '700', marginTop: 16, color: colors.text },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 24 },
  avatarContainer: { alignItems: 'center', marginBottom: 16 },
  avatarPlaceholder: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.secondary,
  },
  avatarImage: {
    width: 100, height: 100, borderRadius: 50,
  },
  avatarButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%',
    marginTop: 12,
  },
  input: { backgroundColor: colors.surface, marginBottom: 12 },
  radioRow: { marginBottom: 16 },
  genderLabel: { fontSize: 16, color: colors.text, marginBottom: 8 },
  radioOption: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  radioText: { color: colors.text },
  submit: { marginTop: 20, backgroundColor: colors.primary, paddingVertical: 8 },
  modal: { flex: 1, padding: 20, justifyContent: 'center' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  grid: { alignItems: 'center' },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avOption: {
    width: 80, height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#facc15',
    margin: 10,
  },
});