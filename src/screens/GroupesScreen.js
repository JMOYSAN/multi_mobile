import React, { useState, useCallback } from 'react'
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Button,
    Alert,
    ActivityIndicator,
    StyleSheet,
    TextInput,
} from 'react-native'
import { useGroups } from '../hooks/useGroups'
import {
    createGroup,
    listPublicGroups,
    listPrivateGroups,
} from '../services/groupService'
import {useAuth} from "../context/AuthContext";


export default function GroupesScreen({ navigation }) {
    const {currentUser} = useAuth()
    const {
        groupes,
        joinGroupe,
        loadMoreGroups,
        loadGroupMembers,
        setGroupes,
        pending,
    } = useGroups(currentUser)

    const [isRefreshing, setIsRefreshing] = useState(false)
    const [groupName, setGroupName] = useState('')
    const [creating, setCreating] = useState(false)

    const handleJoin = useCallback(
        async (groupe) => {
            try {
                const members = await loadGroupMembers(groupe.id)
                const alreadyIn =
                    Array.isArray(members) &&
                    members.some((m) => m.id === currentUser.id)

                if (alreadyIn) {
                    console.log(
                        `[GroupesScreen] User ${currentUser.id} already in group ${groupe.id}`
                    )
                    navigation.navigate('ChatScreen', {
                        currentGroupe: groupe,
                        currentUser,
                    })
                    return
                }

                Alert.alert(
                    'Rejoindre le groupe',
                    `Voulez-vous rejoindre ${groupe.nom || groupe.name}?`,
                    [
                        { text: 'Annuler', style: 'cancel' },
                        {
                            text: 'Oui',
                            onPress: async () => {
                                try {
                                    console.log(
                                        `[GroupesScreen] Joining group ${groupe.id}...`
                                    )
                                    await joinGroupe(groupe.id)
                                    Alert.alert(
                                        'Succès',
                                        `Vous avez rejoint ${groupe.nom || groupe.name}`
                                    )
                                    navigation.navigate('ChatScreen', {
                                        currentGroupe: groupe,
                                        currentUser,
                                    })
                                } catch (err) {
                                    console.error('Erreur join:', err)
                                    Alert.alert('Erreur', 'Impossible de rejoindre le groupe')
                                }
                            },
                        },
                    ]
                )
            } catch (err) {
                console.error('Erreur join:', err)
                Alert.alert('Erreur', 'Impossible de vérifier les membres du groupe')
            }
        },
        [joinGroupe, loadGroupMembers, navigation, currentUser]
    );



    const handleRefresh = async () => {
        try {
            setIsRefreshing(true);

            const [publicGroups, privateGroups] = await Promise.all([
                listPublicGroups(),
                currentUser?.id ? listPrivateGroups(currentUser.id) : [],
            ]);

            setGroupes({
                public: publicGroups,
                private: privateGroups,
            });

        } catch (err) {
            console.error('Erreur lors du rafraîchissement:', err);
        } finally {
            setIsRefreshing(false);
        }
    };


    const handleCreateGroup = async () => {
        Alert.prompt(
            "Créer un groupe",
            "Entrez le nom du groupe :",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Suivant",
                    onPress: (groupName) => {
                        if (!groupName?.trim()) return;

                        Alert.alert(
                            "Type de groupe",
                            "Souhaitez-vous que ce groupe soit privé ou public ?",
                            [
                                {
                                    text: "Privé",
                                    onPress: async () => {
                                        try {
                                            await createGroup(groupName.trim(), [currentUser.id], true);
                                            Alert.alert("Succès", `Groupe privé "${groupName}" créé`);

                                            await handleRefresh();
                                        } catch (err) {
                                            console.error("Erreur création groupe:", err);
                                            Alert.alert("Erreur", "Impossible de créer le groupe");
                                        }
                                    },
                                },
                                {
                                    text: "Public",
                                    onPress: async () => {
                                        try {
                                            await createGroup(groupName.trim(), [currentUser.id], false);
                                            Alert.alert("Succès", `Groupe public "${groupName}" créé`);

                                            await handleRefresh();
                                        } catch (err) {
                                            console.error("Erreur création groupe:", err);
                                            Alert.alert("Erreur", "Impossible de créer le groupe");
                                        }
                                    },
                                },
                            ]
                        );
                    },
                },
            ],
            "plain-text"
        );
    };



    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                onMomentumScrollEnd={() => {
                    loadMoreGroups('public')
                    loadMoreGroups('private')
                }}
                refreshControl={
                    <ActivityIndicator animating={isRefreshing || pending} size="small" />
                }
            >
                <Text style={styles.sectionTitle}>Créer un groupe</Text>
                <View style={styles.createRow}>

                    <TouchableOpacity
                        style={[styles.createButton, creating && styles.disabledButton]}
                        onPress={handleCreateGroup}
                        disabled={creating}
                    >
                        <Text style={styles.createButtonText}>
                            {creating ? '...' : 'Créer'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Groupes publics</Text>
                {groupes.public.map((g) => (
                    <TouchableOpacity
                        key={`pub-${g.id}`}
                        style={styles.groupItem}
                        onPress={() => handleJoin(g)}
                    >
                        <Text style={styles.groupName}>{g.nom || g.name}</Text>
                    </TouchableOpacity>
                ))}

                <Text style={styles.sectionTitle}>Groupes privés</Text>
                {groupes.private.map((g) => (
                    <TouchableOpacity
                        key={`priv-${g.id}`}
                        style={styles.groupItem}
                        onPress={() => handleJoin(g)}
                    >
                        <Text style={styles.groupName}>{g.nom || g.name}</Text>
                    </TouchableOpacity>
                ))}

                {pending && <ActivityIndicator size="large" style={styles.activity} />}

                <View style={styles.returnButton}>
                    <Button title="Retour à l'accueil" onPress={() => navigation.navigate('Home')} />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dcd7c9',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#2c3639',
    },
    groupItem: {
        backgroundColor: '#f1f1f1',
        padding: 14,
        borderRadius: 10,
        marginBottom: 10,
    },
    groupName: {
        fontSize: 16,
        color: '#2c3639',
    },
    createButton: {
        backgroundColor: '#3f4e4f',
        borderRadius: 8,
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    returnButton: {
        marginTop:30
    },
    activity: {
        marginTop: 20
    },
    disabledButton: { opacity: 0.6 },
    createButtonText: { color: 'white', fontWeight: 'bold' },
})
