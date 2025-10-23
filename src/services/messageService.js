import { fetchWithAuth } from './authService.js'
const API_URL = 'http://10.0.0.33:3000'

export function fetchMessages(groupId, limit = 20) {
    const url = `${API_URL}/messages/group/${groupId}/lazy?limit=${limit}`

    return fetchWithAuth(url).then((res) => {
        if (!res.ok) {
            throw new Error('Erreur chargement messages')
        }
        return res.json()
    })
}

export function fetchOlderMessages(groupId, beforeId, limit = 20) {
    const url = `${API_URL}/messages/group/${groupId}/lazy?limit=${limit}&beforeId=${beforeId}`

    return fetchWithAuth(url).then((res) => {
        if (!res.ok) {
            throw new Error('Erreur chargement messages anciens')
        }
        return res.json()
    })
}

export function sendMessage(userId, groupId, content) {
    return fetchWithAuth(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: userId,
            group_id: groupId,
            content,
        }),
    }).then((res) => {
        if (!res.ok) {
            throw new Error('Erreur envoi message')
        }
        return res.json()
    })
}
