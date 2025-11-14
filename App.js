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

export default Sentry.Native.wrap(function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <AppContent />
            </NavigationContainer>
        </AuthProvider>
    )
});
import * as Sentry from "sentry-expo";


Sentry.init({
  dsn: 'https://6329d40eda791632f7411ff8c363e091@o4510364801040384.ingest.us.sentry.io/4510364876537856',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});