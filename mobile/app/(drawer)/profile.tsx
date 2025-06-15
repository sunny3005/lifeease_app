import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Avatar, Button, TextInput, Card, Divider } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Calendar, Crown, Edit3, Save, X } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!editedName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await updateUser({ name: editedName.trim() });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedName(user?.name || '');
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
            await logout();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={styles.editButton}
          >
            {isEditing ? (
              <X size={24} color="#ef4444" />
            ) : (
              <Edit3 size={24} color="#6366f1" />
            )}
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <View style={styles.avatarSection}>
              <Avatar.Image
                size={100}
                source={{ uri: user?.avatar || 'https://i.pravatar.cc/300?img=3' }}
                style={styles.avatar}
              />
              <View style={styles.membershipBadge}>
                <Crown size={16} color="#f59e0b" />
                <Text style={styles.membershipText}>{user?.membershipType}</Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              {isEditing ? (
                <View style={styles.editContainer}>
                  <TextInput
                    mode="outlined"
                    label="Full Name"
                    value={editedName}
                    onChangeText={setEditedName}
                    style={styles.editInput}
                    theme={{ roundness: 12 }}
                  />
                  <View style={styles.editButtons}>
                    <Button
                      mode="contained"
                      onPress={handleSave}
                      loading={loading}
                      disabled={loading}
                      style={styles.saveButton}
                      icon={() => <Save size={16} color="white" />}
                    >
                      Save
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={handleCancel}
                      disabled={loading}
                      style={styles.cancelButton}
                    >
                      Cancel
                    </Button>
                  </View>
                </View>
              ) : (
                <Text style={styles.userName}>{user?.name}</Text>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Details Card */}
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Account Details</Text>
            
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Mail size={20} color="#6366f1" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{user?.email}</Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Calendar size={20} color="#6366f1" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Member Since</Text>
                <Text style={styles.detailValue}>
                  {user?.joinedDate ? formatDate(user.joinedDate) : 'N/A'}
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Crown size={20} color="#f59e0b" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Membership</Text>
                <Text style={styles.detailValue}>{user?.membershipType} Plan</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          {user?.membershipType === 'Free' && (
            <Button
              mode="contained"
              style={styles.upgradeButton}
              labelStyle={styles.upgradeButtonText}
            >
              Upgrade to Premium
            </Button>
          )}

          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            labelStyle={styles.logoutButtonText}
          >
            Logout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  editButton: {
    padding: 8,
  },
  profileCard: {
    marginBottom: 20,
    elevation: 4,
  },
  profileContent: {
    alignItems: 'center',
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginBottom: 12,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  membershipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  infoSection: {
    width: '100%',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  editContainer: {
    width: '100%',
    gap: 16,
  },
  editInput: {
    backgroundColor: 'white',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#10b981',
  },
  cancelButton: {
    flex: 1,
    borderColor: '#ef4444',
  },
  detailsCard: {
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  divider: {
    marginVertical: 8,
  },
  actions: {
    gap: 12,
  },
  upgradeButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    paddingVertical: 8,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    borderColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 8,
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
});