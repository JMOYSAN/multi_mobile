import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ message, mine, author }) {
    return (
        <View style={[styles.row, mine ? styles.rowRight : styles.rowLeft]}>
            <View style={[styles.bubble, mine ? styles.mine : styles.other]}>
                <Text style={styles.author}>{author}</Text>
                <Text style={styles.content}>{message.content}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { marginVertical: 4, flexDirection: 'row' },
    rowLeft: { justifyContent: 'flex-start' },
    rowRight: { justifyContent: 'flex-end' },
    bubble: {
        maxWidth: '78%',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    mine: { backgroundColor: '#DCF8C6', borderTopRightRadius: 4 },
    other: { backgroundColor: '#EEE', borderTopLeftRadius: 4 },
    author: { fontSize: 11, color: '#666', marginBottom: 2 },
    content: { fontSize: 15, color: '#222' },
});
