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
import { useAuth } from '@/context/AuthContext';

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
  const { login } = useAuth();
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
    if (!name || !email || !phone || !gender || !password || !avatar) {
      return Alert.alert('Error', 'All fields including avatar are required');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, gender, password, avatar }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Registration failed');

      await login(json.user);
      router.replace('/(drawer)');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.flex}>
        <ScrollView contentContainerStyle={s.body}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={28} color="#1e293b" />
          </TouchableOpacity>

          <Text style={s.title}>Create Account</Text>
          <Text style={s.subtitle}>Join LifeEase today</Text>

          <View style={s.avatarContainer}>
            {formData.avatar
              ? <Image source={{ uri: formData.avatar }} style={s.avatarImage} />
              : <View style={s.avatarPlaceholder} />}
            <View style={s.avatarButtons}>
              <Button mode="outlined" onPress={pickImage}>Upload</Button>
              <Button mode="outlined" onPress={() => {
                if (!formData.gender) return Alert.alert('Select gender first');
                setAvatarModal(true);
              }}>Avatar</Button>
            </View>
          </View>

          <TextInput
            label="Name" mode="outlined" style={s.input}
            onChangeText={t => setFormData({ ...formData, name: t })} disabled={loading}
          />
          <TextInput
            label="Email" mode="outlined" style={s.input}
            onChangeText={t => setFormData({ ...formData, email: t })} disabled={loading}
          />
          <TextInput
            label="Phone" mode="outlined" style={s.input} keyboardType="phone-pad"
            onChangeText={t => setFormData({ ...formData, phone: t })} disabled={loading}
          />

          <View style={s.radioRow}>
            <RadioButton.Group
              onValueChange={g => setFormData({ ...formData, gender: g })}
              value={formData.gender}
            >
              <View style={s.radioOption}><RadioButton value="male" /><Text>Male</Text></View>
              <View style={s.radioOption}><RadioButton value="female" /><Text>Female</Text></View>
            </RadioButton.Group>
          </View>

          <TextInput
            label="Password" mode="outlined" secureTextEntry
            onChangeText={t => setFormData({ ...formData, password: t })} disabled={loading}
            style={s.input}
          />
          <TextInput
            label="Confirm Pass" mode="outlined" secureTextEntry
            onChangeText={t => setFormData({ ...formData, confirmPassword: t })} disabled={loading}
            style={s.input}
          />

          <Button
            mode="contained" onPress={handleRegister} disabled={loading} loading={loading}
            style={s.submit}
          >
            Sign Up
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Avatar Modal */}
      <Modal visible={avatarModal} animationType="slide">
        <SafeAreaView style={s.modal}>
          <ScrollView contentContainerStyle={s.grid}>
            {(formData.gender === 'female' ? femaleAvatars : maleAvatars).map((url, i) => (
              <TouchableOpacity key={i} onPress={() => chooseAvatar(url)}>
                <Image source={{ uri: url }} style={s.avOption} />
              </TouchableOpacity>
            ))}
            <Button onPress={() => setAvatarModal(false)}>Close</Button>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  flex: { flex: 1 },
  body: { padding: 20 },
  title: { fontSize: 28, fontWeight: '700', marginTop: 16, color: '#1e293b' },
  subtitle: { fontSize: 16, color: '#64748b', marginBottom: 24 },
  avatarContainer: { alignItems: 'center', marginBottom: 16 },
  avatarPlaceholder: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#e2e8f0',
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
  input: { backgroundColor: '#fff', marginBottom: 12 },
  radioRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  radioOption: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  submit: { marginTop: 20, backgroundColor: '#6366f1', paddingVertical: 8 },
  modal: { flex: 1, padding: 20, justifyContent: 'center' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    rowGap: 20,
  },
  avOption: {
    width: 80, height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#facc15',
    margin: 10,
  },
});
