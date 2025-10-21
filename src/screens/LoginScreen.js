import {useState} from 'react'
import styled from 'styled-components/native'
import {Alert, Text} from 'react-native'

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

export default function LoginScreen({navigation}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = () => {
        if (!username.trim() || !password.trim()) {
            setError('Veuillez remplir tous les champs')
            return
        }
        setError('')

        fetch('http://10.105.0.18:3000/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password}),
        })
            .then((res) =>
                res.json().then((data) => ({status: res.status, body: data}))
            )
            .then(({status, body}) => {
                if (status !== 200) {
                    setError(body.error || 'Erreur inconnue')
                } else {
                    navigation.navigate('Chat', {user: body.user})
                }
            })
            .catch((err) => {
                console.error(err)
                setError('Erreur serveur')
            })
    }

    return (
        <LoginWrapper>
            <LoginCard>
                <Title>Connexion</Title>

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

                {error ? (
                    <Title style={{color: 'red', fontSize: 14}}>{error}</Title>
                ) : null}

                <Button onPress={handleSubmit}>
                    <ButtonText>Se connecter</ButtonText>
                </Button>

                <Link onPress={() => navigation.replace('Register')}>
                    <Text>Pas encore de compte ?</Text>
                    <LinkText>Créer un compte</LinkText>
                </Link>
            </LoginCard>
        </LoginWrapper>
    )
}
