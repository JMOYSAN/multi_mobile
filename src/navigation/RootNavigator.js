import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import LoginScreen from '../screens/LoginScreen'
import UtilisateursScreen from '../screens/UtilisateursScreen'

const Stack = createNativeStackNavigator()

export default function RootNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerStyle: { backgroundColor: '#2c3639' },
                headerTintColor: '#fff',
                contentStyle: { backgroundColor: '#dcd7c9' },
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Connexion' }} />
            <Stack.Screen name="Utilisateurs" component={UtilisateursScreen} options={{ title: 'Utilisateurs' }} />
        </Stack.Navigator>
    )
}
