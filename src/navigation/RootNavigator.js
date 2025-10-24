import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from "../screens/RegisterScreen";
import GroupesScreen from '../screens/GroupesScreen'
import ChatScreen from '../screens/ChatScreen'
import UserScreen from "../screens/UserScreen";  // import the chat screen

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
            <Stack.Screen name="Groupes" component={GroupesScreen} options={{ title: 'Groupes' }} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'Discussion' }} />
            <Stack.Screen name="Users" component={UserScreen} options={{ title: 'Users' }} />
        </Stack.Navigator>
    )
}
