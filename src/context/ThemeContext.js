import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext(null);

export const lightTheme = {
    background: '#F3EEEA',
};

export const darkTheme = {
    background: '#2c3639',
};


export function ThemeProvider({ children, userTheme }) {
    const systemColorScheme = useColorScheme();
    const [theme, setTheme] = useState(userTheme || systemColorScheme || 'light');


    useEffect(() => {
        if (userTheme && userTheme !== theme) {
            setTheme(userTheme);
        }
    }, [userTheme]);

    const colors = theme === 'dark' ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, setTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used inside ThemeProvider');
    return context;
}
