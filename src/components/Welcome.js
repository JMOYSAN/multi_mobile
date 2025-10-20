import { View, Text, Button } from 'react-native';

export default function Welcome() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24 }}>Bonjour Expo !</Text>
            <Button title="Cliquer" onPress={() => console.log('tap')} />
        </View>
    );
}
