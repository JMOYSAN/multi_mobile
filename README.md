# Contrôle 3 – Application mobile de clavardage (5 %)

**Cours :** 420-5A6-ST – A25  
**Date de remise des fichiers :** 23 octobre 2025 à 23h59

---

## 1. Mise en contexte

Après la mise en place du client desktop (Contrôle 1) et de l’API conteneurisée (Contrôle 2), vous devez livrer une application mobile multiplateforme connectée au serveur.  
Cette itération doit démontrer l’expérience complète d’un chat :  
- les utilisateurs s’authentifient avec un jeton **JWT Bearer**  
- accèdent à leurs conversations  
- échangent des messages en **temps réel**  
- synchronisent leur **configuration** sur tous les appareils.

---

## 2. Règles d’équipe inchangées

- Composition, gouvernance Git, communication et calendrier : identiques aux contrôles 1 et 2.  
- Les dépôts `mobile`, `api` et `admin` doivent rester séparés avec gestion de versions (branches, tags).

---

## 3. Livrable application mobile

### Fonctionnalités minimales

1. **Authentification JWT**  
   - Écran de connexion / inscription utilisant les endpoints du serveur (création d’utilisateur, obtention d’un `access_token` + `refresh_token`).

2. **Gestion des salons**  
   - Lister les salons publics/privés accessibles  
   - Rejoindre / quitter un salon  
   - Créer un DM à partir d’un utilisateur

3. **Messages**  
   - Affichage en **temps réel (WebSocket)**  
   - Historique des messages via l’API

4. **Notifications locales**  
   - Badge + notification push pour les nouveaux messages reçus hors focus

5. **Préférences synchronisées**  
   - Thème, langue, configuration d’alertes récupérés / écrits via l’API

---

### Expérience utilisateur

- UI réactive (tactile)  
- Gestion du clavier virtuel  
- Animations légères pour transitions  
- Gestion des erreurs : toasts / dialogues sur échec serveur, expiration de session, perte réseau

---

## 4. Exigences côté serveur

- **Authentification**  
  - Endpoints : `register`, `login`, `refresh`, `logout`  
  - Jetons JWT signés avec durées distinctes pour `access` et `refresh`, stockage sécurisé côté client  
  - Rotation des refresh tokens et liste de révocation conservée en base

- **Chat temps réel**  
  - Canal WebSocket (ou équivalent) émettant :  
    - Nouveaux messages  
    - Suppression de message  
    - Indicateurs « typing »  
    - Présence (connecté / déconnecté) via Redis Pub/Sub

- **Sécurité**  
  - Hachage des mots de passe  
  - Anti brute-force (rate limit)

---

## 5. Exigences client Electron

- **Messages** : Implémentation des messages dans les salons.  
- **Architecture** : Refaire l’architecture pour réutiliser / partager les hooks (ex. React Native avec librairie partageable).

---

## 6. Livrables attendus

1. **Dépôts Git**  
   - `mobile`, `api`, `admin` avec tags versionnés (ex. `mobile-v1.0.0`)

2. **Docker Compose**  
   - Orchestration de l’API, base de données, Redis

3. **Documentation**  
   - README détaillé pour chaque dépôt (setup, scripts, tests, variables d’environnement)  
   - Diagramme d’architecture à jour (mobile + backend + flux temps réel)

---

## 7. Critères d’évaluation

### Partie individuelle (5 pts)

- **Communication (2 pts)** : qualité des comptes-rendus, réponses aux revues, présence aux rencontres  
- **Contribution (3 pts)** : commits / pull requests pertinents, tests, revues livrées dans les délais

### Partie collective (10 pts)

- **Couverture fonctionnelle mobile + backend (3 pts)** : respect des exigences, démo réussie  
- **Qualité technique (1 pt)** : architecture propre, tests, surveillance  
- **Livraison / DevOps (1 pt)** : pipelines, documentation, expérience développeur

---

## 8. Checklist d’acceptation

- Lancement complet via `docker compose up` + commande mobile documentée  
- Authentification JWT fonctionnelle (`login`, `refresh`, `logout`) depuis le mobile  
- Liste des salons + messages synchronisés (**REST + WebSocket**) avec statut « en cours de frappe »  
- Notifications locales reçues lors d’un message entrant hors focus  
- Mode hors ligne : relecture historique + envoi différé après reconnexion

---

### Table des matières

- Mise en contexte  
- Règles d'équipe inchangées  
- Livrable application mobile  
- Exigences côté serveur  
- Exigences client Electron  
- Livrables attendus  
- Critères d'évaluation  
- Checklist d'acceptation







# 📱 Application Mobile de Messagerie 

