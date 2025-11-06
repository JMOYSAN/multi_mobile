// utils/notifications.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications behave
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export async function setupNotifications() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        console.warn('Notification permission not granted');
        return false;
    }
    return true;
}

export async function showLocalNotification(title, body) {
    await Notifications.scheduleNotificationAsync({
        content: { title, body, sound: true },
        trigger: null, // immediate
    });
}
