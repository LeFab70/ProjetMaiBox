#!/bin/bash

echo "🚀 Démarrage du serveur MailBox en mode développement..."

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Vérifier si le fichier .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env non trouvé. Création d'un fichier .env par défaut..."
    cp config.env.example .env
    echo "✅ Fichier .env créé. Veuillez le configurer selon vos besoins."
fi

# Démarrer le serveur
echo "🌐 Démarrage du serveur sur http://localhost:3000"
echo "📖 Documentation API: http://localhost:3000/api/info"
echo "🧪 Pour tester l'API: node test-api.js"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

npm run dev 