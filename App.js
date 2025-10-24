import { NavigationContainer } from '@react-navigation/native'
import { AuthProvider, useAuth } from './src/context/AuthContext'
import { ThemeProvider } from './src/context/ThemeContext'
import RootNavigator from './src/navigation/RootNavigator'

function AppContent() {
    const { currentUser } = useAuth()

    return (
        <ThemeProvider userTheme={currentUser?.theme}>
            <RootNavigator />
        </ThemeProvider>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <AppContent />
            </NavigationContainer>
        </AuthProvider>
    )
}