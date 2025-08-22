#!/bin/bash

echo "🚀 Démarrage du déploiement Vercel..."

# Vérifier que les variables d'environnement sont configurées
echo "📋 Vérification des variables d'environnement..."
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL non configurée"
    exit 1
fi

if [ -z "$MONGODB_URI" ]; then
    echo "❌ MONGODB_URI non configurée"
    exit 1
fi

if [ -z "$RESEND_API_KEY" ]; then
    echo "❌ RESEND_API_KEY non configurée"
    exit 1
fi

echo "✅ Variables d'environnement OK"

# Générer le client Prisma
echo "🔄 Génération du client Prisma..."
npm run prisma:generate

# Build du projet
echo "🔨 Build du projet..."
npm run build

# Test rapide
echo "🧪 Tests unitaires..."
npm run test

echo "✅ Projet prêt pour le déploiement !"
echo "💡 Lancez 'vercel --prod' pour déployer en production"
