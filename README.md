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
