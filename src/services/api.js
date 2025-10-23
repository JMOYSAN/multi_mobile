import { API_URL } from '@env'

export async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
    })
    const data = await res.json()
    return { status: res.status, body: data }
}

export function login(username, password) {
    return apiFetch('/users/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    })
}

export function register(username, password) {
    return apiFetch('/users/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    })
}

export function getMessages(groupId) {
    return apiFetch(`/messages?groupId=${groupId}`)
}

export function sendMessage(content, user_id, group_id) {
    return apiFetch('/messages', {
        method: 'POST',
        body: JSON.stringify({ content, user_id, group_id }),
    })
}
