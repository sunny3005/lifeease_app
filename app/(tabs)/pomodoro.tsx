import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Target,
  Clock,
  TrendingUp,
  Zap,
} from 'lucide-react-native';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { CircularProgress } from 'react-native-circular-progress';

const { width } = Dimensions.get('window');

interface PomodoroSession {
  id: number;
  type: 'focus' | 'break';
  duration: number;
  completedAt: string;
}

export default function PomodoroTab() {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [todaySessions, setTodaySessions] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Animation values
  const pulseScale = useSharedValue(1);
  const progressRotation = useSharedValue(0);

  const FOCUS_TIME = 25 * 60; // 25 minutes
  const BREAK_TIME = 5 * 60;  // 5 minutes

  useEffect(() => {
    // Pulse animation for timer
    pulseScale.value = withRepeat(
      withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Progress rotation
    progressRotation.value = withRepeat(
      withTiming(360, { duration: 2000 }),
      -1,
      false
    );

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: isRunning ? pulseScale.value : 1 }],
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progressRotation.value}deg` }],
    };
  });

  const handleTimerComplete = async () => {
    setIsRunning(false);
    
    const session: PomodoroSession = {
      id: Date.now(),
      type: isBreak ? 'break' : 'focus',
      duration: isBreak ? BREAK_TIME : FOCUS_TIME,
      completedAt: new Date().toISOString(),
    };

    try {
      // Mock API call
      await fetch('/api/pomodoro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      });

      setSessions([session, ...sessions]);
      
      if (!isBreak) {
        setTodaySessions(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }

    if (isBreak) {
      Alert.alert(
        '🎯 Break Complete!',
        'Time to get back to focused work. Ready for another session?',
        [
          { text: 'Not Yet', style: 'cancel' },
          { text: 'Start Focus', onPress: () => startFocusSession() }
        ]
      );
    } else {
      Alert.alert(
        '🎉 Focus Session Complete!',
        'Great work! Time for a well-deserved break.',
        [
          { text: 'Skip Break', onPress: () => startFocusSession() },
          { text: 'Take Break', onPress: () => startBreakSession() }
        ]
      );
    }
  };

  const startFocusSession = () => {
    setIsBreak(false);
    setTimeLeft(FOCUS_TIME);
    setIsRunning(true);
  };

  const startBreakSession = () => {
    setIsBreak(true);
    setTimeLeft(BREAK_TIME);
    setIsRunning(true);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? BREAK_TIME : FOCUS_TIME);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = isBreak ? BREAK_TIME : FOCUS_TIME;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getTips = () => {
    if (isBreak) {
      return [
        '🚶‍♂️ Take a short walk',
        '💧 Drink some water',
        '👀 Rest your eyes',
        '🧘‍♀️ Do some stretches',
      ];
    } else {
      return [
        '📱 Put phone in silent mode',
        '🎯 Focus on one task only',
        '🚫 Avoid distractions',
        '💪 Stay committed',
      ];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Pomodoro Timer</Text>
            <Text style={styles.headerSubtitle}>
              {isBreak ? '☕ Break Time' : '🎯 Focus Time'}
            </Text>
          </View>
          <Animated.View style={progressStyle}>
            <Target size={28} color="#ef4444" />
          </Animated.View>
        </Animated.View>

        {/* Timer Circle */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.timerContainer}>
          <Animated.View style={[styles.timerCircle, pulseStyle]}>
            <View style={styles.progressContainer}>
              <View style={[
                styles.progressRing,
                { 
                  borderColor: isBreak ? '#10b981' : '#ef4444',
                  transform: [{ rotate: '-90deg' }]
                }
              ]}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      backgroundColor: isBreak ? '#10b981' : '#ef4444',
                      transform: [{ rotate: `${(getProgress() / 100) * 360}deg` }]
                    }
                  ]} 
                />
              </View>
              <View style={styles.timerContent}>
                <Text style={[
                  styles.timerText,
                  { color: isBreak ? '#10b981' : '#ef4444' }
                ]}>
                  {formatTime(timeLeft)}
                </Text>
                <Text style={styles.timerLabel}>
                  {isBreak ? 'Break' : 'Focus'}
                </Text>
              </View>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Controls */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.resetButton]}
            onPress={resetTimer}
          >
            <RotateCcw size={24} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.playButton,
              { backgroundColor: isBreak ? '#10b981' : '#ef4444' }
            ]}
            onPress={toggleTimer}
          >
            {isRunning ? (
              <Pause size={32} color="white" />
            ) : (
              <Play size={32} color="white" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.switchButton]}
            onPress={() => {
              setIsBreak(!isBreak);
              setTimeLeft(isBreak ? FOCUS_TIME : BREAK_TIME);
              setIsRunning(false);
            }}
          >
            {isBreak ? (
              <Target size={24} color="#ef4444" />
            ) : (
              <Coffee size={24} color="#10b981" />
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <TrendingUp size={20} color="#6366f1" />
            <Text style={styles.statsTitle}>Today's Progress</Text>
          </View>
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{todaySessions}</Text>
              <Text style={styles.statLabel}>Focus Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{todaySessions * 25}</Text>
              <Text style={styles.statLabel}>Minutes Focused</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{Math.round((todaySessions / 8) * 100)}%</Text>
              <Text style={styles.statLabel}>Daily Goal</Text>
            </View>
          </View>
        </Animated.View>

        {/* Tips */}
        <Animated.View entering={FadeInUp.delay(500)} style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Zap size={20} color="#f59e0b" />
            <Text style={styles.tipsTitle}>
              {isBreak ? 'Break Tips' : 'Focus Tips'}
            </Text>
          </View>
          <View style={styles.tipsList}>
            {getTips().map((tip, index) => (
              <Text key={index} style={styles.tipText}>{tip}</Text>
            ))}
          </View>
        </Animated.View>
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerCircle: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressRing: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 8,
    borderColor: '#e2e8f0',
    position: 'absolute',
  },
  progressFill: {
    width: 140,
    height: 280,
    borderTopRightRadius: 140,
    borderBottomRightRadius: 140,
    position: 'absolute',
    right: 0,
    transformOrigin: 'left center',
  },
  timerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  resetButton: {
    backgroundColor: 'white',
  },
  switchButton: {
    backgroundColor: 'white',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6366f1',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  tipsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  tipsList: {
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});