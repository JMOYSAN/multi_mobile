import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext(null);

export const lightTheme = {
    background: '#F3EEEA',
    text: '#000',
    cardBackground: '#EBE3D5',
};

export const darkTheme = {
    background: '#2c3639',
    text: '#dcd7c9',
    cardBackground: '#3f4e4f',
};

export function ThemeProvider({ children }) {
    const system = useColorScheme();
    const [theme, setTheme] = useState(system || 'light');

    useEffect(() => {
        AsyncStorage.getItem('appTheme').then((saved) => {
            if (saved) setTheme(saved);
        });
    }, []);

    useEffect(() => {
        AsyncStorage.setItem('appTheme', theme);
    }, [theme]);

    const colors = theme === 'dark' ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, setTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
    return ctx;
}
