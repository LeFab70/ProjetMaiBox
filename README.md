# MailBox API Backend

Backend REST API pour l'application de messagerie MailBox, construit avec Node.js, Express, Sequelize (ORM), Joi (validation) et Swagger (documentation).

## 🚀 Technologies Utilisées

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM pour MySQL
- **Joi** - Validation de schémas
- **Swagger** - Documentation API
- **JWT** - Authentification
- **bcryptjs** - Hachage des mots de passe
- **MySQL2** - Pilote MySQL

## 📋 Prérequis

- Node.js (v14 ou supérieur)
- MySQL (v8.0 ou supérieur)
- npm ou yarn

## 🛠️ Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   ```bash
   cp config.env.example .env
   ```
   
   Modifier le fichier `.env` avec vos paramètres :
   ```env
   # Configuration de la base de données
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root123@@
   DB_NAME=mailBoxBd
   DB_PORT=3306

   # Configuration du serveur
   PORT=3000
   NODE_ENV=development

   # Configuration JWT
   JWT_SECRET=votre_secret_jwt_tres_securise_ici
   JWT_EXPIRES_IN=24h

   # Configuration CORS
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Créer la base de données**
   ```bash
   mysql -u root -p < database.sql
   ```

5. **Démarrer le serveur**
   ```bash
   # Mode développement
   npm run dev
   
   # Mode production
   npm start
   ```

## 📁 Structure du Projet

```
backend/
├── config/
│   ├── database.js          # Configuration Sequelize
│   └── swagger.js           # Configuration Swagger
├── models/
│   ├── index.js             # Point d'entrée des modèles
│   ├── associations.js      # Associations Sequelize
│   ├── User.js              # Modèle utilisateur
│   ├── Message.js           # Modèle message
│   ├── ReceptionMessage.js  # Modèle réception
│   ├── Contact.js           # Modèle contact
│   ├── Dossier.js           # Modèle dossier
│   └── PieceJointe.js       # Modèle pièce jointe
├── controllers/
│   ├── authController.js    # Contrôleur authentification
│   ├── messageController.js # Contrôleur messages
│   ├── receptionController.js # Contrôleur réceptions
│   ├── contactController.js # Contrôleur contacts
│   └── dossierController.js # Contrôleur dossiers
├── routes/
│   ├── auth.js              # Routes authentification
│   ├── messages.js          # Routes messages
│   ├── receptions.js        # Routes réceptions
│   ├── contacts.js          # Routes contacts
│   └── dossiers.js          # Routes dossiers
├── middlewares/
│   ├── auth.js              # Middleware authentification
│   ├── validation.js        # Middleware validation Joi
│   └── errorHandler.js      # Middleware gestion d'erreurs
├── uploads/                 # Dossier fichiers uploadés
├── server.js                # Point d'entrée application
├── package.json
└── README.md
```

## 🔧 Configuration

### Base de Données

L'application utilise Sequelize comme ORM avec MySQL. La configuration se trouve dans `config/database.js`.

### Validation

La validation est gérée par Joi avec des schémas définis dans `middlewares/validation.js`.

### Documentation

La documentation Swagger est accessible à l'adresse : `http://localhost:3000/api-docs`

## 📚 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/login` - Connexion utilisateur
- `GET /api/auth/profile` - Récupérer profil
- `PUT /api/auth/profile` - Mettre à jour profil
- `POST /api/auth/change-password` - Changer mot de passe
- `GET /api/auth/verify-token` - Vérifier token

### Messages
- `POST /api/messages` - Créer un message
- `GET /api/messages` - Récupérer messages envoyés
- `GET /api/messages/:id` - Récupérer un message
- `PUT /api/messages/:id` - Mettre à jour un message
- `DELETE /api/messages/:id` - Supprimer un message
- `GET /api/messages/stats` - Statistiques messages

### Réceptions
- `GET /api/receptions` - Récupérer messages reçus
- `GET /api/receptions/:id` - Récupérer une réception
- `PUT /api/receptions/:id/read` - Marquer comme lu
- `PUT /api/receptions/:id/state` - Changer état
- `PUT /api/receptions/:id/move` - Déplacer vers dossier
- `DELETE /api/receptions/:id` - Supprimer réception
- `GET /api/receptions/stats` - Statistiques réceptions

### Contacts
- `GET /api/contacts` - Récupérer contacts
- `POST /api/contacts` - Ajouter contact
- `DELETE /api/contacts/:id` - Supprimer contact
- `GET /api/contacts/search` - Rechercher contacts
- `GET /api/contacts/users` - Rechercher utilisateurs
- `GET /api/contacts/stats` - Statistiques contacts

### Dossiers
- `GET /api/dossiers` - Récupérer dossiers
- `POST /api/dossiers` - Créer dossier
- `PUT /api/dossiers/:id` - Mettre à jour dossier
- `DELETE /api/dossiers/:id` - Supprimer dossier
- `GET /api/dossiers/:id/messages` - Messages dans dossier
- `GET /api/dossiers/stats` - Statistiques dossiers

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Incluez le token dans le header Authorization :

```
Authorization: Bearer <votre_token_jwt>
```

## 📝 Validation

Toutes les requêtes sont validées avec Joi selon les schémas définis :

- **Inscription** : nom, prénom, email, mot de passe
- **Connexion** : email, mot de passe
- **Message** : objet, contenu, destinataires
- **Dossier** : nom
- **Contact** : contact_id

## 🧪 Tests

### Test de la base de données
```bash
node test-sequelize.js
```

### Test de l'API
```bash
node test-api-sequelize.js
```

## 📖 Documentation

La documentation complète de l'API est disponible via Swagger UI à l'adresse :
```
http://localhost:3000/api-docs
```

## 🚀 Déploiement

### Variables d'environnement de production
```env
NODE_ENV=production
PORT=3000
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
JWT_SECRET=your-secure-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

### Scripts de démarrage
```bash
# Développement
npm run dev

# Production
npm start
```

## 🔧 Développement

### Ajouter un nouveau modèle

1. Créer le fichier dans `models/`
2. Définir le schéma Sequelize
3. Ajouter les associations dans `models/associations.js`
4. Importer dans `models/index.js`

### Ajouter une nouvelle route

1. Créer le contrôleur dans `controllers/`
2. Créer les routes dans `routes/`
3. Ajouter la validation Joi si nécessaire
4. Monter les routes dans `server.js`

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

## 👨‍💻 Auteur

**Fabrice Kouonang** - [fabrice@mail.com](mailto:fabrice@mail.com)

---

## 🎯 Fonctionnalités Principales

- ✅ Authentification JWT sécurisée
- ✅ Gestion des utilisateurs avec hachage des mots de passe
- ✅ Envoi et réception de messages
- ✅ Gestion des contacts
- ✅ Dossiers personnalisés
- ✅ Pièces jointes
- ✅ Validation robuste avec Joi
- ✅ Documentation automatique avec Swagger
- ✅ ORM Sequelize avec associations
- ✅ Gestion d'erreurs centralisée
- ✅ Pagination et recherche
- ✅ Statistiques et métriques 