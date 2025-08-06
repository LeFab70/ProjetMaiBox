const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PieceJointe = sequelize.define('PieceJointe', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  message_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Message',
      key: 'id'
    }
  },
  nom_fichier: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  chemin_fichier: {
    type: DataTypes.STRING(500),
    allowNull: false
  }
}, {
  tableName: 'PieceJointe',
  timestamps: false
});

// Méthodes statiques
PieceJointe.findByMessage = async function(message_id) {
  return await this.findAll({
    where: { message_id }
  });
};

PieceJointe.delete = async function(id) {
  const pieceJointe = await this.findByPk(id);
  if (!pieceJointe) return false;
  
  await pieceJointe.destroy();
  return true;
};

PieceJointe.deleteByMessage = async function(message_id) {
  const deletedCount = await this.destroy({
    where: { message_id }
  });
  return deletedCount;
};

PieceJointe.countByMessage = async function(message_id) {
  return await this.count({
    where: { message_id }
  });
};

PieceJointe.exists = async function(id) {
  const count = await this.count({
    where: { id }
  });
  return count > 0;
};

PieceJointe.updateChemin = async function(id, nouveau_chemin) {
  const pieceJointe = await this.findByPk(id);
  if (!pieceJointe) return false;
  
  pieceJointe.chemin_fichier = nouveau_chemin;
  await pieceJointe.save();
  return true;
};

module.exports = PieceJointe; 