import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL } from '@env'

let accessToken = null
let refreshToken = null

export function setAccessToken(token) {
    accessToken = token
}

export function getAccessToken() {
    return accessToken
}

export async function login(username, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Erreur de connexion')

    accessToken = data.accessToken
    refreshToken = data.refreshToken
    await saveUserToStorage(data.user, data.accessToken, data.refreshToken)

    return { user: data.user, accessToken: data.accessToken }
}

export async function register(username, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (res.status !== 201) throw new Error(data.error)
    return data
}

export async function fetchWithAuth(url, options = {}) {
    if (!accessToken) {
        accessToken = await getAccessTokenFromStorage()
    }

    console.log('🔍 DEBUG fetchWithAuth:')
    console.log('  URL:', url)
    console.log('  Token en mémoire:', accessToken ? 'OUI ✅' : 'NON ❌')

    if (!accessToken) {
        console.error('❌ Pas de token disponible!')
        throw new Error("Token d'accès manquant")
    }

    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
    }

    const res = await fetch(url, { ...options, headers })

    console.log('  Réponse status:', res.status)

    if (res.status === 401) {
        console.log('  ⚠️ 401 reçu, tentative de refresh...')
        const refreshed = await refreshTokenFunc()
        if (refreshed) {
            console.log('  ✅ Token refreshed, nouvelle tentative')
            return fetchWithAuth(url, options)
        }
        console.error('  ❌ Refresh failed')
        throw new Error('Session expirée, veuillez vous reconnecter')
    }

    return res
}

export async function refreshTokenFunc() {
    if (!refreshToken) {
        refreshToken = await getRefreshTokenFromStorage()
    }

    if (!refreshToken) {
        return false
    }

    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    })

    if (!res.ok) {
        await clearUserFromStorage()
        accessToken = null
        refreshToken = null
        return false
    }

    const data = await res.json()
    accessToken = data.accessToken
    refreshToken = data.refreshToken

    await updateTokensInStorage(data.accessToken, data.refreshToken)

    return true
}

export async function logout() {
    if (!refreshToken) {
        refreshToken = await getRefreshTokenFromStorage()
    }

    await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    })

    accessToken = null
    refreshToken = null
    await clearUserFromStorage()
}

export async function listPrivateGroups(userId) {
    const res = await fetchWithAuth(`${API_URL}/groups/private/${userId}`)
    if (!res.ok) throw new Error('Erreur récupération groupes privés')
    return res.json()
}

export async function saveUserToStorage(user, accessTok, refreshTok) {
    try {
        await AsyncStorage.setItem('user', JSON.stringify(user))
        if (accessTok) {
            await AsyncStorage.setItem('accessToken', accessTok)
        }
        if (refreshTok) {
            await AsyncStorage.setItem('refreshToken', refreshTok)
        }
    } catch (err) {
        console.warn("Impossible de sauvegarder l'utilisateur", err)
    }
}

export async function loadUserFromStorage() {
    try {
        const stored = await AsyncStorage.getItem('user')
        return stored ? JSON.parse(stored) : null
    } catch (err) {
        console.warn("Impossible de charger l'utilisateur", err)
        return null
    }
}

export async function getAccessTokenFromStorage() {
    try {
        return await AsyncStorage.getItem('accessToken')
    } catch (err) {
        console.warn('Impossible de charger le token', err)
        return null
    }
}

export async function getRefreshTokenFromStorage() {
    try {
        return await AsyncStorage.getItem('refreshToken')
    } catch (err) {
        console.warn('Impossible de charger le refresh token', err)
        return null
    }
}

export async function updateTokensInStorage(accessTok, refreshTok) {
    try {
        if (accessTok) {
            await AsyncStorage.setItem('accessToken', accessTok)
        }
        if (refreshTok) {
            await AsyncStorage.setItem('refreshToken', refreshTok)
        }
    } catch (err) {
        console.warn('Impossible de mettre à jour les tokens', err)
    }
}

export async function updateAccessTokenInStorage(token) {
    try {
        await AsyncStorage.setItem('accessToken', token)
    } catch (err) {
        console.warn('Impossible de mettre à jour le token', err)
    }
}

export async function clearUserFromStorage() {
    try {
        await AsyncStorage.clear()
    } catch (err) {
        console.warn('Impossible de vider le storage', err)
    }
}

export function updateUserTheme(userId, newTheme) {
    return fetchWithAuth(`${API_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme }),
    }).then((res) => {
        if (!res.ok) {
            throw new Error('Erreur lors de la mise à jour du thème')
        }
        return res.json()
    })
}