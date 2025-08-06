const sequelize = require('../config/database');

// Importer tous les modèles
const User = require('./User');
const Message = require('./Message');
const ReceptionMessage = require('./ReceptionMessage');
const Contact = require('./Contact');
const Dossier = require('./Dossier');
const PieceJointe = require('./PieceJointe');

// Importer et configurer les associations
require('./associations');

// Synchroniser les modèles avec la base de données
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Modèles synchronisés avec la base de données');
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation des modèles:', error.message);
  }
};

module.exports = {
  sequelize,
  User,
  Message,
  ReceptionMessage,
  Contact,
  Dossier,
  PieceJointe,
  syncModels
}; 