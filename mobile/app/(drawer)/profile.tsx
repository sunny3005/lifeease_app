import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Avatar, Button, TextInput, Card, Divider } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';
import {
  Mail,
  LogOut,
  Pencil,
  Save,
  Phone,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');
  const [editedAvatar, setEditedAvatar] = useState(user?.avatar || '');
  const [editedGender, setEditedGender] = useState(user?.gender || '');

  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setEditedName(user?.name || '');
    setEditedAvatar(user?.avatar || '');
    setEditedEmail(user?.email || '');
    setIsEditing(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setEditedAvatar(uri);
    }
  };

  const handleSave = async () => {
    if (!editedName.trim() || !editedEmail.trim()) {
      Alert.alert('Error', 'Name and Email cannot be empty');
      return;
    }
    setLoading(true);
    try {
      await updateUser({
  name: editedName.trim(),
  email: editedEmail.trim(),
  avatar: editedAvatar.trim(),
  gender: editedGender?.trim() || '', // 👈 add this
});

      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content style={styles.profileSection}>
            <TouchableOpacity onPress={isEditing ? pickImage : undefined} style={styles.avatarContainer}>
              <Avatar.Image
                size={100}
                source={{ uri: editedAvatar || 'https://i.pravatar.cc/300' }}
                style={styles.avatar}
              />
              {isEditing && (
                <View style={styles.editIcon}>
                  <Pencil size={20} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            {isEditing ? (
              <View style={styles.editForm}>
                <TextInput
                  mode="outlined"
                  label="Full Name"
                  value={editedName}
                  onChangeText={setEditedName}
                  style={styles.input}
                />
                <TextInput
                  mode="outlined"
                  label="Email"
                  value={editedEmail}
                  onChangeText={setEditedEmail}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  mode="outlined"
                  label="Phone (Read-only)"
                  value={user?.phone || ''}
                  style={styles.input}
                  editable={false}
                />
                <View style={styles.buttonRow}>
                  <Button
                    mode="contained"
                    icon={() => <Save size={18} color="#fff" />}
                    onPress={handleSave}
                    loading={loading}
                    disabled={loading}
                    style={styles.saveBtn}
                  >
                    Save
                  </Button>
                  <Button mode="outlined" onPress={handleCancel} style={styles.cancelBtn}>
                    Cancel
                  </Button>
                </View>
              </View>
            ) : (
              <>
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <Text style={styles.userPhone}>📞 {user?.phone}</Text>
                <TouchableOpacity style={styles.editIcon} onPress={() => setIsEditing(true)}>
                  <Pencil size={20} color="#fff" />
                </TouchableOpacity>
              </>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Account Info</Text>
            <View style={styles.infoRow}>
              <Mail color="#2563eb" size={20} />
              <View style={styles.infoText}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{user?.email}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.actionSection}>
          <Button
            mode="outlined"
            icon={() => <LogOut size={18} color="#dc2626" />}
            onPress={logout}
            style={styles.logoutBtn}
            labelStyle={{ color: '#dc2626', fontWeight: '600' }}
          >
            Logout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1e293b' },
  card: { marginBottom: 20, borderRadius: 16, elevation: 4, backgroundColor: '#fff' },
  profileSection: { alignItems: 'center', paddingVertical: 20 },
  avatarContainer: { position: 'relative', alignItems: 'center', marginBottom: 16 },
  avatar: { marginBottom: 12 },
  userName: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 8 },
  userEmail: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginTop: 4 },
  userPhone: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginTop: 2 },
  editForm: { width: '100%', marginTop: 10 },
  input: { marginBottom: 16, backgroundColor: 'white' },
  buttonRow: { flexDirection: 'row', gap: 10 },
  saveBtn: { flex: 1, backgroundColor: '#10b981' },
  cancelBtn: { flex: 1, borderColor: '#e11d48' },
  detailsCard: { marginBottom: 20, borderRadius: 16, elevation: 2, backgroundColor: '#fff' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  infoText: { flex: 1 },
  label: { color: '#64748b', fontSize: 14 },
  value: { color: '#1e293b', fontWeight: '600', fontSize: 16 },
  actionSection: { gap: 12, marginTop: 10 },
  logoutBtn: { borderColor: '#dc2626', borderRadius: 12 },
  editIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#6366f1', padding: 6, borderRadius: 999 },
});