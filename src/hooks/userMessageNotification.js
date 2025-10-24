import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export function useMessageNotifications(currentUser, currentGroupe) {
    // Configure how notifications are shown when the app is open
    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });
    }, []);

    // Create notification channel for Android
    useEffect(() => {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('chat-messages', {
                name: 'Messages',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    }, []);

    // Ask permission once
    useEffect(() => {
        const requestPermissions = async () => {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                await Notifications.requestPermissionsAsync();
            }
        };
        requestPermissions();
    }, []);

    // Function to trigger a system notification
    const showMessageNotification = async (msg) => {
        if (!msg || msg.user_id === currentUser?.id) return; // don't notify for self
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: msg.username || 'Nouveau message',
                    body: msg.content || '',
                    data: {
                        groupId: msg.group_id,
                        userId: msg.user_id,
                    },
                },
                trigger: null, // show immediately
            });
        } catch (err) {
            console.error('[useMessageNotifications] Failed to show notification:', err);
        }
    };

    return { showMessageNotification };
}
