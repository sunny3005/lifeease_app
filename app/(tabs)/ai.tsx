import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { 
  Sparkles, 
  Brain, 
  TrendingUp, 
  Lightbulb,
  Zap,
  Target,
  Heart,
  Calendar
} from 'lucide-react-native';

const suggestions = [
  {
    id: 1,
    type: 'fashion',
    title: 'Perfect Outfit for Today',
    description: 'Based on weather and your style preferences',
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    confidence: 95,
    icon: Sparkles,
    color: '#ec4899',
  },
  {
    id: 2,
    type: 'productivity',
    title: 'Optimize Your Schedule',
    description: 'Rearrange tasks for better productivity',
    confidence: 88,
    icon: Calendar,
    color: '#3b82f6',
  },
  {
    id: 3,
    type: 'wellness',
    title: 'Mindfulness Break',
    description: 'Take a 10-minute meditation break',
    confidence: 92,
    icon: Heart,
    color: '#10b981',
  },
];

const insights = [
  {
    title: 'Style Patterns',
    value: 'Casual 65%',
    trend: '+12%',
    icon: TrendingUp,
    color: '#ec4899',
  },
  {
    title: 'Productivity Score',
    value: '87/100',
    trend: '+5%',
    icon: Target,
    color: '#3b82f6',
  },
  {
    title: 'AI Accuracy',
    value: '94%',
    trend: '+8%',
    icon: Brain,
    color: '#8b5cf6',
  },
];

export default function AIScreen() {
  const [selectedTab, setSelectedTab] = useState('suggestions');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>AI Assistant</Text>
            <Text style={styles.subtitle}>Smart lifestyle suggestions</Text>
          </View>
          <View style={styles.aiIcon}>
            <Brain size={24} color="#8b5cf6" />
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'suggestions' && styles.tabActive,
          ]}
          onPress={() => setSelectedTab('suggestions')}
        >
          <Lightbulb size={18} color={selectedTab === 'suggestions' ? '#8b5cf6' : '#64748b'} />
          <Text style={[
            styles.tabText,
            selectedTab === 'suggestions' && styles.tabTextActive,
          ]}>
            Suggestions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'insights' && styles.tabActive,
          ]}
          onPress={() => setSelectedTab('insights')}
        >
          <TrendingUp size={18} color={selectedTab === 'insights' ? '#8b5cf6' : '#64748b'} />
          <Text style={[
            styles.tabText,
            selectedTab === 'insights' && styles.tabTextActive,
          ]}>
            Insights
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'suggestions' ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Recommendations</Text>
          <View style={styles.suggestionsList}>
            {suggestions.map((suggestion) => (
              <TouchableOpacity key={suggestion.id} style={styles.suggestionCard}>
                <View style={styles.suggestionHeader}>
                  <View style={[styles.suggestionIcon, { backgroundColor: `${suggestion.color}20` }]}>
                    <suggestion.icon size={20} color={suggestion.color} />
                  </View>
                  <View style={styles.confidenceContainer}>
                    <Text style={styles.confidenceText}>{suggestion.confidence}%</Text>
                    <Text style={styles.confidenceLabel}>confidence</Text>
                  </View>
                </View>
                
                {suggestion.image && (
                  <Image source={{ uri: suggestion.image }} style={styles.suggestionImage} />
                )}
                
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                  <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
                  
                  <View style={styles.suggestionActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Text style={styles.actionButtonText}>Apply</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButtonSecondary}>
                      <Text style={styles.actionButtonSecondaryText}>Learn More</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your AI Insights</Text>
          
          {/* Insights Grid */}
          <View style={styles.insightsGrid}>
            {insights.map((insight, index) => (
              <View key={index} style={styles.insightCard}>
                <View style={[styles.insightIcon, { backgroundColor: `${insight.color}20` }]}>
                  <insight.icon size={20} color={insight.color} />
                </View>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightValue}>{insight.value}</Text>
                <View style={styles.insightTrend}>
                  <TrendingUp size={12} color="#10b981" />
                  <Text style={styles.insightTrendText}>{insight.trend}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* AI Learning Progress */}
          <View style={styles.learningCard}>
            <View style={styles.learningHeader}>
              <Zap size={24} color="#f59e0b" />
              <Text style={styles.learningTitle}>AI Learning Progress</Text>
            </View>
            <Text style={styles.learningDescription}>
              Your AI assistant is getting smarter every day by learning from your preferences and habits.
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '78%' }]} />
            </View>
            <Text style={styles.progressText}>78% - Advanced Learning</Text>
          </View>

          {/* Tips Section */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 AI Tips</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tipItem}>• Use the app daily to improve AI accuracy</Text>
              <Text style={styles.tipItem}>• Rate suggestions to help AI learn your preferences</Text>
              <Text style={styles.tipItem}>• Enable notifications for timely recommendations</Text>
              <Text style={styles.tipItem}>• Explore different categories for diverse insights</Text>
            </View>
          </View>
        </View>
      )}
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
  aiIcon: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    gap: 8,
  },
  tabActive: {
    backgroundColor: '#f3f4f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#8b5cf6',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  suggestionsList: {
    gap: 16,
  },
  suggestionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confidenceContainer: {
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  suggestionImage: {
    width: '100%',
    height: 200,
  },
  suggestionContent: {
    padding: 16,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  suggestionDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  suggestionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonSecondaryText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  insightCard: {
    flex: 1,
    minWidth: '30%',
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
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  insightTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  insightTrendText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  learningCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  learningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  learningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  learningDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  tipsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});