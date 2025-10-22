import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const TopBar = ({
                    utilisateurs,
                    currentGroupe,
                    currentUser,
                    setCurrentUser,
                    onClose,
                    setCurrentGroupe,
                    setGroupes,
                }) => {
    const groupeName = currentGroupe?.name || 'Discussion';

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>

            </TouchableOpacity>

            <View style={styles.info}>
                <Text style={styles.groupeName}>{groupeName}</Text>
                <Text style={styles.participants}>
                    {currentGroupe?.participants?.length || 0} participant
                    {currentGroupe?.participants?.length > 1 ? 's' : ''}
                </Text>
            </View>

            {/* You can add buttons or menus here to manage users/groups if needed */}
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
