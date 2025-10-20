import {useState} from 'react'
import styled from 'styled-components/native'

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
`

export default function RegisterScreen({navigation}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSubmit = () => {
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

        fetch('http://localhost:3000/users/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password}),
        })
            .then((res) =>
                res.json().then((data) => ({status: res.status, body: data}))
            )
            .then(({status, body}) => {
                if (status !== 201) {
                    setError(body.error || 'Erreur lors de l’inscription')
                } else {
                    setSuccess('Compte créé avec succès !')
                    navigation.replace('Login')
                }
            })
            .catch((err) => {
                console.error(err)
                setError('Erreur serveur')
            })
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
                    <Title style={{color: 'red', fontSize: 14}}>{error}</Title>
                ) : null}
                {success ? (
                    <Title style={{color: 'green', fontSize: 14}}>{success}</Title>
                ) : null}

                <Button onPress={handleSubmit}>
                    <ButtonText>S'inscrire</ButtonText>
                </Button>

                <Link onPress={() => navigation.replace('Login')}>
                    <LinkText>Déjà inscrit ? Se connecter</LinkText>
                </Link>
            </RegisterCard>
        </RegisterWrapper>
    )
}
