import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MessageBubble({ message, onRemove }) {
    return (
        <View style={styles.container}>
            <View style={styles.bubble}>
                <View style={styles.header}>
                    <Text style={styles.text}>{message.content}</Text>

                    <TouchableOpacity
                        onPress={() => onRemove?.(message.id)}
                        style={styles.deleteButton}
                    >
                        <Text style={styles.deleteText}>✖</Text>
                    </TouchableOpacity>
                </View>

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
        backgroundColor: '#0078fe',
        padding: 10,
        borderRadius: 15,
        borderBottomRightRadius: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 16,
        flexShrink: 1,
    },
    deleteButton: {
        marginLeft: 8,
        paddingHorizontal: 4,
    },
    deleteText: {
        color: '#fff',
        fontSize: 14,
    },
    status: {
        fontSize: 10,
        color: '#d0d0d0',
        marginTop: 2,
        textAlign: 'right',
    },
});
