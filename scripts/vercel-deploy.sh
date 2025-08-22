#!/bin/bash

echo "🚀 Déploiement Vercel avec Prisma"

# Vérifier que Prisma est installé
if ! command -v prisma &> /dev/null; then
    echo "📦 Installation de Prisma..."
    npm install -g prisma
fi

# Générer le client Prisma
echo "🔄 Génération du client Prisma..."
prisma generate

# Appliquer les migrations (seulement si DATABASE_URL est définie)
if [ ! -z "$DATABASE_URL" ]; then
    echo "🗄️ Application des migrations..."
    prisma db push --force-reset --accept-data-loss
    echo "✅ Migrations appliquées"
else
    echo "⚠️ DATABASE_URL non définie, migration ignorée"
fi

# Build Next.js
echo "🏗️ Build de l'application..."
next build

echo "✅ Déploiement terminé !"
