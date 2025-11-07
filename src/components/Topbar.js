import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native'
import {leaveGroup} from "../services/groupService";
import {useUsers} from "../hooks/useUsers";
import {addUserToGroup} from "../services/groupService";
import {
    listUsers,
} from '../services/userService.js'

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

    const handleAdd = async () => {
        if (!currentGroupe?.id) return;

        Alert.prompt(
            "Ajouter un membre",
            "Entrez le nom d'utilisateur à ajouter :",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Ajouter",
                    onPress: async (username) => {

                        if (!username?.trim()) return;

                        const users = await listUsers();

                        const user = users.find(
                            (u) => (u.username || u.nom) === username.trim()
                        );

                        if (!user) {
                            setTimeout(() => Alert.alert("Erreur", "Utilisateur introuvable"), 300);

                            return;
                        }

                        try {
                            await addUserToGroup(user.id, currentGroupe.id);

                            setTimeout(() => {

                                Alert.alert("Succès", `${user.username || user.nom} ajouté au groupe`);

                            }, 300);
                        } catch (err) {
                            console.error("Erreur ajout utilisateur:", err);
                            setTimeout(() => {
                                Alert.alert("Erreur", "Impossible d’ajouter cet utilisateur");
                            }, 300);
                        }
                    },
                },
            ],
            "plain-text"
        );
    };




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
            {/* Add button */}
            <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
                <Text style={styles.addText}>Ajouter</Text>
            </TouchableOpacity>
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
    leaveText: { fontSize: 14, color: '#c56464', fontWeight: 'bold' },
    addButton: { padding: 8 },
    addText: { fontSize: 14, color: '#4da532', fontWeight: 'bold' },
})

export default TopBar
