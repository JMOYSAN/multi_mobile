import { API_URL } from '@env'

export async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
    })
    const data = await res.json()
    return { status: res.status, body: data }
}
