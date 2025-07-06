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
import { Calendar, Clock, Plus, CircleCheck as CheckCircle, Circle, Bell, Trash2, CreditCard as Edit3, Target } from 'lucide-react-native';
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

interface Task {
  id: number;
  title: string;
  time: string;
  completed: boolean;
  reminder: boolean;
}

export default function PlannerTab() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Morning workout', time: '07:00', completed: true, reminder: true },
    { id: 2, title: 'Team meeting', time: '10:00', completed: false, reminder: true },
    { id: 3, title: 'Lunch with Sarah', time: '13:00', completed: false, reminder: true },
    { id: 4, title: 'Grocery shopping', time: '17:00', completed: false, reminder: true },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', time: '' });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Animation values
  const bellShake = useSharedValue(0);
  const progressRotation = useSharedValue(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      checkReminders();
    }, 60000); // Check every minute

    // Bell shake animation
    bellShake.value = withRepeat(
      withTiming(10, { duration: 100 }),
      4,
      true
    );

    // Progress rotation
    progressRotation.value = withRepeat(
      withTiming(360, { duration: 2000 }),
      -1,
      false
    );

    return () => clearInterval(timer);
  }, []);

  const bellStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${bellShake.value}deg` }],
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progressRotation.value}deg` }],
    };
  });

  const checkReminders = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    tasks.forEach(task => {
      if (!task.completed && task.reminder) {
        const [taskHour, taskMinute] = task.time.split(':').map(Number);
        const reminderTime = new Date();
        reminderTime.setHours(taskHour, taskMinute - 5, 0, 0);

        if (
          currentHour === reminderTime.getHours() &&
          currentMinute === reminderTime.getMinutes()
        ) {
          Alert.alert(
            '🔔 Reminder',
            `"${task.title}" is starting in 5 minutes!`,
            [{ text: 'OK', style: 'default' }]
          );
        }
      }
    });
  };

  const addTask = async () => {
    if (!newTask.title.trim() || !newTask.time.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const task: Task = {
      id: Date.now(),
      title: newTask.title.trim(),
      time: newTask.time.trim(),
      completed: false,
      reminder: true,
    };

    try {
      // Mock API call
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      setTasks([...tasks, task]);
      setNewTask({ title: '', time: '' });
      setShowAddModal(false);
      Alert.alert('✅ Success', 'Task added successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert('Error', 'Failed to add task');
    }
  };

  const toggleTask = async (id: number) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );

      // Mock API call
      await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !tasks.find(t => t.id === id)?.completed }),
      });

      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Mock API call
              await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
              setTasks(tasks.filter(task => task.id !== id));
            } catch (error) {
              console.error('Error deleting task:', error);
            }
          }
        }
      ]
    );
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 17) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.headerTitle}>Day Planner</Text>
            <Text style={styles.dateText}>
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <Animated.View style={bellStyle}>
            <TouchableOpacity style={styles.reminderButton}>
              <Bell size={24} color="#6366f1" />
              <View style={styles.reminderBadge}>
                <Text style={styles.badgeText}>{tasks.filter(t => !t.completed).length}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Progress Card */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <Animated.View style={progressStyle}>
              <Target size={20} color="#6366f1" />
            </Animated.View>
          </View>
          <View style={styles.progressContent}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
              <Text style={styles.progressLabel}>Complete</Text>
            </View>
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completedTasks}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalTasks - completedTasks}</Text>
                <Text style={styles.statLabel}>Remaining</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalTasks}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
        </Animated.View>

        {/* Tasks Section */}
        <Animated.View entering={FadeInUp.delay(300)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.tasksList}>
            {tasks.map((task, index) => (
              <Animated.View key={task.id} entering={FadeInUp.delay(400 + index * 100)}>
                <View style={[styles.taskCard, task.completed && styles.completedTaskCard]}>
                  <TouchableOpacity
                    style={styles.taskCheckbox}
                    onPress={() => toggleTask(task.id)}
                  >
                    {task.completed ? (
                      <CheckCircle size={24} color="#10b981" />
                    ) : (
                      <Circle size={24} color="#94a3b8" />
                    )}
                  </TouchableOpacity>
                  
                  <View style={styles.taskContent}>
                    <Text style={[
                      styles.taskTitle,
                      task.completed && styles.completedTaskTitle
                    ]}>
                      {task.title}
                    </Text>
                    <View style={styles.taskMeta}>
                      <Clock size={14} color="#64748b" />
                      <Text style={styles.taskTime}>{task.time}</Text>
                      {task.reminder && (
                        <View style={styles.reminderIndicator}>
                          <Bell size={12} color="#6366f1" />
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.taskActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => deleteTask(task.id)}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>

          {tasks.length === 0 && (
            <View style={styles.emptyState}>
              <Calendar size={48} color="#94a3b8" />
              <Text style={styles.emptyStateTitle}>No tasks yet</Text>
              <Text style={styles.emptyStateText}>
                Add your first task to start planning your day
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInUp.delay(500)} style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionButtons}>
            <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: '#6366f1' }]}>
              <Bell size={20} color="white" />
              <Text style={styles.quickActionText}>Set Reminder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: '#10b981' }]}>
              <Calendar size={20} color="white" />
              <Text style={styles.quickActionText}>View Calendar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Add Task Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TextInput
              mode="outlined"
              label="Task Title"
              value={newTask.title}
              onChangeText={text => setNewTask({ ...newTask, title: text })}
              style={styles.modalInput}
              theme={{
                colors: {
                  primary: '#6366f1',
                  outline: '#e2e8f0',
                }
              }}
              placeholder="Enter task description"
            />

            <TextInput
              mode="outlined"
              label="Time (HH:MM)"
              value={newTask.time}
              onChangeText={text => setNewTask({ ...newTask, time: text })}
              style={styles.modalInput}
              theme={{
                colors: {
                  primary: '#6366f1',
                  outline: '#e2e8f0',
                }
              }}
              placeholder="e.g., 14:30"
            />

            <Button
              mode="contained"
              onPress={addTask}
              style={styles.addTaskButton}
              labelStyle={styles.addTaskButtonText}
            >
              Add Task
            </Button>
          </View>
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
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#64748b',
  },
  reminderButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  reminderBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 24,
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6366f1',
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  progressStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 3,
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tasksList: {
    marginBottom: 32,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  completedTaskCard: {
    backgroundColor: '#f8fafc',
    opacity: 0.7,
  },
  taskCheckbox: {
    marginRight: 16,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#64748b',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  taskTime: {
    fontSize: 14,
    color: '#64748b',
  },
  reminderIndicator: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 2,
    marginLeft: 8,
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
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
  quickActions: {
    marginBottom: 32,
  },
  quickActionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
    color: '#6366f1',
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
    gap: 20,
  },
  modalInput: {
    backgroundColor: 'white',
  },
  addTaskButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 8,
    marginTop: 20,
  },
  addTaskButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});