import { fetchWithAuth } from './authService.js'
import { API_URL } from '@env'

export function fetchMessages(groupId, limit = 20) {
    const url = `${API_URL}/api/messages/group/${groupId}/lazy?limit=${limit}`

    return fetchWithAuth(url).then((res) => {
        if (!res.ok) {
            throw new Error('Erreur chargement messages')
        }
        return res.json()
    })
}

export function deleteMessage(id) {
    return fetchWithAuth(`${API_URL}/api/messages/${id}`, {
        method: 'DELETE',
    }).then((res) => {
        if (!res.ok) throw new Error('Erreur suppression message')
        return res.json()
    })
}


export function fetchOlderMessages(groupId, beforeId, limit = 20) {
    const url = `${API_URL}/api/messages/group/${groupId}/lazy?limit=${limit}&beforeId=${beforeId}`

    return fetchWithAuth(url).then((res) => {
        if (!res.ok) {
            throw new Error('Erreur chargement messages anciens')
        }
        return res.json()
    })
}

export async function sendMessage(userId, groupId, content) {
    console.log("📤 sendMessage()", { userId, groupId, content });

    const res = await fetchWithAuth(`${API_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, group_id: groupId, content }),
    });

    console.log("📬 sendMessage() status:", res.status);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}