## 🧩 Présentation générale

Ce projet constitue la **partie mobile** d’une application complète de messagerie en temps réel
L’application permet la communication entre plusieurs utilisateurs, la gestion de groupes publics et privés, l’envoi et la réception de messages, la gestion d’un thème clair/sombre synchronisé avec le backend, ainsi qu’une authentification sécurisée.

### Fonctionnalités principales
- Authentification complète (login, inscription, logout)
- Token JWT et persistance via AsyncStorage
- Messagerie instantanée (via API REST ou WebSocket)
- Groupes publics et privés
- Thème clair/sombre synchronisé avec le backend
- Gestion d’état via React Context
- Interface adaptative pour mobile et web

---

## ⚙️ Installation et configuration

### 1. Prérequis
Avant d’installer le projet, assurez-vous d’avoir :
- Node.js ≥ 18
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Un serveur backend fonctionnel sur Express
- Un simulateur Android/iOS ou l’app Expo Go installée sur téléphone

---

### 2. Installation du projet

```bash
git clone https://github.com/ton-utilisateur/mon-app-chat-mobile.git
cd mon-app-chat-mobile
npm install

npx expo start --tunnel

```

---

### 3. Variables d’environnement

Créez un fichier `.env` à la racine du projet :
mettez votre adresse ip

```env
API_URL=http://10.0.0.33:3000
WS_URL=ws://10.0.0.33:3000
```

⚠️ **Attention :**
- Android Emulator → `10.0.2.2`
- iOS Simulator → `localhost`
- Appareil physique → utilisez votre IP locale (`http://192.168.x.x:3000`)

---

### 4. Scripts

| Commande | Description |
|-----------|-------------|
| `npm start` | Lance le serveur Expo |
| `npm run android` | Lance sur un émulateur Android |
| `npm run ios` | Lance sur un simulateur iOS |
| `npm run web` | Exécute la version web |
| `npm run lint` | Analyse de code |
| `npm run test` | Tests unitaires |

---

## 📂 Structure du projet

```
📦 mon-app-chat-mobile
 ┣ 📂 components/
 ┃ ┣ 📂 messages/
 ┃ ┃ ┣ ChatInput.js
 ┃ ┃ ┣ MessageBubble.js
 ┃ ┃ ┣ MessageBubbleOther.js
 ┃ ┃ ┗ TypingIndicator.js
 ┃ ┣ ThemeToggleButton.js
 ┃ ┗ Topbar.js
 ┣ 📂 context/
 ┃ ┣ AuthContext.js
 ┃ ┗ ThemeContext.js
 ┣ 📂 hooks/
 ┃ ┣ useGroups.js
 ┃ ┗ useMessages.js
 ┣ 📂 screens/
 ┃ ┣ HomeScreen.js
 ┃ ┣ LoginScreen.js
 ┃ ┣ RegisterScreen.js
 ┃ ┣ GroupesScreen.js
 ┃ ┗ ChatScreen.js
 ┣ 📂 services/
 ┃ ┣ authService.js
 ┃ ┣ messageService.js
 ┃ ┣ groupService.js
 ┃ ┗ api.js
 ┣ App.js
 ┣ package.json
 ┗ .env
```

---

## 🔐 Authentification

Gérée par **AuthContext.js** :
- `login()` → appelle `/users/login`
- `register()` → appelle `/users/register`
- Stocke le `token` et l’utilisateur dans **AsyncStorage**
- Ajoute automatiquement le token dans `fetchWithAuth`
- `logout()` → supprime toutes les données locales
- Vérifie la session automatiquement au démarrage

**Flux d’authentification :**
1. L’utilisateur saisit ses identifiants.
2. L’API renvoie les données + le token.
3. Le token est stocké et réutilisé.
4. L’utilisateur reste connecté même après redémarrage.

---

## 💬 Messagerie

### Endpoints
| Méthode | Route | Description |
|----------|--------|-------------|
| GET | `/messages?groupId=1` | Récupère les messages du groupe |
| POST | `/messages` | Envoie un message |
| GET | `/messages/lazy/:groupId?beforeId=X` | Charge les anciens messages |
| GET | `/groups-users/group/:groupId` | Récupère les membres du groupe |

### Envoi de message
La fonction `sendMessage(userId, groupId, content)` envoie un message via `fetchWithAuth` :
```js
export function sendMessage(userId, groupId, content) {
  return fetchWithAuth(`${API_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, group_id: groupId, content })
  }).then(res => res.json());
}
```

### Réception
Les messages sont rechargés via `fetchMessages(groupId)` et affichés dynamiquement dans `ChatScreen`.

---

## 🎨 Gestion des thèmes (clair / sombre)

### Définition des thèmes (`ThemeContext.js`)

```js
export const lightTheme = {
  background: '#F3EEEA',
  text: '#000000',
  primary: '#B0A695',
  messageBackground: '#B0A695',
  messageOtherBackground: '#EBE3D5'
};

