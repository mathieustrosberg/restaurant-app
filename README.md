# 🍽️ Restaurant App - Système de Gestion

Une application web moderne pour la gestion complète d'un restaurant, développée avec Next.js 15, TypeScript, et MongoDB.

## ✨ Fonctionnalités

### 🏠 Site Web Public
- **Page d'accueil** responsive avec sections dynamiques
- **Hero Section** configurable avec titre et sous-titre
- **Bannière d'information** éditable
- **Section menu** avec gestion par catégories (Entrées, Plats, Desserts)
- **Section image highlight** avec couleurs personnalisables
- **Design moderne** avec animations GSAP et Tailwind CSS

### 🔐 Dashboard Admin
- **Authentification sécurisée** avec Better Auth
- **Gestion de contenu** en temps réel
- **Éditeur de menu** par catégories avec ajout/modification/suppression
- **Gestionnaire de newsletter** (interface préparée)
- **Interface moderne** avec shadcn/ui components
- **Navigation intuitive** avec sidebar responsive

### 🛠️ Technologies

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- GSAP animations
- Lucide React icons

**Backend:**
- Next.js API Routes
- Better Auth pour l'authentification
- MongoDB avec adaptateur natif
- Validation avec Zod

**DevTools:**
- ESLint configuration
- TypeScript strict mode
- Turbopack pour le développement

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- MongoDB (local ou Atlas)
- npm ou yarn

### Configuration

1. **Cloner le projet**
```bash
git clone <repository-url>
cd restaurant-app
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Variables d'environnement**
Créer un fichier `.env.local` :
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/restaurant_app
MONGODB_DB=restaurant_app

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Admin par défaut
ADMIN_EMAIL=admin@loon-garden.com
ADMIN_PASSWORD=your-secure-password
```

4. **Initialiser la base de données**
```bash
# Créer l'utilisateur admin
npm run create-admin

# Initialiser le contenu par défaut
npm run init-content
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
restaurant-app/
├── app/                    # App Router Next.js
│   ├── api/               # Routes API
│   │   ├── auth/          # Authentification
│   │   └── content/       # Gestion du contenu
│   ├── dashboard/         # Interface admin
│   ├── login/            # Page de connexion
│   └── page.tsx          # Page d'accueil
├── components/            # Composants React
│   ├── dashboard/        # Composants du dashboard
│   ├── ui/              # Composants UI de base
│   └── [sections]/      # Sections de la page d'accueil
├── lib/                  # Utilitaires et configuration
│   ├── hooks/           # Hooks React personnalisés
│   ├── auth.ts          # Configuration Better Auth
│   ├── content.ts       # Types et fonctions MongoDB
│   └── utils.ts         # Utilitaires généraux
├── scripts/              # Scripts d'initialisation
├── public/              # Assets statiques
└── middleware.ts        # Middleware d'authentification
```

## 🔧 Scripts Disponibles

```bash
# Développement avec Turbopack
npm run dev

# Build de production
npm run build

# Démarrer en production
npm run start

# Linting
npm run lint

# Créer un utilisateur admin
npm run create-admin

# Initialiser le contenu par défaut
npm run init-content
```

## 💾 Base de Données

### Collections MongoDB

**pageContent** - Contenu dynamique des pages
```typescript
{
  heroSection: {
    title: string
    subtitle: string
    highlightText: string
  }
  infoBanner: {
    text: string
  }
  imageHighlight: {
    mainColor: string
    overlayColor: string
    opacity: number
  }
  menuSection: {
    title: string
    subtitle: string
    highlightText: string
    description: string
    items: MenuItem[]
  }
}
```

**users** - Utilisateurs (géré par Better Auth)

**sessions** - Sessions (géré par Better Auth)

## 🔐 Authentification

Le système utilise Better Auth avec :
- Authentification par email/mot de passe
- Sessions sécurisées avec cookies
- Middleware de protection pour `/dashboard`
- Accès admin restreint à `admin@loon-garden.com`

## 🎨 Personnalisation

### Thème et Couleurs
Les couleurs sont configurables via :
- Tailwind CSS classes
- Variables CSS custom
- Interface d'administration pour les sections

### Contenu
Tout le contenu est modifiable via le dashboard :
- Textes et titres
- Menu et plats
- Couleurs et styles
- Images highlight

## 🚢 Déploiement

### Vercel (Recommandé)
1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Docker
```bash
# Build de l'image
docker build -t restaurant-app .

# Lancer avec docker-compose
docker-compose up -d
```

## 🤝 Contribution

1. Fork du projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit des changements (`git commit -m 'Add some amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation des technologies utilisées
- Vérifier la configuration des variables d'environnement

## 🔮 Roadmap

- [ ] Système de réservations
- [ ] Intégration service email pour newsletter
- [ ] Gestion des commandes en ligne
- [ ] Statistiques avancées
- [ ] Mode multi-restaurant
- [ ] API publique pour intégrations tierces
