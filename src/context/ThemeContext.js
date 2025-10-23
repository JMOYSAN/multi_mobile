import { createContext, useContext, useState, useEffect } from 'react'
import { useColorScheme } from 'react-native'

const ThemeContext = createContext(null)

export const lightTheme = {
    background: '#dcd7c9',
    cardBackground: '#fff',
    text: '#2c3639',
    primary: '#3f4e4f',
    border: '#a27b5c',
}

export const darkTheme = {
    background: '#2c3639',
    cardBackground: '#3f4e4f',
    text: '#dcd7c9',
    primary: '#a27b5c',
    border: '#dcd7c9',
}

export function ThemeProvider({ children, userTheme }) {
    const systemColorScheme = useColorScheme()
    const [theme, setTheme] = useState(
        userTheme || systemColorScheme || 'light'
    )

    useEffect(() => {
        if (userTheme) {
            setTheme(userTheme)
        }
    }, [userTheme])

    const colors = theme === 'dark' ? darkTheme : lightTheme

    return (
        <ThemeContext.Provider value={{ theme, colors, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme doit être utilisé dans un ThemeProvider')
    }
    return context
}