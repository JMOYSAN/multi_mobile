import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const MessageBubbleOther = ({ message, members }) => {
    const username = members?.[message.user_id] || 'Inconnu';

    return (
        <View style={styles.container}>
            <Text style={styles.timestamp}>{formatDate(message.created_at)}</Text>
            <View style={styles.bubble}>
                <Text style={styles.username}>{username}</Text>

                {message.content ? (
                    <Text style={styles.messageText}>{message.content}</Text>
                ) : null}

                {message.fichier?.type?.startsWith('image/') && (
                    <Image
                        source={{ uri: message.fichier.url }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                )}

                {message.fichier && !message.fichier.type?.startsWith('image/') && (
                    <Text style={styles.fileLink}>📎 {message.fichier.nom}</Text>
                )}
            </View>
        </View>
    );
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        marginVertical: 4,
        marginHorizontal: 10,
    },
    timestamp: {
        fontSize: 10,
        color: '#aaa',
        marginBottom: 2,
    },
    bubble: {
        backgroundColor: '#f1f0f0',
        padding: 10,
        borderRadius: 12,
        maxWidth: '80%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
    },
    username: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
        color: '#555',
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
    image: {
        marginTop: 8,
        width: 200,
        height: 200,
        borderRadius: 8,
    },
    fileLink: {
        marginTop: 8,
        color: '#007aff',
        textDecorationLine: 'underline',
    },
});

export default MessageBubbleOther;
