import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TypingIndicator = ({ nom }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{nom} est en train d’écrire...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    text: {
        fontStyle: 'italic',
        fontSize: 14,
        color: '#888',
    },
});

export default TypingIndicator;
