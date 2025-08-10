# Configuration des variables d'environnement

Créez un fichier `.env.local` dans le répertoire racine avec le contenu suivant :

```bash
# Base de données MySQL pour Prisma
DATABASE_URL="mysql://app:app@localhost:3306/appdb"

# Base de données MongoDB pour Mongoose
MONGODB_URI="mongodb://localhost:27017/restaurant"

# Environment
NODE_ENV="development"
```

## Pour Docker
Les variables d'environnement sont déjà configurées dans `docker-compose.yml` :
- DATABASE_URL: mysql://app:app@mysql:3306/appdb
- MONGODB_URI: mongodb://mongo:27017/restaurant
