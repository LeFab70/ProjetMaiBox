const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dossier = sequelize.define('Dossier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  proprietaire_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  }
}, {
  tableName: 'Dossier',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['nom', 'proprietaire_id']
    }
  ]
});

// Méthodes statiques
Dossier.findByProprietaire = async function(proprietaire_id) {
  return await this.findAll({
    where: { proprietaire_id },
    order: [['nom', 'ASC']]
  });
};

Dossier.findByNomAndProprietaire = async function(nom, proprietaire_id) {
  return await this.findOne({
    where: { nom, proprietaire_id }
  });
};

Dossier.findByIdWithMessageCount = async function(id) {
  const dossier = await this.findByPk(id, {
    include: [{
      model: sequelize.models.ReceptionMessage,
      as: 'messages',
      attributes: []
    }]
  });
  
  if (dossier) {
    const messageCount = await sequelize.models.ReceptionMessage.count({
      where: { dossier_id: id }
    });
    dossier.dataValues.nombre_messages = messageCount;
  }
  
  return dossier;
};

Dossier.findByProprietaireWithMessageCount = async function(proprietaire_id) {
  const dossiers = await this.findAll({
    where: { proprietaire_id },
    order: [['nom', 'ASC']]
  });
  
  for (const dossier of dossiers) {
    const messageCount = await sequelize.models.ReceptionMessage.count({
      where: { dossier_id: dossier.id }
    });
    dossier.dataValues.nombre_messages = messageCount;
  }
  
  return dossiers;
};

Dossier.update = async function(id, dossierData) {
  const dossier = await this.findByPk(id);
  if (!dossier) return false;
  
  await dossier.update(dossierData);
  return true;
};

Dossier.delete = async function(id) {
  const dossier = await this.findByPk(id);
  if (!dossier) return false;
  
  // Déplacer tous les messages du dossier vers aucun dossier (NULL)
  await sequelize.models.ReceptionMessage.update(
    { dossier_id: null },
    { where: { dossier_id: id } }
  );
  
  // Supprimer le dossier
  await dossier.destroy();
  return true;
};

Dossier.belongsToUser = async function(dossier_id, user_id) {
  const count = await this.count({
    where: { id: dossier_id, proprietaire_id: user_id }
  });
  return count > 0;
};

Dossier.countByProprietaire = async function(proprietaire_id) {
  return await this.count({
    where: { proprietaire_id }
  });
};

module.exports = Dossier; 