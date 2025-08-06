const express = require('express');
const router = express.Router();

// Importer toutes les routes
const authRoutes = require('./auth');
const messageRoutes = require('./messages');
const receptionRoutes = require('./receptions');
const contactRoutes = require('./contacts');
//const dossierRoutes = require('./dossiers');

// Définir les préfixes pour chaque groupe de routes
router.use('/auth', authRoutes);
router.use('/messages', messageRoutes);
router.use('/receptions', receptionRoutes);
router.use('/contacts', contactRoutes);
//router.use('/dossiers', dossierRoutes);

// Route de base pour vérifier que l'API fonctionne
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API MailBox - Backend fonctionnel',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      messages: '/api/messages',
      receptions: '/api/receptions',
      contacts: '/api/contacts',
      //dossiers: '/api/dossiers'
    }
  });
});

// Route pour les informations sur l'API
router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'MailBox API',
      version: '1.0.0',
      description: 'API pour l\'application de messagerie MailBox',
      author: 'Fabrice Kouonang',
      endpoints: {
        authentication: {
          register: 'POST /auth/register',
          login: 'POST /auth/login',
          profile: 'GET /auth/profile',
          updateProfile: 'PUT /auth/profile',
          changePassword: 'PUT /auth/change-password',
          logout: 'POST /auth/logout'
        },
        messages: {
          create: 'POST /messages',
          getAll: 'GET /messages',
          getOne: 'GET /messages/:id',
          update: 'PUT /messages/:id',
          delete: 'DELETE /messages/:id',
          sendDraft: 'POST /messages/:id/send',
          stats: 'GET /messages/stats'
        },
        receptions: {
          getAll: 'GET /receptions',
          getOne: 'GET /receptions/:id',
          markAsRead: 'PUT /receptions/:id/read',
          updateState: 'PUT /receptions/:id/state',
          moveToFolder: 'PUT /receptions/:id/move',
          delete: 'DELETE /receptions/:id',
          stats: 'GET /receptions/stats',
          markAllAsRead: 'POST /receptions/mark-all-read'
        },
        contacts: {
          getAll: 'GET /contacts',
          getOne: 'GET /contacts/:id',
          add: 'POST /contacts',
          delete: 'DELETE /contacts/:id',
          search: 'GET /contacts/search',
          searchUsers: 'GET /contacts/search-users',
          checkStatus: 'GET /contacts/check/:user_id',
          stats: 'GET /contacts/stats'
        },
        dossiers: {
          getAll: 'GET /dossiers',
          getOne: 'GET /dossiers/:id',
          create: 'POST /dossiers',
          update: 'PUT /dossiers/:id',
          delete: 'DELETE /dossiers/:id',
          getMessages: 'GET /dossiers/:id/messages',
          moveMessages: 'POST /dossiers/:id/move-messages',
          stats: 'GET /dossiers/stats'
        }
      }
    }
  });
});

module.exports = router; 