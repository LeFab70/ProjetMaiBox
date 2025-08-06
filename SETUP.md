# 🚀 Guide de démarrage rapide - MailBox Backend

## ✅ Ce qui a été créé

Votre backend MailBox est maintenant complet avec :

### 📁 Structure du projet
```
backend/
├── config/
│   └── database.js          # Configuration MySQL
├── controllers/
│   ├── authController.js    # Authentification JWT
│   ├── messageController.js # Gestion des messages
│   ├── receptionController.js # Boîte de réception
│   ├── contactController.js # Gestion des contacts
│   └── dossierController.js # Gestion des dossiers
├── middlewares/
│   ├── auth.js              # Authentification JWT
│   ├── validation.js        # Validation des données
│   └── errorHandler.js      # Gestion d'erreurs
├── models/
│   ├── User.js              # Modèle utilisateur
│   ├── Message.js           # Modèle message
│   ├── ReceptionMessage.js  # Modèle réception
│   ├── Contact.js           # Modèle contact
│   ├── Dossier.js           # Modèle dossier
│   └── PieceJointe.js       # Modèle pièces jointes
├── routes/
│   ├── auth.js              # Routes authentification
│   ├── messages.js          # Routes messages
│   ├── receptions.js        # Routes réceptions
│   ├── contacts.js          # Routes contacts
│   ├── dossiers.js          # Routes dossiers
│   └── index.js             # Routes principales
├── server.js                # Serveur Express
├── database.sql             # Script SQL complet
├── test-api.js              # Tests de l'API
└── README.md                # Documentation complète
```

### 🔧 Fonctionnalités implémentées

#### 🔐 Authentification
- ✅ Inscription utilisateur
- ✅ Connexion avec JWT
- ✅ Gestion des profils
- ✅ Changement de mot de passe
- ✅ Middleware d'authentification

#### 📧 Messages
- ✅ Envoi de messages
- ✅ Gestion des brouillons
- ✅ Messages envoyés
- ✅ Suppression (corbeille)
- ✅ Statistiques

#### 📥 Messages reçus
- ✅ Boîte de réception
- ✅ Marquage comme lu
- ✅ Gestion des états
- ✅ Déplacement vers dossiers
- ✅ Statistiques

#### 👥 Contacts
- ✅ Ajout de contacts
- ✅ Liste des contacts
- ✅ Recherche de contacts
- ✅ Recherche d'utilisateurs
- ✅ Gestion des contacts

#### 📁 Dossiers
- ✅ Création de dossiers
- ✅ Gestion des dossiers
- ✅ Messages par dossier
- ✅ Déplacement de messages
- ✅ Statistiques

#### 🛡️ Sécurité
- ✅ Validation des données
- ✅ Gestion d'erreurs
- ✅ Protection des routes
- ✅ Hachage des mots de passe
- ✅ Tokens JWT sécurisés

## 🚀 Démarrage rapide

### 1. Configuration de la base de données
```bash
# Exécuter le script SQL
mysql -u root -p < database.sql
```

### 2. Configuration des variables d'environnement
```bash
# Copier le fichier d'exemple
cp config.env.example .env

# Éditer le fichier .env avec vos paramètres
nano .env
```

### 3. Installation des dépendances
```bash
npm install
```

### 4. Démarrage du serveur
```bash
# Mode développement
npm run dev

# Ou utiliser le script automatique
./start-dev.sh
```

### 5. Test de l'API
```bash
# Dans un autre terminal
node test-api.js
```

## 📡 Endpoints principaux

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur

### Messages
- `POST /api/messages` - Envoyer un message
- `GET /api/messages` - Messages envoyés
- `GET /api/messages/stats` - Statistiques

### Réceptions
- `GET /api/receptions` - Boîte de réception
- `PUT /api/receptions/:id/read` - Marquer comme lu
- `GET /api/receptions/stats` - Statistiques

### Contacts
- `GET /api/contacts` - Liste des contacts
- `POST /api/contacts` - Ajouter un contact
- `GET /api/contacts/search` - Rechercher

### Dossiers
- `GET /api/dossiers` - Liste des dossiers
- `POST /api/dossiers` - Créer un dossier
- `GET /api/dossiers/:id/messages` - Messages du dossier

## 🔍 Test de l'API

L'API inclut un fichier de test complet (`test-api.js`) qui vérifie :
- ✅ Connexion à l'API
- ✅ Inscription et connexion
- ✅ Authentification JWT
- ✅ CRUD des dossiers
- ✅ Gestion des profils

## 📖 Documentation complète

Consultez le fichier `README.md` pour la documentation complète de l'API avec tous les endpoints, exemples de requêtes et réponses.

## 🎯 Prochaines étapes

1. **Tester l'API** avec le fichier `test-api.js`
2. **Configurer votre frontend** pour utiliser ces endpoints
3. **Personnaliser** les fonctionnalités selon vos besoins
4. **Ajouter des tests** unitaires et d'intégration
5. **Déployer** en production

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez que MySQL est démarré
2. Vérifiez la configuration dans `.env`
3. Consultez les logs du serveur
4. Testez avec `node test-api.js`

---

**🎉 Votre backend MailBox est prêt à être utilisé !** 