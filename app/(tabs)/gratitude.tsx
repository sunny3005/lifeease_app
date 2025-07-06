import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import {
  Heart,
  Plus,
  Calendar,
  Edit3,
  Trash2,
  Smile,
  Sun,
  Star,
  Sparkles,
  TrendingUp,
} from 'lucide-react-native';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { TextInput, Button } from 'react-native-paper';

interface GratitudeNote {
  id: number;
  content: string;
  mood: 'happy' | 'peaceful' | 'grateful' | 'blessed';
  date: string;
  time: string;
}

const moods = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#f59e0b' },
  { id: 'peaceful', emoji: '😌', label: 'Peaceful', color: '#10b981' },
  { id: 'grateful', emoji: '🙏', label: 'Grateful', color: '#6366f1' },
  { id: 'blessed', emoji: '✨', label: 'Blessed', color: '#ec4899' },
];

export default function GratitudeTab() {
  const [notes, setNotes] = useState<GratitudeNote[]>([
    {
      id: 1,
      content: 'Grateful for my family\'s health and happiness. Today was filled with laughter and joy.',
      mood: 'grateful',
      date: '2024-01-15',
      time: '20:30',
    },
    {
      id: 2,
      content: 'Beautiful sunrise this morning reminded me of life\'s simple pleasures.',
      mood: 'peaceful',
      date: '2024-01-14',
      time: '08:15',
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNote, setNewNote] = useState({
    content: '',
    mood: 'grateful' as const,
  });
  const [streak, setStreak] = useState(7);

  // Animation values
  const heartPulse = useSharedValue(1);
  const sparkleRotation = useSharedValue(0);

  useEffect(() => {
    // Heart pulse animation
    heartPulse.value = withRepeat(
      withTiming(1.1, { duration: 1000 }),
      -1,
      true
    );

    // Sparkle rotation
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 4000 }),
      -1,
      false
    );

    // Check for daily prompts
    checkDailyPrompts();
  }, []);

  const heartStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heartPulse.value }],
    };
  });

  const sparkleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${sparkleRotation.value}deg` }],
    };
  });

  const checkDailyPrompts = () => {
    const now = new Date();
    const hour = now.getHours();
    
    // Morning prompt (8 AM)
    if (hour === 8) {
      Alert.alert(
        '🌅 Good Morning!',
        'Start your day with gratitude. What are you thankful for today?',
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Write Note', onPress: () => setShowAddModal(true) }
        ]
      );
    }
    
    // Evening prompt (8 PM)
    if (hour === 20) {
      Alert.alert(
        '🌙 Evening Reflection',
        'Take a moment to reflect on today. What brought you joy?',
        [
          { text: 'Skip', style: 'cancel' },
          { text: 'Reflect', onPress: () => setShowAddModal(true) }
        ]
      );
    }
  };

  const addNote = async () => {
    if (!newNote.content.trim()) {
      Alert.alert('Error', 'Please write your gratitude note');
      return;
    }

    const note: GratitudeNote = {
      id: Date.now(),
      content: newNote.content.trim(),
      mood: newNote.mood,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
    };

    try {
      // Mock API call
      await fetch('/api/gratitude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });

      setNotes([note, ...notes]);
      setNewNote({ content: '', mood: 'grateful' });
      setShowAddModal(false);
      Alert.alert('✨ Beautiful!', 'Your gratitude note has been saved.');
    } catch (error) {
      console.error('Error adding note:', error);
      Alert.alert('Error', 'Failed to save note');
    }
  };

  const deleteNote = async (id: number) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this gratitude note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Mock API call
              await fetch(`/api/gratitude/${id}`, { method: 'DELETE' });
              setNotes(notes.filter(note => note.id !== id));
            } catch (error) {
              console.error('Error deleting note:', error);
            }
          }
        }
      ]
    );
  };

  const getMoodEmoji = (mood: string) => {
    return moods.find(m => m.id === mood)?.emoji || '🙏';
  };

  const getMoodColor = (mood: string) => {
    return moods.find(m => m.id === mood)?.color || '#6366f1';
  };

  const thisMonthNotes = notes.filter(note => {
    const noteDate = new Date(note.date);
    const now = new Date();
    return noteDate.getMonth() === now.getMonth() && noteDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Gratitude Journal</Text>
            <Text style={styles.headerSubtitle}>Cultivate daily thankfulness</Text>
          </View>
          <Animated.View style={[styles.heartIcon, heartStyle]}>
            <Heart size={28} color="#ec4899" fill="#ec4899" />
          </Animated.View>
        </Animated.View>

        {/* Stats Card */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Animated.View style={sparkleStyle}>
              <Sparkles size={24} color="#f59e0b" />
            </Animated.View>
            <Text style={styles.statsTitle}>Your Journey</Text>
          </View>
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
              <Text style={styles.statEmoji}>🔥</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{thisMonthNotes}</Text>
              <Text style={styles.statLabel}>This Month</Text>
              <Text style={styles.statEmoji}>📝</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{notes.length}</Text>
              <Text style={styles.statLabel}>Total Notes</Text>
              <Text style={styles.statEmoji}>💫</Text>
            </View>
          </View>
          <Text style={styles.encouragementText}>
            ✨ Keep up the beautiful practice of gratitude!
          </Text>
        </Animated.View>

        {/* Add Note Button */}
        <Animated.View entering={FadeInUp.delay(300)}>
          <TouchableOpacity 
            style={styles.addNoteButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={24} color="white" />
            <Text style={styles.addNoteText}>Write Gratitude Note</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Notes Timeline */}
        <Animated.View entering={FadeInUp.delay(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Gratitude Timeline</Text>
            <TrendingUp size={20} color="#10b981" />
          </View>

          {notes.length > 0 ? (
            <View style={styles.notesList}>
              {notes.map((note, index) => (
                <Animated.View key={note.id} entering={FadeInUp.delay(500 + index * 100)}>
                  <View style={styles.noteCard}>
                    <View style={styles.noteHeader}>
                      <View style={styles.noteDate}>
                        <Text style={styles.noteDateText}>
                          {new Date(note.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </Text>
                        <Text style={styles.noteTimeText}>{note.time}</Text>
                      </View>
                      <View style={styles.noteMood}>
                        <Text style={styles.moodEmoji}>{getMoodEmoji(note.mood)}</Text>
                        <View style={[styles.moodDot, { backgroundColor: getMoodColor(note.mood) }]} />
                      </View>
                    </View>
                    <Text style={styles.noteContent}>{note.content}</Text>
                    <View style={styles.noteActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => deleteNote(note.id)}
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Heart size={48} color="#94a3b8" />
              <Text style={styles.emptyStateTitle}>Start Your Gratitude Journey</Text>
              <Text style={styles.emptyStateText}>
                Write your first gratitude note and begin cultivating daily thankfulness
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Inspiration Card */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.inspirationCard}>
          <View style={styles.inspirationHeader}>
            <Star size={20} color="#f59e0b" />
            <Text style={styles.inspirationTitle}>Daily Inspiration</Text>
          </View>
          <Text style={styles.inspirationQuote}>
            "Gratitude turns what we have into enough, and more. It turns denial into acceptance, 
            chaos into order, confusion into clarity."
          </Text>
          <Text style={styles.inspirationAuthor}>— Melody Beattie</Text>
        </Animated.View>
      </ScrollView>

      {/* Add Note Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Gratitude Note</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Mood Selection */}
            <View style={styles.moodSection}>
              <Text style={styles.inputLabel}>How are you feeling?</Text>
              <View style={styles.moodButtons}>
                {moods.map(mood => (
                  <TouchableOpacity
                    key={mood.id}
                    style={[
                      styles.moodButton,
                      { backgroundColor: mood.color + '20' },
                      newNote.mood === mood.id && { backgroundColor: mood.color }
                    ]}
                    onPress={() => setNewNote({ ...newNote, mood: mood.id as any })}
                  >
                    <Text style={styles.moodButtonEmoji}>{mood.emoji}</Text>
                    <Text style={[
                      styles.moodButtonText,
                      { color: newNote.mood === mood.id ? 'white' : mood.color }
                    ]}>
                      {mood.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Note Content */}
            <TextInput
              mode="outlined"
              label="What are you grateful for today?"
              value={newNote.content}
              onChangeText={text => setNewNote({ ...newNote, content: text })}
              style={styles.noteInput}
              theme={{
                colors: {
                  primary: '#ec4899',
                  outline: '#e2e8f0',
                }
              }}
              placeholder="Write about something that brought you joy, peace, or gratitude today..."
              multiline
              numberOfLines={6}
            />

            <Button
              mode="contained"
              onPress={addNote}
              style={styles.saveButton}
              labelStyle={styles.saveButtonText}
              disabled={!newNote.content.trim()}
            >
              Save Gratitude Note
            </Button>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  heartIcon: {
    padding: 8,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ec4899',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 4,
  },
  statEmoji: {
    fontSize: 16,
  },
  encouragementText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  addNoteButton: {
    backgroundColor: '#ec4899',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 12,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  addNoteText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  notesList: {
    marginBottom: 32,
  },
  noteCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteDate: {
    flex: 1,
  },
  noteDateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  noteTimeText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  noteMood: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moodEmoji: {
    fontSize: 20,
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  noteContent: {
    fontSize: 16,
    color: '#1e293b',
    lineHeight: 24,
    marginBottom: 16,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  inspirationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  inspirationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  inspirationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  inspirationQuote: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  inspirationAuthor: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'right',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalClose: {
    fontSize: 16,
    color: '#ec4899',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  moodSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  moodButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  moodButtonEmoji: {
    fontSize: 18,
  },
  moodButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  noteInput: {
    backgroundColor: 'white',
    marginBottom: 24,
    minHeight: 120,
  },
  saveButton: {
    backgroundColor: '#ec4899',
    borderRadius: 12,
    paddingVertical: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});