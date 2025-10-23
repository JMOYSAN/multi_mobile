import { useRef } from 'react'
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { useUsers } from '../hooks/useUsers'
import { useAuth } from '../context/AuthContext'

function LigneUtilisateur({ utilisateur, estUtilisateurActuel }) {
    const { nom, statut, avatar } = utilisateur
    const initiale = nom?.[0]?.toUpperCase() ?? '?'

    return (
        <View style={[styles.utilisateurLigne, estUtilisateurActuel && styles.moi]}>
            <View style={[styles.statut, styles[`statut${statut}`]]} />
            {avatar ? (
                <Image
                    style={styles.avatar}
                    source={{ uri: avatar }}
                    accessibilityLabel={`Avatar de ${nom}`}
                />
            ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarText}>{initiale}</Text>
                </View>
            )}
            <Text style={styles.nom}>{nom}</Text>
        </View>
    )
}

export default function RealUtilisateurScreen() {
    const scrollViewRef = useRef(null)
    const { currentUser } = useAuth()
    const { normalizedUsers, loadMoreUsers, hasMore, pending } = useUsers()

    const usersRef = useRef(normalizedUsers)
    usersRef.current = normalizedUsers

    const handleScroll = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
        const lastUtilisateur = usersRef.current[usersRef.current.length - 1]

        if (!lastUtilisateur || !hasMore || pending) return

        const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >= contentSize.height - 5

        if (isCloseToBottom) {
            loadMoreUsers(lastUtilisateur.id)
        }
    }

    return (
        <ScrollView
            ref={scrollViewRef}
            style={styles.container}
            onScroll={handleScroll}
            scrollEventThrottle={400}
        >
            {normalizedUsers.map((u) => (
                <LigneUtilisateur
                    key={u.id}
                    utilisateur={u}
                    estUtilisateurActuel={u.nom === currentUser?.username}
                />
            ))}
            {pending && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#2c3639" />
                    <Text style={styles.loading}>Chargement...</Text>
                </View>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dcd7c9',
    },
    utilisateurLigne: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    moi: {
        backgroundColor: '#f0f7ff',
    },
    statut: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    statutonline: {
        backgroundColor: '#4caf50',
    },
    statutoffline: {
        backgroundColor: '#9e9e9e',
    },
    statutaway: {
        backgroundColor: '#ff9800',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    avatarPlaceholder: {
        backgroundColor: '#2196f3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    nom: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    loadingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    loading: {
        marginLeft: 10,
        color: '#666',
        fontStyle: 'italic',
    },
})