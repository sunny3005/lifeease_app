import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { ClipboardList } from 'lucide-react-native';

export default function DayPlanner() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ClipboardList size={64} color="#6366f1" style={styles.icon} />
        <Text style={styles.title}>Day Planner</Text>
        <Text style={styles.subtitle}>Plan your perfect day</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});