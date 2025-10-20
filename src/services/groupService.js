const API_URL = 'http://localhost:3000'

export function listPublicGroups() {
  return fetch(`${API_URL}/groups/public`).then((res) => {
    if (!res.ok) {
      throw new Error('Erreur lors de la récupération des groupes publics')
    }
    return res.json()
  })
}

export function fetchGroupMembers(groupId) {
  return fetch(`${API_URL}/groups-users/group/${groupId}`).then((res) => {
    if (!res.ok) {
      throw new Error('Erreur récupération membres du groupe')
    }
    return res.json()
  })
}

export function listPrivateGroups(userId) {
  return fetch(`${API_URL}/groups/private/${userId}`).then((res) => {
    if (!res.ok) {
      throw new Error('Erreur lors de la récupération des groupes privés')
    }
    return res.json()
  })
}

export function fetchNextGroups(type, lastGroupId, limit = 20) {
  return fetch(
    `${API_URL}/groups/next/${type}/${lastGroupId}?limit=${limit}`
  ).then((res) => {
    if (!res.ok) {
      throw new Error(`Erreur HTTP ${res.status}`)
    }
    return res.json()
  })
}

export function createGroup(name, isPrivate) {
  return fetch(`${API_URL}/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  return fetch(`${API_URL}/groups-users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, groupId }),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((err) => {
        throw new Error(err.error || "Erreur lors de l'ajout au groupe")
      })
    }
    return res.json()
  })
}

export function getGroupMembers(groupId) {
  return fetch(`${API_URL}/groups-users/group/${groupId}`).then((res) => {
    if (!res.ok) {
      throw new Error('Erreur lors de la récupération des membres')
    }
    return res.json()
  })
}

export function normalizeGroup(groupe, index = 0) {
  return {
    id: groupe.id ?? index,
    nom: groupe.name ?? `Groupe${index}`,
    type: groupe.is_private ? 'private' : 'public',
  }
}
