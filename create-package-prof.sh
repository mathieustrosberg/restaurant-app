#!/bin/bash

echo "🚀 Création du package Docker pour le professeur..."

# Créer le dossier de package
mkdir -p package-prof
cd package-prof

# Copier les fichiers essentiels
echo "📁 Copie des fichiers de configuration..."
cp ../docker-compose.yml .
cp ../INSTRUCTIONS_PROF.md .

# Copier l'image Docker (si elle existe)
if [ -f "../restaurant-web-image.tar" ]; then
    echo "🐳 Copie de l'image Docker..."
    cp ../restaurant-web-image.tar .
else
    echo "⚠️  Image Docker non trouvée. Créer l'image d'abord avec:"
    echo "   docker save -o restaurant-web-image.tar restaurant-app-web:latest"
fi

# Créer l'archive finale
echo "📦 Création de l'archive finale..."
cd ..
tar -czf restaurant-docker-package.tar.gz package-prof/

# Nettoyer
rm -rf package-prof

echo "✅ Package créé : restaurant-docker-package.tar.gz"
echo "📊 Taille du package :"
ls -lh restaurant-docker-package.tar.gz
echo ""
echo "📧 Envoyez restaurant-docker-package.tar.gz à votre professeur"
echo ""
echo "🎯 Instructions pour le prof :"
echo "1. Extraire : tar -xzf restaurant-docker-package.tar.gz"
echo "2. Entrer : cd package-prof"
echo "3. Charger l'image : docker load -i restaurant-web-image.tar"
echo "4. Lancer : docker-compose up -d"
echo "5. Accéder : http://localhost:3000"