export const darkTheme = {
  background: '#2c3639',
  text: '#b38bfa',
  primary: '#a27b5c',
  messageBackground: '#a27b5c',
  messageOtherBackground: '#465554'
};
```

### Fonctionnement
- Le thème de chaque utilisateur est stocké dans `users.theme` (colonne SQL).
- Le **ThemeProvider** charge le thème défini dans le profil utilisateur.
- Le **ThemeToggleButton** :
  1. Met à jour le thème en base via `PUT /users/:id`
  2. Met à jour localement le `ThemeContext`
  3. Rafraîchit l’interface instantanément

### Exemple d’usage :
```js
const { colors } = useTheme();

<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.text }}>Bonjour !</Text>
</View>
```

---

## 🖥️ Écrans

### 🏠 HomeScreen
- Affiche le message d’accueil.
- Montre les boutons de navigation (connexion, groupes, utilisateurs).
- Affiche le bouton de changement de thème si l’utilisateur est connecté.

### 👥 GroupesScreen
- Liste des groupes publics/privés.
- Permet de rejoindre un groupe.
- Redirige vers ChatScreen avec les bons paramètres (`currentUser`, `currentGroupe`).

### 💬 ChatScreen
- Affiche les messages du groupe sélectionné.
- Différencie tes messages (`MessageBubble`) et ceux des autres (`MessageBubbleOther`).
- Permet l’envoi via `ChatInput`.
- Recharge les anciens messages automatiquement.

### ✏️ ChatInput
- Champ de texte et bouton d’envoi.
- Déclenche la fonction `onSend()` du ChatScreen.

---

## 🔄 Cycle de vie des messages

1. L’utilisateur rejoint un groupe.
2. `fetchMessages()` charge les messages depuis l’API.
3. Lorsqu’un message est envoyé :
   - `sendMessage()` est appelé.
   - L’API crée le message et le renvoie.
   - L’interface met à jour la `FlatList`.
4. Lorsqu’un autre utilisateur envoie un message :
   - Le message est reçu via WebSocket (ou rechargé périodiquement).
   - La vue se met à jour.

---

## 🧩 Intégration avec l’API

### Authentification
- `/users/login` → renvoie l’utilisateur et son token.
- `/users/register` → crée un compte.
- `/users/:id` (PUT) → met à jour le thème ou le statut.

### Groupes
- `/groups` → liste les groupes
- `/groups-users` → ajoute ou supprime des membres
- `/groups-users/group/:id` → récupère les membres d’un groupe

### Messages
- `/messages` → envoie un message
- `/messages/:groupId` → récupère les messages

---

## 🧪 Tests manuels

1. Démarrer le backend :  
   `npm run dev` (dans le dossier du serveur)
2. Démarrer l’app mobile :  
   `npx expo start`
3. Ouvrir sur deux appareils différents avec deux utilisateurs.
4. Rejoindre le même groupe.
5. Envoyer des messages et vérifier leur affichage instantané.

---

## 🧰 Dépannage

| Problème | Cause probable | Solution |
|-----------|----------------|-----------|
| `Network request failed` | Mauvaise IP ou localhost sur mobile | Remplacer `localhost` par ton IP locale dans `.env` |
| Messages inversés | `FlatList` inversée | Utiliser `inverted` ou inverser l’ordre du tableau |
| Thème ne change pas | Mauvaise propagation du contexte | Vérifier que `ThemeProvider` englobe `RootNavigator` |
| Token expiré | Session non rafraîchie | Relancer la connexion utilisateur |
| Aucun message reçu | Mauvaise route ou problème CORS | Vérifier le backend et `fetchWithAuth` |

---

## 🚀 Séquence de démarrage

```bash
# Backend
cd server
npm run dev

# Frontend mobile
cd mobile
npx expo start
```

Scannez le QR code avec **Expo Go** ou ouvrez le simulateur.

---

## 📘 Conclusion

Ce projet fournit une base complète pour une application mobile moderne et connectée :
- Authentification sécurisée
- Messagerie fonctionnelle
- Thèmes synchronisés
- Persistance et UX fluide

Il est facilement extensible pour ajouter :
- Notifications push
- WebSocket natif
- Système d’amis
- Profil utilisateur complet
- Mode hors ligne

💡 **But du projet** : servir de fondation solide pour un écosystème complet React Native + Node.js en environnement temps réel.
