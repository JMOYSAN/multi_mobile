import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubbleOther({ message }) {
    return (
        <View style={styles.container}>
            <View style={styles.bubble}>
                {message.username && (
                    <Text style={styles.username}>{message.username}</Text>
                )}
                <Text style={styles.text}>{message.content}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
        marginVertical: 4,
        marginHorizontal: 10,
        maxWidth: '75%',
    },
    bubble: {
        backgroundColor: '#e5e5ea', // light gray
        padding: 10,
        borderRadius: 15,
        borderBottomLeftRadius: 0,
    },
    username: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    text: {
        color: '#000',
        fontSize: 16,
    },
});
