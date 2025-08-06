const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const { syncModels } = require('./models');

// Import des routes
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const receptionRoutes = require('./routes/receptions');
const contactRoutes = require('./routes/contacts');
const dossierRoutes = require('./routes/dossiers');

// Import des middlewares
const { errorHandler, notFound } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware pour servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'MailBox API Documentation'
}));

// Route de base
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue sur l\'API MailBox',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Route d'information sur l'API
app.get('/api/info', (req, res) => {
  res.json({
    success: true,
    message: 'API MailBox - Informations',
    version: '1.0.0',
    description: 'API REST pour l\'application de messagerie MailBox',
    endpoints: {
      auth: '/api/auth',
      messages: '/api/messages',
      receptions: '/api/receptions',
      contacts: '/api/contacts',
      dossiers: '/api/dossiers'
    },
    documentation: '/api-docs'
  });
});

// Montage des routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/receptions', receptionRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/dossiers', dossierRoutes);

// Middleware pour les routes non trouvées
app.use(notFound);

// Middleware de gestion d'erreurs global
app.use(errorHandler);

// Fonction de démarrage du serveur
const startServer = async () => {
  try {
    // Synchroniser les modèles avec la base de données
    await syncModels();
    
    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📚 Documentation disponible sur http://localhost:${PORT}/api-docs`);
      console.log(`🌐 API disponible sur http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error.message);
    process.exit(1);
  }
};

// Démarrer le serveur
startServer();

module.exports = app; 