import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../services/authService.js';
import { API_URL } from '@env';

export default function ThemeToggleButton() {
    const { theme, setTheme } = useTheme();
    const { currentUser, setCurrentUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const toggleTheme = async () => {
        if (!currentUser?.id) return;
        const newTheme = theme === 'dark' ? 'light' : 'dark';

        try {
            setLoading(true);
            const res = await fetchWithAuth(`${API_URL}/users/${currentUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: newTheme }),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const updatedUser = await res.json();


            setTheme(updatedUser.theme);
            setCurrentUser(updatedUser);
        } catch (err) {
            console.error('[ThemeToggleButton] Erreur changement thème:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity style={styles.btn} onPress={toggleTheme} disabled={loading}>
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.text}>
                    {theme === 'dark' ? '☀️ Mode clair' : '🌙 Mode sombre'}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#776B5D',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
