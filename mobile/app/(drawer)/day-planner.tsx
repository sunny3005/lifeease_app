import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  TextInput,
  Button,
  Card,
  IconButton,
  Chip,
  FAB,
} from 'react-native-paper';
import { ClipboardList, Plus, Clock, Bell, CircleCheck as CheckCircle, Circle, Trash2, CreditCard as Edit3, Calendar, Target, Zap } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { registerForPushNotificationsAsync, scheduleTaskNotification } from '../utils/notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://192.168.1.15:5000/api';

interface Task {
  id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  reminderSet: boolean;
}

export default function DayPlanner() {
  const { colors } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: 'Personal',
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reminderTimeouts, setReminderTimeouts] = useState<Map<string, NodeJS.Timeout>>(new Map());

  const categories = ['Personal', 'Work', 'Health', 'Shopping', 'Social', 'Other'];
  const priorities = [
    { value: 'low', label: 'Low', color: '#10b981' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' },
  ];

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
      checkDailyReminder();
    }, [selectedDate])
  );

  useEffect(() => {
    if (Platform.OS === 'web' && 'Notification' in window) {
      Notification.requestPermission();
    }
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    fetchTasks();
    setupReminders();
  }, [selectedDate]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/tasks?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        setupReminders(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const setupReminders = (taskList: Task[] = tasks) => {
    reminderTimeouts.forEach(timeout => clearTimeout(timeout));
    const newTimeouts = new Map();

    taskList.forEach(task => {
      if (!task.completed && task.time) {
        const taskDateTime = new Date(`${task.date}T${task.time}`);
        const reminderTime = new Date(taskDateTime.getTime() - 5 * 60 * 1000);
        const now = new Date();

        if (reminderTime > now) {
          scheduleTaskNotification(task);
        }
      }
    });

    setReminderTimeouts(newTimeouts);
  };

  const showTaskReminder = (task: Task) => {
    if (Platform.OS === 'web') {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Upcoming Task: ${task.title}`, {
          body: `${task.description} - Starting in 5 minutes`,
          icon: '/icon.png',
        });
      }
    }

    Alert.alert(
      '🔔 Task Reminder',
      `"${task.title}" is starting in 5 minutes!\n\n${task.description}`,
      [
        { text: 'Snooze (5 min)', onPress: () => snoozeReminder(task) },
        { text: 'Mark Complete', onPress: () => toggleTaskComplete(task.id) },
        { text: 'OK', style: 'default' },
      ]
    );
  };

  const snoozeReminder = (task: Task) => {
    const timeout = setTimeout(() => {
      showTaskReminder(task);
    }, 5 * 60 * 1000);

    setReminderTimeouts(prev => new Map(prev.set(`${task.id}_snooze`, timeout)));
  };

  const checkDailyReminder = async () => {
    const today = new Date().toISOString().split('T')[0];
    const lastPrompt = await AsyncStorage.getItem('lastDailyPrompt');

    if (lastPrompt !== today && selectedDate === today) {
      const hour = new Date().getHours();

      if ((hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 20)) {
        setTimeout(async () => {
          Alert.alert(
            '📅 Daily Planning',
            'Good day! Would you like to plan your tasks for today?',
            [
              { text: 'Later', style: 'cancel' },
              { text: 'Plan Now', onPress: () => setModalVisible(true) },
            ]
          );
          await AsyncStorage.setItem('lastDailyPrompt', today);
        }, 2000);
      }
    }
  };



  const saveTask = async () => {
    if (!formData.title.trim() || !formData.time) {
      Alert.alert('Error', 'Please fill in title and time');
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        ...formData,
        date: selectedDate,
        completed: false,
        reminderSet: true,
      };

      const url = editingTask 
        ? `${BACKEND_URL}/tasks/${editingTask.id}`
        : `${BACKEND_URL}/tasks`;
      
      const method = editingTask ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const savedTask = await response.json();
        
        if (editingTask) {
          setTasks(prev => prev.map(t => t.id === editingTask.id ? savedTask : t));
        } else {
          setTasks(prev => [...prev, savedTask]);
        }

        resetForm();
        setModalVisible(false);
        Alert.alert('✅ Success', `Task ${editingTask ? 'updated' : 'created'} successfully!`);
        setupReminders();
      }
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('Error', 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskComplete = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const response = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, completed: !task.completed }),
      });

      if (response.ok) {
        setTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        ));

        // Clear reminder if task is completed
        if (!task.completed) {
          const timeout = reminderTimeouts.get(taskId);
          if (timeout) {
            clearTimeout(timeout);
            setReminderTimeouts(prev => {
              const newMap = new Map(prev);
              newMap.delete(taskId);
              return newMap;
            });
          }
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const deleteTask = async (taskId: string) => {
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
              const response = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
                method: 'DELETE',
              });

              if (response.ok) {
                setTasks(prev => prev.filter(t => t.id !== taskId));
                
                // Clear reminder
                const timeout = reminderTimeouts.get(taskId);
                if (timeout) {
                  clearTimeout(timeout);
                  setReminderTimeouts(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(taskId);
                    return newMap;
                  });
                }

                Alert.alert('✅ Deleted', 'Task removed successfully');
              }
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      time: task.time,
      priority: task.priority,
      category: task.category,
    });
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      time: '',
      priority: 'medium',
      category: 'Personal',
    });
    setEditingTask(null);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, completionRate };
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj?.color || colors.textSecondary;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const stats = getTaskStats();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
        <View style={styles.headerContent}>
          <ClipboardList size={28} color={colors.primary} />
          <Text style={styles.title}>Day Planner</Text>
          <Target size={24} color={colors.secondary} />
        </View>
        
        {/* Date Selector */}
        <View style={styles.dateSelector}>
          <TouchableOpacity
  style={[
    styles.dateButton,
    selectedDate === new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0] && styles.todayButton,
  ]}
  onPress={() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setSelectedDate(yesterday.toISOString().split('T')[0]);
  }}
>
  <Text style={[
    styles.dateButtonText,
    selectedDate === new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0] && styles.todayButtonText,
  ]}>Yesterday</Text>
</TouchableOpacity>

<TouchableOpacity
  style={[
    styles.dateButton,
    selectedDate === new Date().toISOString().split('T')[0] && styles.todayButton
  ]}
  onPress={() => setSelectedDate(new Date().toISOString().split('T')[0])}
>
  <Text style={[
    styles.dateButtonText,
    selectedDate === new Date().toISOString().split('T')[0] && styles.todayButtonText,
  ]}>Today</Text>
</TouchableOpacity>

<TouchableOpacity
  style={[
    styles.dateButton,
    selectedDate === new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0] && styles.todayButton,
  ]}
  onPress={() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }}
>
  <Text style={[
    styles.dateButtonText,
    selectedDate === new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0] && styles.todayButtonText,
  ]}>Tomorrow</Text>
</TouchableOpacity>

        </View>
      </Animated.View>

      {/* Stats Cards */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Tasks</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.success }]}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.warning }]}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{stats.completionRate}%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </Animated.View>

      {/* Tasks List */}
      <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
        {tasks.length === 0 ? (
          <Animated.View entering={FadeInUp.delay(300)} style={styles.emptyState}>
            <Calendar size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No tasks planned</Text>
            <Text style={styles.emptySubtitle}>
              Start planning your day by adding your first task
            </Text>
          </Animated.View>
        ) : (
          tasks
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((task, index) => (
              <Animated.View
                key={task.id}
                entering={FadeInDown.delay(100 * index)}
                style={[
                  styles.taskCard,
                  { 
                    backgroundColor: task.completed ? colors.secondary : colors.card,
                    opacity: task.completed ? 0.7 : 1,
                  }
                ]}
              >
                <View style={styles.taskHeader}>
                  <TouchableOpacity onPress={() => toggleTaskComplete(task.id)}>
                    {task.completed ? (
                      <CheckCircle size={24} color={colors.success} />
                    ) : (
                      <Circle size={24} color={colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                  
                  <View style={styles.taskInfo}>
                    <Text style={[
                      styles.taskTitle,
                      { 
                        textDecorationLine: task.completed ? 'line-through' : 'none',
                        color: task.completed ? colors.textSecondary : colors.text,
                      }
                    ]}>
                      {task.title}
                    </Text>
                    {task.description && (
                      <Text style={styles.taskDescription}>{task.description}</Text>
                    )}
                  </View>

                  <View style={styles.taskActions}>
                    <IconButton
                      icon={() => <Edit3 size={16} color={colors.primary} />}
                      size={20}
                      onPress={() => editTask(task)}
                    />
                    <IconButton
                      icon={() => <Trash2 size={16} color={colors.error} />}
                      size={20}
                      onPress={() => deleteTask(task.id)}
                    />
                  </View>
                </View>

                <View style={styles.taskMeta}>
                  <View style={styles.taskTime}>
                    <Clock size={14} color={colors.textSecondary} />
                    <Text style={styles.taskTimeText}>{formatTime(task.time)}</Text>
                  </View>
                  
                  <Chip
                    mode="outlined"
                    style={[styles.priorityChip, { borderColor: getPriorityColor(task.priority) }]}
                    textStyle={[styles.priorityText, { color: getPriorityColor(task.priority) }]}
                  >
                    {task.priority.toUpperCase()}
                  </Chip>
                  
                  <Chip
                    mode="outlined"
                    style={styles.categoryChip}
                    textStyle={styles.categoryText}
                  >
                    {task.category}
                  </Chip>

                  {task.reminderSet && !task.completed && (
                    <Bell size={14} color={colors.warning} />
                  )}
                </View>
              </Animated.View>
            ))
        )}
      </ScrollView>

      {/* Add Task FAB */}
      <FAB
        icon={() => <Plus size={24} color="white" />}
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      />

      {/* Add/Edit Task Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </Text>
            <IconButton
              icon={() => <Trash2 size={24} color={colors.text} />}
              onPress={() => setModalVisible(false)}
            />
          </View>

          <ScrollView style={styles.modalContent}>
            <TextInput
              mode="outlined"
              label="Task Title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
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
              label="Description (Optional)"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={3}
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
              label="Time (HH:MM)"
              value={formData.time}
              onChangeText={(text) => setFormData({ ...formData, time: text })}
              placeholder="14:30"
              style={styles.input}
              theme={{ 
                colors: {
                  background: colors.surface,
                  onSurfaceVariant: colors.textSecondary,
                  outline: colors.border,
                }
              }}
            />

            <Text style={styles.sectionTitle}>Priority</Text>
            <View style={styles.priorityContainer}>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority.value}
                  style={[
                    styles.priorityOption,
                    {
                      backgroundColor: formData.priority === priority.value 
                        ? priority.color 
                        : colors.surface,
                      borderColor: priority.color,
                    }
                  ]}
                  onPress={() => setFormData({ ...formData, priority: priority.value })}
                >
                  <Text style={[
                    styles.priorityOptionText,
                    {
                      color: formData.priority === priority.value 
                        ? 'white' 
                        : priority.color,
                    }
                  ]}>
                    {priority.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryOption,
                    {
                      backgroundColor: formData.category === category 
                        ? colors.primary 
                        : colors.surface,
                      borderColor: colors.border,
                    }
                  ]}
                  onPress={() => setFormData({ ...formData, category })}
                >
                  <Text style={[
                    styles.categoryOptionText,
                    {
                      color: formData.category === category 
                        ? 'white' 
                        : colors.text,
                    }
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={saveTask}
                loading={loading}
                disabled={loading}
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </Button>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  dateButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    alignItems: 'center',
  },
  todayButton: {
    backgroundColor: colors.primary,
  },
  dateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  todayButtonText: {
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  tasksList: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  taskCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  taskInfo: {
    flex: 1,
    marginLeft: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  taskActions: {
    flexDirection: 'row',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskTimeText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  priorityChip: {
    height: 24,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryChip: {
    height: 24,
    borderColor: colors.border,
  },
  categoryText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    borderRadius: 28,
  },
  modal: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityOptionText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryOptionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});