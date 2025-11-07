# Bobberchat - Application Mobile

## Vue d'ensemble

Application mobile cross-platform (iOS et Android) pour la messagerie instantanée Bobberchat, construite avec React Native et Expo.

**Fonctionnalités principales:**
- Authentification JWT (login/register)
- Messagerie en temps réel via WebSockets
- Gestion de groupes publics et privés
- Thèmes clair/sombre
- Interface utilisateur native et fluide
- Gestion automatique des tokens (refresh)
- Lazy loading des messages

---

## Architecture technique

### Stack

- **Framework**: React Native 0.81.4
- **Build Tool**: Expo SDK 54
- **Navigation**: React Navigation 7.x (Native Stack)
- **State Management**: React Context API + Custom Hooks
- **Styling**: Styled Components + Expo Linear Gradient
- **Storage**: AsyncStorage + Expo SecureStore
- **Notifications**: Expo Notifications
- **WebSocket**: Native WebSocket API
- **Auth**: JWT (jwt-decode)

### Schéma d'architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile App (iOS/Android)                │
│                                                             │
│  ┌────────────────────────────────────────────────────┐     │
│  │              App.js (Root)                         │     │
│  │  ┌──────────────────────────────────────────────┐  │     │
│  │  │   NavigationContainer (React Navigation)     │  │     │
│  │  │                                              │  │     │
│  │  │   ┌──────────────────────────────────────┐   │  │     │
│  │  │   │   AuthProvider (useAuth)             │   │  │     │
│  │  │   │   - JWT Token Management             │   │  │     │
│  │  │   │   - SecureStore for tokens           │   │  │     │
│  │  │   │   - Auto-refresh logic               │   │  │     │
│  │  │   └──────────────────────────────────────┘   │  │     │
│  │  │                                              │  │     │
│  │  │   ┌──────────────────────────────────────┐   │  │     │
│  │  │   │   ThemeProvider                      │   │  │     │
│  │  │   │   - Dark/Light mode                  │   │  │     │
│  │  │   │   - Persistent theme storage         │   │  │     │
│  │  │   └──────────────────────────────────────┘   │  │     │
│  │  │                                              │  │     │
│  │  │   ┌──────────────────────────────────────┐   │  │     │
│  │  │   │   RootNavigator                      │   │  │     │
│  │  │   │                                      │   │  │     │
│  │  │   │   Auth Stack (if not logged in):     │   │  │     │
│  │  │   │     - LoginScreen                    │   │  │     │
│  │  │   │     - RegisterScreen                 │   │  │     │
│  │  │   │                                      │   │  │     │
│  │  │   │   Main Stack (if logged in):         │   │  │     │
│  │  │   │     - HomeScreen (Dashboard)         │   │  │     │
│  │  │   │     - GroupesScreen (Group List)     │   │  │     │
│  │  │   │     - ChatScreen (Messages)          │   │  │     │
│  │  │   │     - UserScreen (Profile/Settings)  │   │  │     │
│  │  │   └──────────────────────────────────────┘   │  │     │
│  │  └──────────────────────────────────────────────┘  │     │
│  └────────────────────────────────────────────────────┘     │
│                                                             │
│  ┌────────────────────────────────────────────────────┐     │
│  │               Custom Hooks                         │     │
│  │  - useAuth: Authentication state & methods         │     │
│  │  - useMessages: Messages + WebSocket live          │     │
│  │  - useGroups: Groups CRUD                          │     │
│  │  - useUsers: Users list                            │     │
│  └────────────────────────────────────────────────────┘     │
│                                                             │
│  ┌────────────────────────────────────────────────────┐     │
│  │               Services Layer                       │     │
│  │  - authService: Login, register, refresh           │     │
│  │  - messageService: CRUD messages                   │     │
│  │  - groupService: CRUD groups                       │     │
│  │  - userService: CRUD users                         │     │
│  │  - api.js: Base fetch wrapper with auth            │     │
│  └────────────────────────────────────────────────────┘     │
│                                                             │
│  ┌────────────────────────────────────────────────────┐     │
│  │               Components                           │     │
│  │  - Topbar: Navigation header                       │     │
│  │  - ThemeToggleButton: Dark/Light switch            │     │
│  │  - MessageBubble: User's own message               │     │
│  │  - MessageBubbleOther: Other user's message        │     │
│  │  - ChatInput: Message input field                  │     │
│  │  - TypingIndicator: Typing animation               │     │
│  └────────────────────────────────────────────────────┘     │
│                                                             │
│  ┌────────────────────────────────────────────────────┐     │
│  │               Storage                              │     │
│  │  - AsyncStorage: User data, theme, cache           │     │
│  │  - SecureStore: JWT tokens (encrypted)             │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTPS + WebSocket
                       │
