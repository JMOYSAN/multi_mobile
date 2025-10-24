import { useCallback, useEffect, useState } from 'react'
import {
    listUsers,
    fetchNextUsers,
    normalizeUser,
} from '../services/userService.js'

export function useUsers() {
    const [utilisateurs, setUtilisateurs] = useState([])
    const [pending, setPending] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    const runWithPending = useCallback(async (task) => {
        setPending(true)
        try {
            return await task()
        } finally {
            setPending(false)
        }
    }, [])

    // Charger les utilisateurs au montage
    useEffect(() => {
        runWithPending(() => listUsers())
            .then((users) => setUtilisateurs(users))
            .catch((err) => console.error('Erreur chargement utilisateurs:', err))
    }, [runWithPending])

    const loadMoreUsers = useCallback(
        async (lastUserId) => {
            if (!hasMore || !lastUserId) return

            const nextUsers = await runWithPending(() => fetchNextUsers(lastUserId))

            if (nextUsers.length === 0) {
                setHasMore(false)
            } else {
                setUtilisateurs((prev) => [...prev, ...nextUsers])
            }
        },
        [hasMore, runWithPending]
    )

    const normalizedUsers = utilisateurs.map(normalizeUser)

    return {
        utilisateurs,
        normalizedUsers,
        setUtilisateurs,
        loadMoreUsers,
        hasMore,
        pending,
    }
}
