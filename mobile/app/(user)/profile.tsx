import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Avatar,
  Card,
  Title,
  Paragraph,
  Divider,
  Switch,
  List,
  IconButton,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Edit3,
  Save,
  X,
  Camera,
  Image as ImageIcon,
  Phone,
  Mail,
  UserCheck,
  Moon,
  Sun,
  LogOut,
  ArrowLeft,
} from 'lucide-react-native';

const BACKEND_URL = 'http://192.168.1.15:5000/api';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  gender?: string;
  membershipType?: string;
  joinedDate?: string;
}

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    gender: '',
  });

  const styles = createStyles(colors);

  useEffect(() => {
    fetchUserProfile();
    requestImagePermissions();
  }, []);

  const requestImagePermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to change your profile picture.'
        );
      }
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/(auth)/login');
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        const userData = response.data.user;
        setProfile(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          avatar: userData.avatar || '',
          gender: userData.gender || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem('token');
        router.replace('/(auth)/login');
      } else {
        showSnackbar('Failed to load profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      Alert.alert('Validation Error', 'Name and email are required');
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/(auth)/login');
        return;
      }

      const response = await axios.put(
        `${BACKEND_URL}/auth/profile`,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          avatar: formData.avatar,
          gender: formData.gender,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setProfile(response.data.user);
        setIsEditing(false);
        showSnackbar('Profile updated successfully!');
        
        // Update user in AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const message = error.response?.data?.error || 'Failed to update profile';
      Alert.alert('Update Failed', message);
    } finally {
      setSaving(false);
    }
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: openCamera },
        { text: 'Photo Library', onPress: openImageLibrary },
      ]
    );
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({ ...prev, avatar: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const openImageLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({ ...prev, avatar: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to open image library');
    }
  };

  const handleLogout = () => {
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
            }
          },
        },
      ]
    );
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const cancelEdit = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        avatar: profile.avatar || '',
        gender: profile.gender || '',
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Paragraph style={[styles.loadingText, { color: colors.text }]}>
          Loading profile...
        </Paragraph>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Paragraph style={{ color: colors.error }}>
          Failed to load profile data
        </Paragraph>
        <Button mode="contained" onPress={fetchUserProfile} style={styles.retryButton}>
          Retry
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Title style={[styles.headerTitle, { color: colors.text }]}>Profile</Title>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
            {isDark ? <Sun size={24} color={colors.primary} /> : <Moon size={24} color={colors.primary} />}
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <Card style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <Card.Content style={styles.profileContent}>
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <TouchableOpacity
                onPress={isEditing ? handleImagePicker : undefined}
                style={styles.avatarContainer}
                disabled={!isEditing}
              >
                <Avatar.Image
                  size={120}
                  source={{
                    uri: formData.avatar || 
                         'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
                  }}
                  style={styles.avatar}
                />
                {isEditing && (
                  <View style={[styles.avatarOverlay, { backgroundColor: colors.primary }]}>
                    <Camera size={24} color="white" />
                  </View>
                )}
              </TouchableOpacity>
              
              <Title style={[styles.profileName, { color: colors.text }]}>
                {profile.name}
              </Title>
              <Paragraph style={[styles.membershipType, { color: colors.textSecondary }]}>
                {profile.membershipType || 'Free'} Member
              </Paragraph>
            </View>

            <Divider style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Form Fields */}
            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <User size={20} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                  label="Full Name"
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  mode="outlined"
                  style={styles.input}
                  editable={isEditing}
                  theme={{
                    colors: {
                      primary: colors.primary,
                      background: colors.surface,
                      surface: colors.surface,
                      onSurface: colors.text,
                      onSurfaceVariant: colors.textSecondary,
                      outline: colors.border,
                    }
                  }}
                />
              </View>

              <View style={styles.inputGroup}>
                <Mail size={20} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                  label="Email Address"
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  mode="outlined"
                  style={styles.input}
                  editable={isEditing}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  theme={{
                    colors: {
                      primary: colors.primary,
                      background: colors.surface,
                      surface: colors.surface,
                      onSurface: colors.text,
                      onSurfaceVariant: colors.textSecondary,
                      outline: colors.border,
                    }
                  }}
                />
              </View>

              <View style={styles.inputGroup}>
                <Phone size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  label="Phone Number"
                  value={profile.phone}
                  mode="outlined"
                  style={[styles.input, styles.readonlyInput]}
                  editable={false}
                  theme={{
                    colors: {
                      primary: colors.textSecondary,
                      background: colors.secondary,
                      surface: colors.secondary,
                      onSurface: colors.textSecondary,
                      onSurfaceVariant: colors.textSecondary,
                      outline: colors.border,
                    }
                  }}
                />
                <Paragraph style={[styles.helperText, { color: colors.textSecondary }]}>
                  Phone number cannot be changed
                </Paragraph>
              </View>

              <View style={styles.inputGroup}>
                <UserCheck size={20} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                  label="Gender"
                  value={formData.gender}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, gender: text }))}
                  mode="outlined"
                  style={styles.input}
                  editable={isEditing}
                  theme={{
                    colors: {
                      primary: colors.primary,
                      background: colors.surface,
                      surface: colors.surface,
                      onSurface: colors.text,
                      onSurfaceVariant: colors.textSecondary,
                      outline: colors.border,
                    }
                  }}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {!isEditing ? (
                <Button
                  mode="contained"
                  onPress={() => setIsEditing(true)}
                  style={[styles.editButton, { backgroundColor: colors.primary }]}
                  icon={() => <Edit3 size={20} color="white" />}
                  labelStyle={styles.buttonLabel}
                >
                  Edit Profile
                </Button>
              ) : (
                <View style={styles.editActions}>
                  <Button
                    mode="outlined"
                    onPress={cancelEdit}
                    style={[styles.cancelButton, { borderColor: colors.border }]}
                    icon={() => <X size={20} color={colors.textSecondary} />}
                    labelStyle={[styles.buttonLabel, { color: colors.textSecondary }]}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={updateProfile}
                    style={[styles.saveButton, { backgroundColor: colors.success }]}
                    icon={() => <Save size={20} color="white" />}
                    labelStyle={styles.buttonLabel}
                    loading={saving}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Settings Card */}
        <Card style={[styles.settingsCard, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: colors.text }]}>Settings</Title>
            
            <List.Item
              title="Dark Mode"
              description={`Currently using ${isDark ? 'dark' : 'light'} theme`}
              left={() => isDark ? <Moon size={24} color={colors.primary} /> : <Sun size={24} color={colors.primary} />}
              right={() => (
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  color={colors.primary}
                />
              )}
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.textSecondary }}
            />

            <Divider style={[styles.listDivider, { backgroundColor: colors.border }]} />

            <List.Item
              title="Logout"
              description="Sign out of your account"
              left={() => <LogOut size={24} color={colors.error} />}
              onPress={handleLogout}
              titleStyle={{ color: colors.error }}
              descriptionStyle={{ color: colors.textSecondary }}
            />
          </Card.Content>
        </Card>

        {/* Account Info Card */}
        <Card style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: colors.text }]}>Account Information</Title>
            
            <View style={styles.infoRow}>
              <Paragraph style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Member Since
              </Paragraph>
              <Paragraph style={[styles.infoValue, { color: colors.text }]}>
                {profile.joinedDate ? new Date(profile.joinedDate).toLocaleDateString() : 'N/A'}
              </Paragraph>
            </View>

            <View style={styles.infoRow}>
              <Paragraph style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Account Type
              </Paragraph>
              <Paragraph style={[styles.infoValue, { color: colors.text }]}>
                {profile.membershipType || 'Free'}
              </Paragraph>
            </View>

            <View style={styles.infoRow}>
              <Paragraph style={[styles.infoLabel, { color: colors.textSecondary }]}>
                User ID
              </Paragraph>
              <Paragraph style={[styles.infoValue, { color: colors.text, fontFamily: 'monospace' }]}>
                {profile.id}
              </Paragraph>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: colors.success }}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  themeButton: {
    padding: 8,
  },
  profileCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 16,
  },
  profileContent: {
    padding: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    borderWidth: 4,
    borderColor: colors.primary,
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.card,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  membershipType: {
    fontSize: 16,
    textAlign: 'center',
  },
  divider: {
    marginVertical: 24,
    height: 1,
  },
  formSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 28,
    zIndex: 1,
  },
  input: {
    backgroundColor: colors.surface,
    paddingLeft: 40,
  },
  readonlyInput: {
    backgroundColor: colors.secondary,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
  actionButtons: {
    marginTop: 8,
  },
  editButton: {
    borderRadius: 12,
    paddingVertical: 4,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 4,
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 4,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingsCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 16,
  },
  infoCard: {
    elevation: 2,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listDivider: {
    height: 1,
    marginVertical: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  retryButton: {
    marginTop: 16,
  },
});