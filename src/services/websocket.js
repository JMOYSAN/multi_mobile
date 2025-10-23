import { WS_URL } from '@env'

let socket

export function connectWS(userId, onMessage) {
    if (socket && socket.readyState === WebSocket.OPEN) return socket
    socket = new WebSocket(`${WS_URL}?user=${userId}`)

    socket.onopen = () => console.log('[WS] Connected')
    socket.onclose = () => console.log('[WS] Closed')
    socket.onerror = (e) => console.error('[WS] Error', e)
    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            onMessage && onMessage(data)
        } catch (err) {
            console.error('[WS] Bad message', err)
        }
    }

    return socket
}

export function sendWS(data) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data))
    }
}

export function closeWS() {
    if (socket) socket.close()
}
