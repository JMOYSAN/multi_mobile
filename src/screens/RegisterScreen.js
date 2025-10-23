import { useState } from 'react'
import styled from 'styled-components/native'
import { Text, Alert } from 'react-native'
import { useAuth } from '../context/AuthContext'

const RegisterWrapper = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #2c3639;
`

const RegisterCard = styled.View({
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

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [localError, setLocalError] = useState('')
    const { register, pending, error: authError } = useAuth()

    const handleSubmit = async () => {
        setLocalError('')

        if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
            setLocalError('Veuillez remplir tous les champs')
            return
        }

        if (password !== confirmPassword) {
            setLocalError('Les mots de passe ne correspondent pas')
            return
        }

        try {
            await register(username, password)
            Alert.alert('Succès', 'Compte créé avec succès!', [
                {
                    text: 'OK',
                    onPress: () => navigation.replace('Login'),
                },
            ])
        } catch (err) {
            setLocalError(err.message || "Erreur lors de l'inscription")
        }
    }

    const displayError = localError || authError

    return (
        <RegisterWrapper>
            <RegisterCard>
                <Title>Inscription</Title>

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
                <Input
                    placeholder="Confirmer le mot de passe"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    editable={!pending}
                />

                {displayError ? (
                    <Title style={{ color: 'red', fontSize: 14 }}>{displayError}</Title>
                ) : null}

                <Button onPress={handleSubmit} disabled={pending}>
                    <ButtonText>{pending ? 'Inscription...' : "S'inscrire"}</ButtonText>
                </Button>

                <Link onPress={() => navigation.replace('Login')} disabled={pending}>
                    <Text>Vous avez déjà un compte ?</Text>
                    <LinkText>Se connecter</LinkText>
                </Link>
            </RegisterCard>
        </RegisterWrapper>
    )
}