import { useState } from 'react'
import styled from 'styled-components/native'
import { API_URL } from '@env'
import {useAuth} from "../context/AuthContext";
import { Text, Alert } from 'react-native';

const LoginWrapper = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #2c3639;
`

const LoginCard = styled.View({
    backgroundColor: '#dcd7c9',
    padding: 40,
    borderRadius: 20,
    width: '85%',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
})

const Title = styled.Text`
    margin-bottom: 20px;
    font-size: 28px;
    color: #2c3639;
    text-align: center;
`

const Input = styled.TextInput`
    width: 100%;
    padding: 12px 15px;
    margin-bottom: 20px;
    border-width: 1px;
    border-color: #a27b5c;
    border-radius: 10px;
    background-color: #fff;
    font-size: 16px;
`

const Button = styled.TouchableOpacity`
    width: 100%;
    padding: 12px 15px;
    background-color: #3f4e4f;
    border-radius: 10px;
    align-items: center;
    margin-top: 5px;
`

const ButtonText = styled.Text`
    color: white;
    font-size: 16px;
`

const Link = styled.TouchableOpacity`
    margin-top: 15px;
    align-items: center;
`

const LinkText = styled.Text`
    color: #2c3639;
    text-align: center;
    font-weight: bold;
`

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login, pending, error: authError } = useAuth()

    const handleSubmit = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs')
            return
        }

        try {
            await login(username, password)
            Alert.alert('Succès', 'Connexion réussie!')
            navigation.navigate('Home')
        } catch (err) {
            Alert.alert('Erreur', err.message || 'Erreur de connexion')
        }
    }

    return (
        <LoginWrapper>
            <LoginCard>
                <Title>Connexion</Title>

                <Input
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChangeText={setUsername}
                    editable={!pending}
                />
                <Input
                    placeholder="Mot de passe"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    editable={!pending}
                />

                {authError ? (
                    <Title style={{ color: 'red', fontSize: 14 }}>{authError}</Title>
                ) : null}

                <Button onPress={handleSubmit} disabled={pending}>
                    <ButtonText>{pending ? 'Connexion...' : 'Se connecter'}</ButtonText>
                </Button>

                <Link onPress={() => navigation.replace('Register')} disabled={pending}>
                    <Text>Pas encore de compte ?</Text>
                    <LinkText>Créer un compte</LinkText>
                </Link>
            </LoginCard>
        </LoginWrapper>
    )
}