┌──────────────────────▼───────────────────────────────────┐
│                  Backend API                             │
│  - REST: https://bobberchat.com/api/*                    │
│  - WebSocket: wss://bobberchat.com/ws                    │
└──────────────────────────────────────────────────────────┘
```

### Flux de navigation

```
App Launch
    │
    ├─→ AuthContext checks SecureStore for token
    │
    ├─→ Token exists & valid?
    │   ├─→ YES → Navigate to Home (Main Stack)
    │   └─→ NO  → Navigate to Login (Auth Stack)
    │
Main Stack:
    HomeScreen (Dashboard)
        ├─→ GroupesScreen (Group List)
        │       └─→ ChatScreen (Messages + WebSocket)
        └─→ UserScreen (Profile/Settings)
                └─→ Logout → Auth Stack (Login)
```

### Flux de données temps réel

```
User A (Mobile)                Backend                 User B (Mobile)
      │                          │                           │
      │  1. Connect WebSocket    │                           │
      ├─────────────────────────→│                           │
      │                          │  2. Connect WebSocket     │
      │                          │←──────────────────────────┤
      │                          │                           │
      │  3. Send message (HTTP)  │                           │
      ├─────────────────────────→│                           │
      │                          │  4. Save to DB            │
      │                          │  5. Redis Pub/Sub         │
      │                          │                           │
      │  6. Broadcast via WS     │                           │
      │←─────────────────────────┤                           │
      │                          ├──────────────────────────→│
      │                          │  7. Receive live message  │
      │  8. Update UI            │                           │
      │  9. Show notification    │  10. Update UI            │
```

---

## Prérequis

### Logiciels requis

- **Node.js**: >= 18.x (recommandé 20.x)
- **npm** ou **yarn**: >= 9.x
- **Expo CLI**: Installation automatique via `npx`
- **Expo Go App**: Pour tests sur device physique
---

## Installation

### 1. Cloner le repository

```bash
git clone https://github.com/JMOYSAN/multi_mobile.git
cd multi_mobile
git checkout master
```

### 2. Installer les dépendances

```bash
npm install
```

Ou avec Yarn:
```bash
yarn install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine:

```env
API_URL=https://bobberchat.com
WS_URL=wss://bobberchat.com/ws
```

> ⚠️ **Important**: Redémarrer le serveur Expo après modification du `.env`

---

## Lancement

### Mode développement

**Démarrer le serveur Expo:**

```bash
npm start
```

Ou:
```bash
npx expo start
```

Ceci ouvre le **Expo Dev Tools** dans le navigateur avec un QR code.

### Lancer sur iOS Simulator

```bash
npm run ios
```

Ou via Expo Dev Tools: Appuyer sur `i`

### Lancer sur Android Emulator

```bash
npm run android
```

Ou via Expo Dev Tools: Appuyer sur `a`

### Lancer sur device physique

1. Installer **Expo Go** sur votre téléphone
2. Scanner le QR code affiché dans le terminal
3. L'app se charge automatiquement

> 💡 **Astuce**: Assurez-vous que votre téléphone et ordinateur sont sur le même réseau Wi-Fi.

### Mode Tunnel (pour réseau différent)

```bash
npx expo start --tunnel
```

Utilise ngrok pour exposer le serveur publiquement.

---

## Configuration

### Variables d'environnement

Fichier `.env`:

```env
# Backend API Base URL
API_URL=https://bobberchat.com

# WebSocket Server URL
WS_URL=wss://bobberchat.com/ws
```

**Utilisation dans le code:**

```javascript
import { API_URL, WS_URL } from '@env';

const response = await fetch(`${API_URL}/api/users`);
const ws = new WebSocket(`${WS_URL}?user=${userId}`);
```
---

## Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm start` | Lance le serveur Expo (Metro bundler) |
| `npm run android` | Lance l'app sur Android emulator/device |
| `npm run ios` | Lance l'app sur iOS simulator |
| `npm run web` | Lance l'app dans le navigateur (web preview) |
| `npm run lint` | Lint le code avec ESLint |
| `npm run lint:fix` | Lint et corrige automatiquement |

### Commandes Expo utiles

```bash
# Clear cache et redémarrer
npx expo start --clear

# Build pour production (EAS Build)
npx eas build --platform android
npx eas build --platform ios

# Soumettre à l'App Store / Play Store
npx eas submit --platform android
npx eas submit --platform ios
```

---

## Tests

### Tests manuels

**Scénarios à tester:**

1. **Authentification:**
   - Inscription avec nouveau compte
   - Login avec compte existant
   - Logout et vérification du clear des tokens

2. **Navigation:**
   - Navigation entre les écrans
   - Retour arrière (back button)

3. **Messagerie:**
   - Envoi de messages
   - Réception en temps réel
   - Scroll infini (lazy loading)

4. **Groupes:**
   - Création de groupe
   - Ajout de membres
   - Switch entre groupes

5. **Thème:**
   - Switch dark/light mode
   - Persistance après redémarrage

### Tests automatisés (à implémenter)

**Framework recommandé:** Jest + React Native Testing Library

```bash
npm install --save-dev @testing-library/react-native jest
```

Exemple de test:

```javascript
// __tests__/LoginScreen.test.js
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen';

test('renders login form', () => {
  const { getByPlaceholderText } = render(<LoginScreen />);
  expect(getByPlaceholderText('Username')).toBeTruthy();
  expect(getByPlaceholderText('Password')).toBeTruthy();
});
```
---

## Guide utilisateur BETA

### Première utilisation

#### Installation

**Via Expo Go (BETA testing):**
1. Installer **Expo Go** depuis l'App Store ou Play Store
2. Scanner le QR code fourni par l'équipe de dev
3. L'app se charge automatiquement

#### Inscription et connexion

1. **Créer un compte:**
   - Lancer l'app
   - Taper sur "S'inscrire" ou "Register"
   - Entrer un nom d'utilisateur unique
   - Choisir un mot de passe sécurisé (min 6 caractères)
   - Taper "Créer un compte"

2. **Se connecter:**
   - Entrer votre nom d'utilisateur
   - Entrer votre mot de passe
   - Taper "Connexion"

> 💡 **Session persistante:** Vous restez connecté même après fermeture de l'app.

---

### Navigation et utilisation

#### Écrans principaux

**1. HomeScreen (Accueil)**
- Vue d'ensemble des groupes récents
- Accès rapide aux conversations actives
- Bouton pour créer un nouveau groupe

**2. GroupesScreen (Groupes)**
- Liste de tous vos groupes (publics + privés)
- Créer un nouveau groupe
- Rejoindre un groupe public
- Voir les membres d'un groupe

**3. ChatScreen (Messagerie)**
- Fil de conversation en temps réel
- Envoi de messages texte
- Scroll infini pour charger l'historique
- Indicateur de frappe (typing)
- Notifications pour nouveaux messages

**4. UserScreen (Profil)**
- Informations du compte
- Changer le thème (clair/sombre)
- Se déconnecter

---

### Fonctionnalités détaillées

#### Envoyer un message

1. Sélectionner un groupe dans la liste
2. Taper votre message dans le champ en bas
3. Appuyer sur le bouton **"Envoyer"** ou touche **Entrée**
4. Le message apparaît instantanément

#### Créer un groupe

1. Aller sur **GroupesScreen**
2. Taper sur **"+ Créer un groupe"**
3. Remplir les informations:
   - Nom du groupe
   - Type: Public ou Privé
   - Ajouter des membres (si privé)
4. Confirmer la création

#### Ajouter des membres à un groupe

1. Ouvrir un groupe
2. Taper sur l'icône **"Membres"** ou **"+"**
3. Sélectionner les utilisateurs à ajouter
4. Confirmer

#### Charger l'historique

- Dans une conversation, **scroller vers le haut**
- Les messages plus anciens se chargent automatiquement
- Continuer à scroller pour charger davantage

#### Changer de thème

