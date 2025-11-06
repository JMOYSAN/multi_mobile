const API_URL = 'http://localhost:3000'

let accessToken = null


export async function fetchWithAuth(url, options = {}) {
    // Vérifier le token en mémoire d'abord
    if (!accessToken) {
        accessToken = getAccessTokenFromStorage()
    }




    if (!accessToken) {
        console.error('❌ Pas de token disponible!')
        throw new Error("Token d'accès manquant")
    }

    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
    }



    const res = await fetch(url, { ...options, headers, credentials: 'include' })



    if (res.status === 401) {
        console.log('  ⚠️ 401 reçu, tentative de refresh...')
        const refreshed = await refreshToken()
        if (refreshed) {
            console.log('  ✅ Token refreshed, nouvelle tentative')
            return fetchWithAuth(url, options)
        }
        console.error('  ❌ Refresh failed')
        throw new Error('Session expirée, veuillez vous reconnecter')
    }

    return res
}

export async function refreshToken() {
    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
    })

    if (!res.ok) {
        clearUserFromStorage()
        accessToken = null
        return false
    }

    const data = await res.json()
    accessToken = data.accessToken

    updateAccessTokenInStorage(data.accessToken)

    return true
}


export function getAccessTokenFromStorage() {
    if (typeof window === 'undefined') return null
    try {
        return localStorage.getItem('accessToken')
    } catch (err) {
        console.warn('Impossible de charger le token', err)
        return null
    }
}

export function updateAccessTokenInStorage(token) {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem('accessToken', token)
    } catch (err) {
        console.warn('Impossible de mettre à jour le token', err)
    }
}

export function clearUserFromStorage() {
    if (typeof window === 'undefined') return
    localStorage.clear()
}
