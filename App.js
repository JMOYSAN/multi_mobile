import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
SplashScreen.preventAutoHideAsync();
export default function App() {
    useEffect(() => {
        const timer = setTimeout(() => SplashScreen.hideAsync(), 600);
        return () => clearTimeout(timer);
    }, []);
    return (
        <NavigationContainer>
            <RootNavigator />
        </NavigationContainer>
    );
}