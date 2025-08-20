# 🍽️ Restaurant App - Projet Bachelor CNDT

Application web moderne pour la gestion d'un restaurant, développée avec Next.js 15, TypeScript, et Tailwind CSS.

## 🚀 Fonctionnalités

- **Page d'accueil** avec présentation dynamique du restaurant
- **Menu interactif** avec gestion des plats par catégories
- **Système de réservation** en ligne avec gestion des créneaux
- **Newsletter** avec gestion des abonnés et désabonnement
- **Contact** avec système de messages et réponses
- **Système d'authentification** sécurisé avec Better Auth
- **Dashboard administrateur** protégé pour la gestion complète
- **Upload d'images** pour le contenu du site
- **Politique de cookies** et mentions légales conformes RGPD
- **Architecture Docker** pour le déploiement

## 🛠️ Technologies utilisées

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI, Lucide Icons
- **Authentification**: Better Auth v1.3.4
- **Base de données**: MySQL (Prisma) + MongoDB (Mongoose)
- **Email**: Resend pour l'envoi d'emails
- **UI Components**: shadcn/ui avec Radix UI primitives
- **Déploiement**: Docker, Docker Compose
- **Outils**: ESLint, TypeScript

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Docker et Docker Compose

## 🔧 Installation

Suivez ces étapes dans l'ordre pour installer et configurer le projet :

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration de l'environnement

```bash
cp env.example .env.local
cp env.example .env
```

### 3. Lancement des services Docker

```bash
docker-compose up -d
```

Cette commande lance :
- MySQL (port 3306)
- MongoDB (port 27017)
- L'application web (port 3000)

### 4. Initialisation de la base de données

```bash
npx prisma db push
npx prisma generate
```

### 5. Lancement de l'application

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🔐 Authentification

Le système d'authentification utilise **Better Auth** avec MongoDB pour la gestion des sessions.

### Créer un compte administrateur

Après avoir configuré l'environnement, créez un compte admin :

```bash
npm run create-admin
```

Cela créera un compte avec :
- **Email** : `admin@restaurant.com`
- **Mot de passe** : `Admin123!`

### Pages d'authentification

- **Connexion** : `/login`
- **Dashboard protégé** : `/dashboard`

## ⚙️ Configuration des variables d'environnement

Le fichier `env.example` contient toutes les variables nécessaires. Voici les principales :

```env
# Base de données (pour développement local)
DATABASE_URL="mysql://app:app@localhost:3306/appdb"
MONGODB_URI="mongodb://localhost:27017/restaurant"

# Configuration d'authentification
BETTER_AUTH_SECRET="votre_secret_auth_ici"
BETTER_AUTH_URL="http://localhost:3000"

# Configuration Resend (obligatoire pour les emails)
RESEND_API_KEY="votre_cle_resend_ici"
```

**Important** : En production, changez impérativement `BETTER_AUTH_SECRET` par une clé de 32 caractères minimum.

## 🐳 Déploiement avec Docker

### Variables d'environnement Docker

Les services Docker sont automatiquement configurés avec :
- **MySQL** : `mysql://app:app@mysql:3306/appdb`
- **MongoDB** : `mongodb://mongo:27017/restaurant`

### Commandes utiles

```bash
# Voir les logs de l'application
docker-compose logs -f web

# Arrêter les services
docker-compose down

# Réinitialiser les données (supprime les volumes)
docker-compose down -v

# Reconstruire les images
docker-compose build --no-cache
```

## 📁 Structure du projet

