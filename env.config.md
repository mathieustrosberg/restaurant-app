# Configuration des variables d'environnement

Créez un fichier `.env.local` dans le répertoire racine avec le contenu suivant :

```bash
# Base de données MySQL pour Prisma
DATABASE_URL="mysql://app:app@localhost:3306/appdb"

# Base de données MongoDB pour Better Auth
MONGODB_URI="mongodb://localhost:27017/restaurant"
MONGODB_DB="restaurant"

# Better Auth Configuration (IMPORTANT: Changez ces valeurs en production!)
BETTER_AUTH_SECRET="your-super-secret-key-here-minimum-32-chars"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

## Authentification

Le système d'authentification utilise **Better Auth** avec MongoDB.

### Créer le compte administrateur

Après avoir configuré vos variables d'environnement :

```bash
npm run create-admin
```

Cela créera un compte admin avec :
- **Email :** admin@restaurant.com
- **Mot de passe :** Admin123!

### Pages d'authentification

- **Connexion :** `/login`
- **Dashboard protégé :** `/dashboard`

## Pour Docker
Les variables d'environnement sont déjà configurées dans `docker-compose.yml` :
- DATABASE_URL: mysql://app:app@mysql:3306/appdb
- MONGODB_URI: mongodb://mongo:27017/restaurant