1. Aller sur **UserScreen** (profil)
2. Taper sur **"Changer le thème"**
3. Choisir **Mode clair** ou **Mode sombre**
4. Le changement est immédiat et persistant

#### Se déconnecter

1. Aller sur **UserScreen**
2. Taper sur **"Déconnexion"**
3. Vous serez redirigé vers l'écran de connexion

---

### Canaux de support

#### Problèmes techniques

**1. L'app ne se charge pas:**
- Vérifier votre connexion internet
- Fermer complètement l'app et relancer
- Vérifier que l'API backend est accessible

**2. Les messages ne s'envoient pas:**
- Vérifier la connexion réseau
- Se déconnecter et reconnecter

**3. WebSocket se déconnecte:**
- L'app tente de reconnecter automatiquement
- Si échec persistant, redémarrer l'app
- Vérifier que le serveur WebSocket est actif

#### Contact support

- **Email**: bobbertechnician@gmail.com

---

### Limitations BETA

- **Pas de support fichiers/images:** Messages texte uniquement
- **Pas de recherche:** Dans les messages ou groupes
- **Notifications limitées:** Peuvent ne pas fonctionner en arrière-plan sur certains devices
- **Reconnexion WebSocket:** Peut prendre quelques secondes après perte réseau
- **Historique:** Limité à ~1000 messages par groupe
- **Pas de vidéo/audio:** Appels vocaux non supportés
- **Pas d'édition:** Impossible de modifier un message envoyé

---

## Structure du projet

```
src/
├── components/              # Composants UI réutilisables
│   ├── Topbar.js           # Barre de navigation
│   ├── ThemeToggleButton.js # Bouton switch thème
│   └── messages/           # Composants messagerie
│       ├── ChatInput.js     # Input pour envoyer messages
│       ├── MessageBubble.js # Bulle message user
│       ├── MessageBubbleOther.js # Bulle message autres
│       └── TypingIndicator.js # Animation typing
│
├── context/                # React Context (state global)
│   ├── AuthContext.js      # Auth state (user, tokens)
│   └── ThemeContext.js     # Theme state (dark/light)
│
├── hooks/                  # Custom React Hooks
│   ├── useAuth.js          # Hook d'authentification
│   ├── useMessages.js      # Hook messages + WebSocket
│   ├── useGroups.js        # Hook groupes CRUD
│   └── useUsers.js         # Hook utilisateurs
│
├── navigation/             # Navigation React Navigation
│   └── RootNavigator.js    # Stack navigator principal
│
├── screens/                # Écrans de l'app
│   ├── LoginScreen.js      # Écran de connexion
│   ├── RegisterScreen.js   # Écran d'inscription
│   ├── HomeScreen.js       # Écran d'accueil
│   ├── GroupesScreen.js    # Liste des groupes
│   ├── ChatScreen.js       # Conversation/messagerie
│   └── UserScreen.js       # Profil utilisateur
│
├── services/               # Services API
│   ├── api.js              # Fetch wrapper avec auth
│   ├── authService.js      # Login, register, refresh
│   ├── messageService.js   # CRUD messages
│   ├── groupService.js     # CRUD groupes
│   └── userService.js      # CRUD utilisateurs
│
└── utils/                  # Utilitaires
    └── notifications.js    # Gestion notifications push
```

---

## Sécurité et stockage

### Gestion des tokens

**SecureStore (tokens JWT):**
```javascript
import * as SecureStore from 'expo-secure-store';

// Sauvegarder le token
await SecureStore.setItemAsync('accessToken', token);

// Récupérer le token
const token = await SecureStore.getItemAsync('accessToken');

// Supprimer le token
await SecureStore.deleteItemAsync('accessToken');
```

**AsyncStorage (données non-sensibles):**
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sauvegarder user data
await AsyncStorage.setItem('user', JSON.stringify(user));

// Récupérer
const user = JSON.parse(await AsyncStorage.getItem('user'));
```

### Best practices

- **Tokens dans SecureStore uniquement** (encrypted)
- **Ne jamais logger les tokens** en production
- **Auto-refresh transparent** si accessToken expiré
- **Clear storage au logout** pour éviter fuites

---

## Auteurs

- Joaquim Moysan
- Lyam Bathalon
- François Santerre
