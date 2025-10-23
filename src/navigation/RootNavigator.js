import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from "../screens/RegisterScreen";
import UtilisateursScreen from '../screens/UtilisateursScreen'
import RealUtilisateurScreen from '../screens/RealUtilisateurScreen'

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
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
            <Stack.Screen name="Utilisateurs" component={UtilisateursScreen} options={{ title: 'Utilisateurs' }} />
            <Stack.Screen name="RealUtilisateur" component={RealUtilisateurScreen} options={{ title: 'RealUtilisateur' }} />
        </Stack.Navigator>
    )
}
