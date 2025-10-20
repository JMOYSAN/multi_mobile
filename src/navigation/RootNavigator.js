import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import ChatScreen from '../screens/ChatScreen'

const Stack = createNativeStackNavigator()

export default function RootNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#2c3639' },
                headerTintColor: '#fff',
                contentStyle: { backgroundColor: '#dcd7c9' },
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: 'Connexion' }}
            />
        </Stack.Navigator>
    )
}
