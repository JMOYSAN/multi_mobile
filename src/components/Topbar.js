import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TopBar = ({ currentGroupe, participants = [], onClose }) => {
    const groupeName = currentGroupe?.name || 'Discussion';
    const count = participants.length;

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>←</Text>
            </TouchableOpacity>

            <View style={styles.info}>
                <Text style={styles.groupeName}>{groupeName}</Text>
                <Text style={styles.participants}>
                    {count} participant{count > 1 ? 's' : ''}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 56,
        backgroundColor: '#f7f7f7',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    closeButton: {
        padding: 6,
    },
    closeText: {
        fontSize: 22,
        color: '#333',
    },
    info: {
        flex: 1,
        marginLeft: 12,
    },
    groupeName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
    },
    participants: {
        fontSize: 14,
        color: '#555',
    },
});

export default TopBar;
