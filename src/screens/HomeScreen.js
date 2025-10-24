import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggleButton from '../components/ThemeToggleButton';

export default function HomeScreen({ navigation }) {
    const { currentUser, isConnect, logout } = useAuth();
    const { theme, colors } = useTheme();

    const dynamicTextColor = theme === 'dark' ? '#b38bfa' : colors.text;
    const dynamicButtonColor = theme === 'dark' ? '#b38bfa' : colors.primary || '#2c3639';

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ThemeToggleButton />

            <Text style={[styles.title, { color: dynamicTextColor }]}>
                {isConnect
                    ? `Bienvenue ${currentUser?.username || 'Utilisateur'}`
                    : "Bienvenue dans l'application"}
            </Text>

            {!isConnect ? (
                <>
                    <Button
                        title="Aller à la connexion"
                        onPress={() => navigation.navigate('Login')}
                        color={dynamicButtonColor}
                    />
                    <View style={{ marginTop: 10 }}>
                        <Button
                            title="Créer un compte"
                            onPress={() => navigation.navigate('Register')}
                            color={dynamicButtonColor}
                        />
                    </View>
                </>
            ) : (
                <>
                    <View style={{ marginTop: 10 }}>

                        <Button
                            title="Voir les Utilisateurs"
                            onPress={() => navigation.navigate('Users')}
                            color={dynamicButtonColor}
                        />
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Button
                            title="Voir les Groupes"
                            onPress={() => navigation.navigate('Groupes')}
                            color={dynamicButtonColor}
                        />
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Button
                            title="Se déconnecter"
                            onPress={logout}
                            color={theme === 'dark' ? '#ff6b6b' : '#d32f2f'}
                        />
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22,
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 18,
        marginBottom: 6,
    },
});
