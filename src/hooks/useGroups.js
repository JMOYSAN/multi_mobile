import { useCallback, useEffect, useState, useRef } from 'react'
import {
    listPublicGroups,
    listPrivateGroups,
    fetchNextGroups,
    createGroup,
    addUserToGroup,
    getGroupMembers,
} from '../services/groupService.js'

export function useGroups(currentUser) {
    const [groupes, setGroupes] = useState({ public: [], private: [] })
    const [currentGroupe, setCurrentGroupe] = useState(null)
    const [pending, setPending] = useState(false)

    // Lazy loading state
    const lastLoadedIdRef = useRef({ public: 20, private: 20 })
    const hasMoreRef = useRef({ public: true, private: true })

    const runWithPending = useCallback(async (task) => {
        setPending(true)
        try {
            return await task()
        } finally {
            setPending(false)
        }
    }, [])

    // Initial fetch public groups
    useEffect(() => {
        runWithPending(() => listPublicGroups())
            .then((data) => setGroupes((prev) => ({ ...prev, public: data })))
            .catch((err) => console.error('Erreur fetch groupes publics:', err))
    }, [runWithPending])

    // Initial fetch private groups
    useEffect(() => {
        if (!currentUser?.id) return

        runWithPending(() => listPrivateGroups(currentUser.id))
            .then((data) => setGroupes((prev) => ({ ...prev, private: data })))
            .catch((err) => console.error('Erreur fetch groupes privés:', err))
    }, [currentUser?.id, runWithPending])

    // Lazy loading next groups
    const loadMoreGroups = useCallback(
        async (type) => {
            if (!hasMoreRef.current[type]) return

            const lastId = lastLoadedIdRef.current[type]
            const nextGroups = await runWithPending(() =>
                fetchNextGroups(type, lastId)
            )

            if (nextGroups.length === 0) {
                hasMoreRef.current[type] = false
            } else {
                setGroupes((prev) => ({
                    ...prev,
                    [type]: [
                        ...prev[type],
                        ...nextGroups.filter(
                            (g) => !prev[type].some((existing) => existing.id === g.id)
                        ),
                    ],
                }))
                lastLoadedIdRef.current[type] = nextGroups[nextGroups.length - 1].id
            }
        },
        [runWithPending]
    )

    // Create group
    const creerGroupe = useCallback(
        async (nomGroupe, participantsAjoutes, isPrivate, utilisateurs) => {
            const group = await runWithPending(() =>
                createGroup(nomGroupe, isPrivate)
            )

            await addUserToGroup(currentUser.id, group.id)

            for (const nom of participantsAjoutes) {
                const user = utilisateurs.find((u) => (u.username || u.nom) === nom)
                if (user) await addUserToGroup(user.id, group.id)
            }

            setGroupes((prev) => ({
                ...prev,
                [isPrivate ? 'private' : 'public']: [
                    ...prev[isPrivate ? 'private' : 'public'],
                    { ...group, participants: [] },
                ],
            }))

            return group
        },
        [currentUser, runWithPending]
    )

    // Join group
    const joinGroupe = useCallback(
        async (groupId) => {
            await runWithPending(() => addUserToGroup(currentUser.id, groupId))
            const members = await getGroupMembers(groupId)

            const groupe = [...groupes.public, ...groupes.private].find(
                (g) => g.id === groupId
            )
            if (groupe) setCurrentGroupe({ ...groupe, participants: members })
        },
        [currentUser, groupes, runWithPending]
    )

    // Add member to group
    const addMemberToGroupe = useCallback(
        async (userId, groupId) => {
            await runWithPending(() => addUserToGroup(userId, groupId))
            const members = await getGroupMembers(groupId)

            if (currentGroupe?.id === groupId) {
                setCurrentGroupe((prev) => ({ ...prev, participants: members }))
            }

            setGroupes((prev) => {
                const updateList = (list) =>
                    list.map((g) =>
                        g.id === groupId ? { ...g, participants: members } : g
                    )
                return {
                    public: updateList(prev.public),
                    private: updateList(prev.private),
                }
            })
        },
        [currentGroupe, runWithPending]
    )

    const loadGroupMembers = useCallback(
        async (groupId) => runWithPending(() => getGroupMembers(groupId)),
        [runWithPending]
    )

    return {
        groupes,
        setGroupes,
        currentGroupe,
        setCurrentGroupe,
        creerGroupe,
        joinGroupe,
        addMemberToGroupe,
        loadMoreGroups,
        loadGroupMembers,
        pending,
    }
}
