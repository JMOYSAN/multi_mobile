import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatInput = ({ onSend }) => {
    const [message, setMessage] = useState('');
    const [fichier, setFichier] = useState(null);

    const gererEnvoie = () => {
        if (!message.trim() && !fichier) return;

        const contenu = { message, fichier };
        onSend(contenu);
        setMessage('');
        setFichier(null);
    };

    const handleKeyPress = ({ nativeEvent }) => {
        if (nativeEvent.key === 'Enter' && Platform.OS === 'web') {
            gererEnvoie();
        }
    };

    return (
        <View style={styles.wrapper}>
            <TextInput
                style={styles.input}
                placeholder="Message..."
                value={message}
                onChangeText={setMessage}
                onKeyPress={handleKeyPress}
                multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={gererEnvoie}>
                <Ionicons name="send" size={24} color="#6c6c6c" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        fontSize: 16,
    },
    sendButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatInput;
