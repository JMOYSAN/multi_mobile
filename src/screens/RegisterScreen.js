import {useState} from 'react'
import styled from 'styled-components/native'
import {StyleSheet, Text} from "react-native";
import { API_URL } from '@env'
import {useAuth} from "../context/AuthContext";
import {login} from "../services/authService";

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
    shadowOffset: {width: 0, height: 2},
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

export default function RegisterScreen({navigation}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const { register,login } = useAuth()
    const handleSubmit = async () => {
        setError('')
        setSuccess('')

        if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('Veuillez remplir tous les champs')
            return
        }

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas')
            return
        }
        await register(username, password);

        await login(username, password)
        navigation.navigate('Home')

    }


    return (
        <RegisterWrapper>
            <RegisterCard>
                <Title>Inscription</Title>

                <Input
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChangeText={setUsername}
                />
                <Input
                    placeholder="Mot de passe"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <Input
                    placeholder="Confirmer le mot de passe"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                {error ? (
                    <Title style={styles.error}>{error}</Title>
                ) : null}
                {success ? (
                    <Title style={styles.success}>{success}</Title>
                ) : null}

                <Button onPress={handleSubmit}>
                    <ButtonText>S'inscrire</ButtonText>
                </Button>

                <Link onPress={() => navigation.replace('Login')}>
                    <Text>Vous avez déja un compte ?</Text>
                    <LinkText>Se connecter</LinkText>
                </Link>
            </RegisterCard>
        </RegisterWrapper>
    )
}


const styles = StyleSheet.create({
    error: {
        color: 'red',
        fontSize: 14
    },
    success: {
        color: 'green',
        fontSize: 14
    }
});
