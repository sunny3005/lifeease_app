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
import { Avatar, Button, TextInput, Card } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useNotifications } from '@/context/NotificationContext';
import {
  Mail,
  LogOut,
  Pencil,
  Save,
  Phone,
  Moon,
  Sun,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { user, updateUser, logout, darkMode, toggleDarkMode } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');
  const [editedAvatar, setEditedAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const { isNotificationEnabled, sendTestNotification, expoPushToken } = useNotifications();

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
      });

      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/welcome');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const styles = createStyles(colors);

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
                  theme={{ 
                    colors: {
                      background: colors.surface,
                      onSurfaceVariant: colors.textSecondary,
                      outline: colors.border,
                    }
                  }}
                />
                <TextInput
                  mode="outlined"
                  label="Email"
                  value={editedEmail}
                  onChangeText={setEditedEmail}
                  style={styles.input}
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
                  mode="outlined"
                  label="Phone (Read-only)"
                  value={user?.phone || ''}
                  style={styles.input}
                  editable={false}
                  theme={{ 
                    colors: {
                      background: colors.secondary,
                      onSurfaceVariant: colors.textSecondary,
                      outline: colors.border,
                    }
                  }}
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
                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
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
              <Mail color={colors.primary} size={20} />
              <View style={styles.infoText}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{user?.email}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Phone color={colors.primary} size={20} />
              <View style={styles.infoText}>
                <Text style={styles.label}>Phone</Text>
                <Text style={styles.value}>{user?.phone}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <TouchableOpacity style={styles.preferenceRow} onPress={toggleDarkMode}>
              {darkMode ? <Moon color={colors.primary} size={20} /> : <Sun color={colors.primary} size={20} />}
              <View style={styles.infoText}>
                <Text style={styles.label}>Theme</Text>
                <Text style={styles.value}>{darkMode ? 'Dark Mode' : 'Light Mode'}</Text>
              </View>
              <View style={[styles.toggle, darkMode && styles.toggleActive]}>
                <View style={[styles.toggleThumb, darkMode && styles.toggleThumbActive]}>
                  {darkMode ? <Moon size={12} color="white" /> : <Sun size={12} color="#64748b" />}
                </View>
              </View>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <View style={styles.actionSection}>
          <Button
            mode="outlined"
            icon={() => <LogOut size={18} color={colors.error} />}
            onPress={handleLogout}
            style={[styles.logoutBtn, { borderColor: colors.error }]}
            labelStyle={{ color: colors.error, fontWeight: '600' }}
          >
            Logout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.text },
  card: { marginBottom: 20, borderRadius: 16, elevation: 4, backgroundColor: colors.card },
  profileSection: { alignItems: 'center', paddingVertical: 20 },
  avatarContainer: { position: 'relative', alignItems: 'center', marginBottom: 16 },
  avatar: { marginBottom: 12 },
  userName: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 8, color: colors.text },
  userEmail: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
  userPhone: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginTop: 2 },
  editForm: { width: '100%', marginTop: 10 },
  input: { marginBottom: 16, backgroundColor: colors.surface },
  buttonRow: { flexDirection: 'row', gap: 10 },
  saveBtn: { flex: 1, backgroundColor: colors.success },
  cancelBtn: { flex: 1, borderColor: colors.error },
  editButton: { position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.primary, padding: 6, borderRadius: 999 },
  detailsCard: { marginBottom: 20, borderRadius: 16, elevation: 2, backgroundColor: colors.card },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  preferenceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoText: { flex: 1 },
  label: { color: colors.textSecondary, fontSize: 14 },
  value: { color: colors.text, fontWeight: '600', fontSize: 16 },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
    backgroundColor: 'white',
  },
  actionSection: { gap: 12, marginTop: 10 },
  logoutBtn: { borderRadius: 12 },
  editIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.primary, padding: 6, borderRadius: 999 },
});