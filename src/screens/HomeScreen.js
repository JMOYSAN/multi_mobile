import { View, Text, Button, StyleSheet } from 'react-native'
import { useAuth } from '../context/AuthContext'

export default function HomeScreen({ navigation }) {
    const { currentUser, isConnect, logout } = useAuth()

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {isConnect
                    ? `Bienvenue ${currentUser?.username || 'Utilisateur'}`
                    : "Bienvenue dans l'application"}
            </Text>


            {!isConnect ? (
                    <>
                    <Button
                    title="Aller à la connexion"
                    onPress={() => navigation.navigate('Login')}
            />
            <View style={{ marginTop: 10 }}>
                <Button
                    title="Créer un compte"
                    onPress={() => navigation.navigate('Register')}
                />
            </View>
        </>
    ) : (
        <>
            <View style={{ marginTop: 10 }}>
                <Button
                    title="Voir les Utilisateurs"
                    onPress={() => navigation.navigate('Users')}
                />
            </View>

            <View style={{ marginTop: 10 }}>
                <Button
                    title="Voir les groupes"
                    onPress={() => navigation.navigate('Groupes')}
                />
            </View>

            <View style={{ marginTop: 10 }}>
                <Button title="Se déconnecter" onPress={logout} color="#d32f2f" />
            </View>
        </>
    )}
</View>
)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#dcd7c9',
            padding: 20,
    },
    title: {
        fontSize: 22,
            color: '#2c3639',
            marginBottom: 20,
            textAlign: 'center',
    },
})