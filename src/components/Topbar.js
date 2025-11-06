import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native'
import {leaveGroup} from "../services/groupService";


const TopBar = ({
                    currentGroupe,
                    currentUser,
                    participants = [],
                    navigation,
                    onClose,
                }) => {
    const groupeName = currentGroupe?.name || 'Discussion'
    const count = participants.length

    const handleLeave = () => {
        Alert.alert(
            'Quitter le groupe',
            `Voulez-vous quitter ${groupeName} ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Oui',
                    style: 'destructive',
                    onPress: () => {
                        leaveGroup(currentGroupe.id, currentUser.id)
                        navigation.navigate("Groupes")
                    },
                },
            ]
        )
    }

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
            {/* Quit button */}
            <TouchableOpacity onPress={handleLeave} style={styles.leaveButton}>
                <Text style={styles.leaveText}>Quitter</Text>
            </TouchableOpacity>
        </View>
    )
}

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
    closeButton: { padding: 6 },
    closeText: { fontSize: 22, color: '#333' },
    info: { flex: 1, marginLeft: 12 },
    groupeName: { fontSize: 18, fontWeight: '700', color: '#222' },
    participants: { fontSize: 14, color: '#555' },
    /*addButton: { padding: 8, marginRight: 8 },
    addText: { fontSize: 14, color: '#3f4e4f', fontWeight: 'bold' },*/
    leaveButton: { padding: 8 },
    leaveText: { fontSize: 14, color: '#b22222', fontWeight: 'bold' },
})

export default TopBar
