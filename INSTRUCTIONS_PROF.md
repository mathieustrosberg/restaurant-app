# 🚀 Lancement de l'Application Restaurant Docker

## 📋 Contenu du package
- `restaurant-web-image.tar` : Image Docker de l'application web
- `docker-compose.yml` : Configuration d'orchestration
- Ce fichier d'instructions

## ⚡ Démarrage ultra-rapide

### 1. Charger l'image Docker
```bash
docker load -i restaurant-web-image.tar
```

### 2. Lancer l'application complète
```bash
docker-compose up -d
```

### 3. Accéder à l'application
- **Application web** : http://localhost:3000
- **Compte admin** : admin@restaurant.com / Admin123!
- **Dashboard** : http://localhost:3000/dashboard

## 🐳 Services démarrés

| Service | URL | Description |
|---------|-----|-------------|
| Web App | http://localhost:3000 | Application Next.js |
| MySQL | localhost:3306 | Base de données relationnelle |
| MongoDB | localhost:27017 | Base de données NoSQL |

## 📊 Vérification du démarrage

```bash
# Voir l'état des conteneurs
docker-compose ps

# Voir les logs en temps réel
docker-compose logs -f web

# Arrêter tous les services
docker-compose down
```

## 🔧 Architecture technique

- **Multi-stage Docker build** optimisé
- **Orchestration** avec Docker Compose
- **Persistance** des données via volumes
- **Health checks** automatiques
- **Environnement** de production prêt

## 📝 Notes importantes

- L'application attend automatiquement que les bases de données soient prêtes
- Les données sont persistées entre les redémarrages
- Le dossier uploads est configuré avec les bonnes permissions
- Migrations Prisma appliquées automatiquement au démarrage

---
*Image générée automatiquement depuis le Dockerfile multi-étages*
