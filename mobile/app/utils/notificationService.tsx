import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure foreground notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Permission for notifications not granted!');
      return;
    }
  } else {
    alert('Must use physical device for notifications');
  }
}

export async function scheduleTaskNotification(task: {
  id: string;
  title: string;
  description: string;
  time: string;
  date: string;
}) {
  const taskDateTime = new Date(`${task.date}T${task.time}`);
  const triggerTime = new Date(taskDateTime.getTime() - 5 * 60 * 1000); // 5 minutes before

  const now = new Date();
  if (triggerTime <= now) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `📌 ${task.title}`,
      body: `${task.description || 'You have a task'} in 5 minutes.`,
      sound: true,
    },
    trigger: triggerTime,
  });
}