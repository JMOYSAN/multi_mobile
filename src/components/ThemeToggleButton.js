import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggleButton() {
    const { theme, setTheme, colors } = useTheme();

    const toggle = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <TouchableOpacity
            onPress={toggle}
            style={[styles.btn, { backgroundColor: colors.cardBackground }]}
        >
            <Text style={{ color: colors.text }}>
                {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        padding: 10,
        borderRadius: 8,
        alignSelf: 'center',
        marginVertical: 10,
    },
});
