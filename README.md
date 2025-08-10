# 🍽️ Restaurant App - Projet Bachelor CNDT

Application web moderne pour la gestion d'un restaurant, développée avec Next.js 15, TypeScript, et Tailwind CSS.

## 🚀 Fonctionnalités

- **Page d'accueil** avec présentation du restaurant
- **Menu interactif** avec gestion des plats
- **Système de réservation** en ligne
- **Newsletter** pour les clients
- **Contact** et support client
- **Dashboard administrateur** pour la gestion
- **Politique de cookies** et mentions légales
- **Architecture Docker** pour le déploiement

## 🛠️ Technologies utilisées

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Base de données**: MySQL (Prisma) + MongoDB (Mongoose)
- **Déploiement**: Docker, Docker Compose
- **Outils**: ESLint, Prettier

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Docker et Docker Compose (optionnel)

## 🔧 Installation et configuration

### 1. Cloner le projet

```bash
git clone https://github.com/mathieustrosberg/restaurant-app.git
cd restaurant-app
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de l'environnement

Copiez le fichier d'exemple et configurez vos variables :

```bash
cp .env.example .env.local
```

Modifiez `.env.local` avec vos valeurs :

```env
DATABASE_URL="mysql://username:password@localhost:3306/restaurant_db"
MONGODB_URI="mongodb://localhost:27017/restaurant"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Initialiser la base de données

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer et appliquer les migrations
npx prisma migrate dev --name init
```

### 5. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🐳 Déploiement avec Docker

### Démarrage rapide

```bash
# Construire et lancer tous les services
docker compose up -d --build

# Voir les logs de l'application
docker compose logs -f web

# Initialiser la base de données (première fois)
docker compose exec web npx prisma migrate dev --name init

# Accéder à l'application
# http://localhost:3000
```

### Commandes utiles

```bash
# Arrêter les services
docker compose down

# Réinitialiser les données (supprime les volumes)
docker compose down -v

# Reconstruire les images
docker compose build --no-cache
```

### Variables d'environnement Docker

Les variables suivantes sont automatiquement configurées via `docker-compose.yml` :

```env
DATABASE_URL="mysql://app:app@mysql:3306/appdb"
MONGODB_URI="mongodb://mongo:27017/restaurant"
```

## 📁 Structure du projet

```
restaurant-app/
├── app/                    # Pages et API routes (App Router)
│   ├── api/               # Routes API
│   ├── components/        # Composants spécifiques aux pages
│   ├── dashboard/         # Interface d'administration
│   └── ...
├── components/            # Composants UI réutilisables
│   └── ui/               # Composants de base (shadcn/ui)
├── lib/                  # Utilitaires et configurations
│   ├── mongo/            # Configuration MongoDB
│   └── prisma.ts         # Configuration Prisma
├── hooks/                # Hooks React personnalisés
├── prisma/               # Schéma et migrations
├── public/               # Assets statiques
└── docker-compose.yml    # Configuration Docker
```

## 🔄 Scripts disponibles

```bash
npm run dev          # Lancer en mode développement
npm run build        # Construire pour la production
npm run start        # Lancer en mode production
npm run lint         # Vérifier le code avec ESLint
npm run prisma:generate  # Générer le client Prisma
```

## 🎯 Fonctionnalités détaillées

### Interface utilisateur
- Page d'accueil responsive avec présentation
- Menu avec catégories et descriptions des plats
- Formulaire de réservation avec validation
- Newsletter avec gestion des abonnements
- Page de contact avec informations

### Administration
- Dashboard pour gérer les réservations
- Gestion du contenu dynamique
- Système d'upload d'images
- Gestion des paramètres du site

### Conformité
- Politique de cookies conforme RGPD
- Mentions légales complètes
- Politique de confidentialité

## 📞 Support

Pour toute question ou problème, n'hésitez pas à ouvrir une issue sur le repository GitHub.

## 📄 Licence

Ce projet est développé dans le cadre du Bachelor CNDT.

---

**Auteur**: Mathieu Strosberg  
**Projet**: Bachelor CNDT  
**Technologies**: Next.js, TypeScript, Tailwind CSS, Prisma, MongoDB