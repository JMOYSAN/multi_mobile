import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext'; // adjust path if needed

export default function ThemeToggleButton() {
    const { theme, setTheme, colors } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.button, { backgroundColor: colors.primary }]}
        >
            <Text style={[styles.text, { color: colors.text }]}>
                {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignSelf: 'center',
        marginVertical: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
