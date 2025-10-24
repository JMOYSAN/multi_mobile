import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext(null);

// 🎨 Thème Light basé sur votre CSS
export const lightTheme = {
    // Backgrounds
    background: '#F3EEEA',
    cardBackground: '#EBE3D5',
    sidebarBackground: '#EBE3D5',
    inputBackground: '#F3EEEA',
    messageBackground: '#B0A695',
    messageOtherBackground: '#EBE3D5',

    // Primary colors
    primary: '#B0A695',
    primaryHover: '#776B5D',
    secondary: '#2c3639',

    // Text colors
    text: '#000000',
    textSecondary: '#2c3639',
    textPlaceholder: '#776B5D',

    // Borders
    border: '#B0A695',
    borderSecondary: '#776B5D',

    // Status colors
    online: '#23a55a',
    offline: '#9aa0a6',
    absent: '#fbbc04',
    busy: '#ea4335',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.6)',

    // Shadow
    shadow: 'rgba(0, 0, 0, 0.1)',
};

// 🌙 Thème Dark basé sur votre CSS
export const darkTheme = {
    // Backgrounds
    background: '#2c3639',
    cardBackground: '#3f4e4f',
    sidebarBackground: '#3f4e4f',
    inputBackground: '#2d2d2d',
    messageBackground: '#a27b5c',
    messageOtherBackground: '#465554',

    // Primary colors
    primary: '#a27b5c',
    primaryHover: '#c08d67',
    secondary: '#2c3639',

    // Text colors
    text: '#dcd7c9',
    textSecondary: '#e3e0d8',
    textPlaceholder: '#888',

    // Borders
    border: '#555',
    borderSecondary: '#3c3c3c',

    // Status colors
    online: '#23a55a',
    offline: '#9aa0a6',
    absent: '#fbbc04',
    busy: '#ea4335',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.6)',

    // Shadow
    shadow: 'rgba(0, 0, 0, 0.3)',
};

export function ThemeProvider({ children, userTheme }) {
    const systemColorScheme = useColorScheme();
    const [theme, setTheme] = useState(
        userTheme || systemColorScheme || 'light'
    );

    useEffect(() => {
        if (userTheme) {
            setTheme(userTheme);
        }
    }, [userTheme]);

    const colors = theme === 'dark' ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, colors, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme doit être utilisé dans un ThemeProvider');
    }
    return context;
}