import React, { useEffect, useState, useCallback } from 'react'
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Button,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from 'react-native'
import {useGroups}  from '../hooks/useGroups'

export default function UtilisateursScreen({ navigation }) {
    const currentUser = { id: 1, nom: 'UserDemo' } // replace with your auth context if you have one

    const {
        groupes,
        joinGroupe,
        loadMoreGroups,
        loadGroupMembers,
        pending,
    } = useGroups(currentUser)

    const [isRefreshing, setIsRefreshing] = useState(false)
    const handleJoin = useCallback(
        async (groupe) => {
            Alert.alert(
                'Rejoindre le groupe',
                `Voulez-vous rejoindre ${groupe.nom || groupe.name}?`,
                [
                    { text: 'Annuler', style: 'cancel' },
                    {
                        text: 'Oui',
                        onPress: async () => {
                            try {
                                await joinGroupe(groupe.id);
                                Alert.alert('Succès', `Vous avez rejoint ${groupe.nom}`);


                                navigation.navigate('ChatScreen', {
                                    currentGroupe: groupe,
                                    currentUser,
                                });
                            } catch (err) {
                                console.error('Erreur join:', err);
                                Alert.alert('Erreur', 'Impossible de rejoindre le groupe');
                            }
                        },
                    },
                ]
            );
        },
        [joinGroupe, navigation, currentUser]
    );


    const handleRefresh = async () => {
        setIsRefreshing(true)
        await loadMoreGroups('public')
        await loadMoreGroups('private')
        setIsRefreshing(false)
    }

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

                {pending && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

                <View style={{ marginTop: 30 }}>
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
})
