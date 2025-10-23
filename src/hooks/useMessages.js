import { useState, useEffect, useCallback } from 'react'
import { connectWS, sendWS, closeWS } from '../services/websocket'
import { getMessages, sendMessage } from '../services/api'

export function useMessages(currentGroup, currentUser) {
    const [messages, setMessages] = useState([])
    const [pending, setPending] = useState(false)

    useEffect(() => {
        if (!currentGroup?.id) return
        setPending(true)
        getMessages(currentGroup.id)
            .then(({ body }) => setMessages(body))
            .finally(() => setPending(false))
    }, [currentGroup?.id])

    useEffect(() => {
        if (!currentUser?.id) return
        const ws = connectWS(currentUser.id, (data) => {
            if (data.type === 'message') {
                setMessages((prev) => [...prev, data])
            }
        })
        return closeWS
    }, [currentUser?.id])

    const send = useCallback(
        async (contenu) => {
            if (!contenu.message) return
            await sendMessage(contenu.message, currentUser.id, currentGroup.id)
            sendWS({
                type: 'message',
                user_id: currentUser.id,
                group_id: currentGroup.id,
                content: contenu.message,
                created_at: new Date().toISOString(),
            })
        },
        [currentGroup, currentUser]
    )

    return { messages, pending, send }
}
