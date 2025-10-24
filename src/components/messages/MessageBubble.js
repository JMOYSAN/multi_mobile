import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ message }) {
    return (
        <View style={styles.container}>
            <View style={styles.bubble}>
                <Text style={styles.text}>{message.content}</Text>
                {message.pending && <Text style={styles.status}>⏳</Text>}
                {message.error && <Text style={styles.status}>❌</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-end',
        marginVertical: 4,
        marginHorizontal: 10,
        maxWidth: '75%',
    },
    bubble: {
        backgroundColor: '#0078fe', // blue
        padding: 10,
        borderRadius: 15,
        borderBottomRightRadius: 0,
    },
    text: {
        color: '#fff',
        fontSize: 16,
    },
    status: {
        fontSize: 10,
        color: '#d0d0d0',
        marginTop: 2,
        textAlign: 'right',
    },
});
