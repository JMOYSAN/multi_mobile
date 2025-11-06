import {fetchWithAuth} from './authService.js'
import {API_URL} from '@env'

export function listPublicGroups() {
    return fetchWithAuth(`${API_URL}/api/groups/public`).then((res) => {
        if (!res.ok) {
            throw new Error('Erreur lors de la récupération des groupes publics')
        }
        return res.json()
    })
}

export function fetchGroupMembers(groupId) {
    return fetchWithAuth(`${API_URL}/api/groups-users/group/${groupId}`).then(
        (res) => {
            if (!res.ok) {
                throw new Error('Erreur récupération membres du groupe')
            }
            return res.json()
        }
    )
}

export function listPrivateGroups(userId) {
    return fetchWithAuth(`${API_URL}/api/groups/private/${userId}`).then((res) => {
        if (!res.ok) {
            throw new Error('Erreur lors de la récupération des groupes privés')
        }
        return res.json()
    })
}

export function fetchNextGroups(type, lastGroupId, limit = 20) {
    return fetchWithAuth(
        `${API_URL}/api/groups/next/${type}/${lastGroupId}?limit=${limit}`
    ).then((res) => {
        if (!res.ok) {
            throw new Error(`Erreur HTTP ${res.status}`)
        }
        return res.json()
    })
}

export function createGroup(name, isPrivate) {
    return fetchWithAuth(`${API_URL}/api/groups`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: name.trim(),
            is_private: isPrivate ? 1 : 0,
        }),
    }).then((res) => {
        if (!res.ok) {
            return res.json().then((err) => {
                throw new Error(err.error || 'Erreur création groupe')
            })
        }
        return res.json()
    })
}

export function addUserToGroup(userId, groupId) {
    return fetchWithAuth(`${API_URL}/api/groups-users`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userId, groupId}),
    }).then((res) => {
        if (!res.ok) {
            return res.json().then((err) => {
                throw new Error(err.error || "Erreur lors de l'ajout au groupe")
            })
        }
        return res.json()
    })
}

export function leaveGroup(groupId, userId) {
    return fetchWithAuth(`${API_URL}/api/groups-users/`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            userId: userId,
            groupId: groupId,
        })
    }).then((res) => {
        if (!res.ok) {
            return res.json().then((err) => {
                throw new Error(err.error || "Erreur lors de la suppression du user du groupe")
            })
        }
        return res.json()
    })
}

export function getGroupMembers(groupId) {
    return fetchWithAuth(`${API_URL}/api/groups-users/group/${groupId}`).then(
        (res) => {
            if (!res.ok) {
                throw new Error('Erreur lors de la récupération des membres')
            }
            return res.json()
        }
    )
}


export function normalizeGroup(groupe, index = 0) {
    return {
        id: groupe.id ?? index,
        nom: groupe.name ?? `Groupe${index}`,
        type: groupe.is_private ? 'private' : 'public',
    }
}
