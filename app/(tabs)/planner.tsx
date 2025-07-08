import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle, 
  Circle,
  Target,
  TrendingUp 
} from 'lucide-react-native';

const tasks = [
  {
    id: 1,
    title: 'Morning Workout',
    time: '7:00 AM',
    completed: true,
    priority: 'high',
  },
  {
    id: 2,
    title: 'Team Meeting',
    time: '10:00 AM',
    completed: false,
    priority: 'high',
  },
  {
    id: 3,
    title: 'Lunch with Sarah',
    time: '12:30 PM',
    completed: false,
    priority: 'medium',
  },
  {
    id: 4,
    title: 'Grocery Shopping',
    time: '5:00 PM',
    completed: false,
    priority: 'low',
  },
];

const stats = [
  { label: 'Total Tasks', value: '12', icon: Target, color: '#6366f1' },
  { label: 'Completed', value: '8', icon: CheckCircle, color: '#10b981' },
  { label: 'Progress', value: '67%', icon: TrendingUp, color: '#f59e0b' },
];

export default function PlannerScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Day Planner</Text>
            <Text style={styles.subtitle}>Organize your daily tasks</Text>
          </View>
          <TouchableOpacity style={styles.calendarButton}>
            <Calendar size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
              <stat.icon size={18} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Date Selector */}
      <View style={styles.dateSection}>
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateContainer}
        >
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i - 3);
            const day = date.getDate();
            const isToday = day === new Date().getDate();
            
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dateButton,
                  isToday && styles.dateButtonActive,
                ]}
                onPress={() => setSelectedDate(day)}
              >
                <Text style={styles.dayText}>
                  {date.toLocaleDateString('en', { weekday: 'short' })}
                </Text>
                <Text style={[
                  styles.dateText,
                  isToday && styles.dateTextActive,
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Tasks List */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tasks</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={20} color="#6366f1" />
          </TouchableOpacity>
        </View>

        <View style={styles.tasksList}>
          {tasks.map((task) => (
            <TouchableOpacity key={task.id} style={styles.taskCard}>
              <View style={styles.taskLeft}>
                <TouchableOpacity style={styles.checkButton}>
                  {task.completed ? (
                    <CheckCircle size={24} color="#10b981" />
                  ) : (
                    <Circle size={24} color="#64748b" />
                  )}
                </TouchableOpacity>
                <View style={styles.taskContent}>
                  <Text style={[
                    styles.taskTitle,
                    task.completed && styles.taskTitleCompleted,
                  ]}>
                    {task.title}
                  </Text>
                  <View style={styles.taskMeta}>
                    <Clock size={14} color="#64748b" />
                    <Text style={styles.taskTime}>{task.time}</Text>
                    <View style={[
                      styles.priorityDot,
                      { backgroundColor: getPriorityColor(task.priority) },
                    ]} />
                    <Text style={styles.priorityText}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Add Task Button */}
      <TouchableOpacity style={styles.fab}>
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  calendarButton: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  dateSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  dateContainer: {
    paddingVertical: 16,
    gap: 12,
  },
  dateButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    minWidth: 60,
  },
  dateButtonActive: {
    backgroundColor: '#6366f1',
  },
  dayText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  dateTextActive: {
    color: 'white',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: 12,
  },
  tasksList: {
    gap: 12,
  },
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkButton: {
    marginRight: 12,
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
  taskTitleCompleted: {
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
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 6,
  },
  priorityText: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'capitalize',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#6366f1',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});