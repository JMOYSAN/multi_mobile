import { View, Text, Button, StyleSheet } from 'react-native'

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenue dans l'application</Text>
            <Button title="Aller à la connexion" onPress={() => navigation.navigate('Login')} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dcd7c9',
    },
    title: {
        fontSize: 22,
        color: '#2c3639',
        marginBottom: 20,
    },
})
