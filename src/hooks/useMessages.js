// hooks/useMessages.js
import { useCallback, useEffect, useRef, useState } from 'react'
import {
    fetchMessages,
    fetchOlderMessages,
    sendMessage,
    deleteMessage,
} from '../services/messageService.js'
import { fetchGroupMembers } from '../services/groupService.js'
import { WS_URL } from '@env'

export function useMessages(currentGroupe, currentUser) {
    const [messages, setMessages] = useState([])
    const [members, setMembers] = useState({})
    const [hasMore, setHasMore] = useState(true)
    const [pending, setPending] = useState(false)
    const ws = useRef(null)
    const seenIds = useRef(new Set())

    console.log('Connecting WS to: WS_URL==', WS_URL);

    const runWithPending = useCallback(async (task) => {
        setPending(true)
        try {
            return await task()
        } finally {
            setPending(false)
        }
    }, [])

    useEffect(() => {
        if (!currentGroupe?.id) return
        runWithPending(async () => {
            const users = await fetchGroupMembers(currentGroupe.id)
            const map = {}
            users.forEach((u) => (map[u.id] = u.username || u.nom))
            setMembers(map)
        })
    }, [currentGroupe?.id, runWithPending])

    useEffect(() => {
        if (!currentGroupe?.id) return
        setMessages([])
        setHasMore(true)

        runWithPending(() => fetchMessages(currentGroupe.id, 20))
            .then((data) => {
                setMessages(data)
                if (data.length < 20) setHasMore(false)
            })
            .catch((err) => console.error('Erreur récupération messages:', err))
    }, [currentGroupe?.id, runWithPending])

    const loadMoreMessages = useCallback(async () => {
        if (!hasMore || !currentGroupe?.id || messages.length === 0 || pending)
            return

        const oldestMessage = messages[messages.length - 1]
        const beforeId = oldestMessage.id

        const olderMessages = await runWithPending(() =>
            fetchOlderMessages(currentGroupe.id, beforeId, 20)
        )

        if (olderMessages.length < 20) setHasMore(false)
        if (olderMessages.length > 0)
            setMessages((prev) => [...prev, ...olderMessages])
        return olderMessages
    }, [hasMore, currentGroupe?.id, messages, pending, runWithPending])

    // Envoyer un message

    const send = useCallback(
        async (contenu) => {
            if (!contenu.message?.trim() && !contenu.fichier) return
            if (!currentUser?.id || !currentGroupe?.id) return

            const newMsg = await runWithPending(() =>
                sendMessage(currentUser.id, currentGroupe.id, contenu.message)
            )

            return newMsg
        },
        [currentUser?.id, currentGroupe?.id, runWithPending]
    )


    const remove = useCallback(
        async (id) => {
            try {
                await deleteMessage(id)
                setMessages((prev) => prev.filter((m) => m.id !== id))

                // broadcast delete to others
                if (ws.current?.readyState === WebSocket.OPEN) {
                    ws.current.send(JSON.stringify({ type: 'delete', id }))
                }
            } catch (err) {
                console.error('Erreur suppression message:', err)
            }
        },
        []
    )
    useEffect(() => {
        if (!currentUser?.id) return

        ws.current = new WebSocket(`${WS_URL}?user=${currentUser.id}`)

        ws.current.onopen = () => console.log('[useMessages] WS connected')
        ws.current.onclose = () => console.log('[useMessages] WS closed')
        ws.current.onerror = (err) => console.error('[useMessages] WS error:', err)

        ws.current.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data)
                if (msg.type === "message") {
                    if (seenIds.current.has(msg.id)) return // skip your own
                    seenIds.current.add(msg.id)
                    setMessages((prev) => [msg, ...prev])
                }
            } catch (err) {
                console.error("[useMessages] parse error:", err)
            }
        }



        return () => {
            if (ws.current) {
                ws.current.close()
                ws.current = null
            }
        }
    }, [currentUser?.id, currentGroupe?.id])


    return {
        messages,
        members,
        send,
        loadMoreMessages,
        hasMore,
        pending,
        remove,
    }
}
