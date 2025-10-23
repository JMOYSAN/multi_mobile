import { useState, useCallback } from 'react'
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Button,
    Alert,
    ActivityIndicator,
    StyleSheet,
    RefreshControl,
} from 'react-native'
import { useGroups } from '../hooks/useGroups'
import { useAuth } from '../context/AuthContext'

export default function UtilisateursScreen({ navigation }) {
    const { currentUser } = useAuth()
    const { groupes, joinGroupe, loadMoreGroups, pending } = useGroups(currentUser)
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
                                await joinGroupe(groupe.id)
                                Alert.alert('Succès', `Vous avez rejoint ${groupe.nom || groupe.name}`)
                            } catch (err) {
                                console.error('Erreur join:', err)
                                Alert.alert('Erreur', 'Impossible de rejoindre le groupe')
                            }
                        },
                    },
                ]
            )
        },
        [joinGroupe]
    )

    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            await Promise.all([loadMoreGroups('public'), loadMoreGroups('private')])
        } finally {
            setIsRefreshing(false)
        }
    }

    const handleScroll = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
        const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >= contentSize.height - 20

        if (isCloseToBottom && !pending && !isRefreshing) {
            loadMoreGroups('public')
            loadMoreGroups('private')
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                onScroll={handleScroll}
                scrollEventThrottle={400}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                }
            >
                <Text style={styles.sectionTitle}>Groupes publics</Text>
                {groupes.public.length > 0 ? (
                    groupes.public.map((g) => (
                        <TouchableOpacity
                            key={`pub-${g.id}`}
                            style={styles.groupItem}
                            onPress={() => handleJoin(g)}
                        >
                            <Text style={styles.groupName}>{g.nom || g.name}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.emptyText}>Aucun groupe public</Text>
                )}

                <Text style={styles.sectionTitle}>Groupes privés</Text>
                {groupes.private.length > 0 ? (
                    groupes.private.map((g) => (
                        <TouchableOpacity
                            key={`priv-${g.id}`}
                            style={styles.groupItem}
                            onPress={() => handleJoin(g)}
                        >
                            <Text style={styles.groupName}>{g.nom || g.name}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.emptyText}>Aucun groupe privé</Text>
                )}

                {pending && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#2c3639" />
                    </View>
                )}

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
    emptyText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        marginBottom: 10,
    },
    loadingContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
})