```
restaurant-app/
├── app/                    # App Router Next.js 15
│   ├── api/               # Routes API
│   │   ├── auth/          # Authentification Better Auth
│   │   ├── menu/          # Gestion du menu
│   │   ├── reservations/  # Gestion des réservations
│   │   ├── newsletter/    # Gestion de la newsletter
│   │   ├── contact/       # Messages de contact
│   │   └── upload/        # Upload d'images
│   ├── components/        # Composants spécifiques aux pages
│   ├── dashboard/         # Interface d'administration
│   ├── home-page/         # Page d'accueil
│   └── login/             # Page de connexion
├── components/            # Composants UI réutilisables
│   ├── ui/               # shadcn/ui components
│   └── login-form.tsx    # Formulaire de connexion
├── lib/                  # Utilitaires et configurations
│   ├── auth.ts           # Configuration Better Auth
│   ├── auth-client.ts    # Client d'authentification
│   ├── prisma.ts         # Configuration Prisma
│   ├── email-service.ts  # Service d'email
│   └── mongo/            # Configuration MongoDB
├── hooks/                # Hooks React personnalisés
├── prisma/               # Schéma et migrations Prisma
│   └── schema.prisma     # Modèles de données
├── public/               # Assets statiques
│   └── uploads/          # Images uploadées
└── scripts/              # Scripts utilitaires
    └── create-admin.js   # Création du compte admin
```

## 🔄 Scripts disponibles

```bash
npm run dev              # Lancer en mode développement (avec Turbopack)
npm run build            # Construire pour la production
npm run start            # Lancer en mode production
npm run lint             # Vérifier le code avec ESLint
npm run prisma:generate  # Générer le client Prisma
npm run create-admin     # Créer un compte administrateur
```

## 🎯 Fonctionnalités détaillées

### Interface utilisateur
- **Page d'accueil responsive** avec contenu dynamique éditable
- **Menu interactif** avec catégories (entrées, plats, desserts)
- **Formulaire de réservation** avec validation et gestion des créneaux
- **Newsletter** avec système d'abonnement/désabonnement
- **Page de contact** avec formulaire de messages

### Administration (Dashboard)
- **Gestion du contenu** : titre, description et image de la page d'accueil
- **Gestion du menu** : ajout/modification/suppression des plats par catégorie
- **Gestion des réservations** : visualisation, confirmation, annulation
- **Gestion de la newsletter** : liste des abonnés, ajout manuel
- **Gestion des messages** : lecture et réponse aux messages de contact
- **Upload d'images** avec prévisualisation
- **Interface responsive** avec sidebar de navigation

### Base de données

**MySQL (Prisma)** :
- `Customer` : Clients du restaurant
- `Reservation` : Réservations avec statuts (PENDING, CONFIRMED, CANCELED)
- `NewsletterSubscriber` : Abonnés à la newsletter
- `Contact` : Messages de contact avec statuts (NEW, READ, REPLIED)

**MongoDB** :
- Gestion des sessions d'authentification (Better Auth)
- Contenu dynamique des pages

### Email et Communication
- **Service d'email** avec Resend
- **Templates d'email** pour les confirmations de réservation
- **Newsletter** avec gestion des envois groupés
- **Réponses automatiques** aux messages de contact

### Conformité et Sécurité
- **Politique de cookies** conforme RGPD
- **Mentions légales** complètes
- **Politique de confidentialité**
- **Authentification sécurisée** avec Better Auth
- **Protection des routes** administrateur
- **Validation des données** côté client et serveur

## 🔧 Dépannage

### Problèmes courants

1. **Erreur de connexion à la base de données** :
   - Vérifiez que Docker est lancé : `docker-compose ps`
   - Vérifiez les variables d'environnement dans `.env.local`

2. **Erreur Prisma** :
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. **Problème d'authentification** :
   - Vérifiez que `BETTER_AUTH_SECRET` est défini
   - Créez un compte admin : `npm run create-admin`

4. **Problème d'upload d'images** :
   - Vérifiez les permissions du dossier `public/uploads`

## 📄 Licence

Ce projet est développé dans le cadre du Bachelor CNDT.

---

**Auteur**: Mathieu Strosberg  
**Projet**: Bachelor CNDT  
**Technologies**: Next.js 15, TypeScript, Tailwind CSS, Better Auth, Prisma, MongoDB