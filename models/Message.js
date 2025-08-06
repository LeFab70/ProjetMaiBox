const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  expediteur_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  objet: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: [1, 255]
    }
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date_envoi: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  statut: {
    type: DataTypes.ENUM('CREATED', 'ENVOYE', 'BROUILLON', 'CORBEILLE'),
    defaultValue: 'CREATED'
  }
}, {
  tableName: 'Message',
  timestamps: false
});

// Méthodes statiques
Message.findByExpediteur = async function(expediteur_id) {
  return await this.findAll({
    where: { expediteur_id },
    include: [{
      model: sequelize.models.User,
      as: 'expediteur',
      attributes: ['id', 'nom', 'prenom', 'email']
    }],
    order: [['date_envoi', 'DESC']]
  });
};

Message.findByStatut = async function(expediteur_id, statut) {
  return await this.findAll({
    where: { expediteur_id, statut },
    include: [{
      model: sequelize.models.User,
      as: 'expediteur',
      attributes: ['id', 'nom', 'prenom', 'email']
    }],
    order: [['date_envoi', 'DESC']]
  });
};

Message.updateStatut = async function(id, statut) {
  const message = await this.findByPk(id);
  if (!message) return false;
  
  message.statut = statut;
  await message.save();
  return true;
};

Message.delete = async function(id) {
  const message = await this.findByPk(id);
  if (!message) return false;
  
  message.statut = 'CORBEILLE';
  await message.save();
  return true;
};

Message.deletePermanent = async function(id) {
  const message = await this.findByPk(id);
  if (!message) return false;
  
  await message.destroy();
  return true;
};

Message.findAllWithPagination = async function(expediteur_id, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  
  const { count, rows } = await this.findAndCountAll({
    where: { expediteur_id },
    include: [{
      model: sequelize.models.User,
      as: 'expediteur',
      attributes: ['id', 'nom', 'prenom', 'email']
    }],
    order: [['date_envoi', 'DESC']],
    limit,
    offset
  });
  
  return {
    messages: rows,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
};

module.exports = Message; 