const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReceptionMessage = sequelize.define('ReceptionMessage', {
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
  destinataire_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  etat: {
    type: DataTypes.ENUM('RECU', 'LU', 'SUPPRIME', 'ARCHIVE', 'CORBEILLE'),
    defaultValue: 'RECU'
  },
  dossier_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Dossier',
      key: 'id'
    }
  }
}, {
  tableName: 'ReceptionMessage',
  timestamps: false
});

// Méthodes statiques
ReceptionMessage.findByDestinataire = async function(destinataire_id, etat = null) {
  const where = { destinataire_id };
  if (etat) where.etat = etat;
  
  return await this.findAll({
    where,
    include: [
      {
        model: sequelize.models.Message,
        as: 'message',
        include: [{
          model: sequelize.models.User,
          as: 'expediteur',
          attributes: ['id', 'nom', 'prenom', 'email']
        }]
      },
      {
        model: sequelize.models.Dossier,
        as: 'dossier',
        attributes: ['id', 'nom']
      }
    ],
    order: [['message', 'date_envoi', 'DESC']]
  });
};

ReceptionMessage.markAsRead = async function(id) {
  const reception = await this.findByPk(id);
  if (!reception) return false;
  
  reception.etat = 'LU';
  await reception.save();
  return true;
};

ReceptionMessage.updateEtat = async function(id, etat) {
  const reception = await this.findByPk(id);
  if (!reception) return false;
  
  reception.etat = etat;
  await reception.save();
  return true;
};

ReceptionMessage.moveToDossier = async function(id, dossier_id) {
  const reception = await this.findByPk(id);
  if (!reception) return false;
  
  reception.dossier_id = dossier_id;
  await reception.save();
  return true;
};

ReceptionMessage.delete = async function(id) {
  const reception = await this.findByPk(id);
  if (!reception) return false;
  
  reception.etat = 'CORBEILLE';
  await reception.save();
  return true;
};

ReceptionMessage.deletePermanent = async function(id) {
  const reception = await this.findByPk(id);
  if (!reception) return false;
  
  await reception.destroy();
  return true;
};

ReceptionMessage.findAllWithPagination = async function(destinataire_id, page = 1, limit = 10, etat = null) {
  const offset = (page - 1) * limit;
  const where = { destinataire_id };
  if (etat) where.etat = etat;
  
  const { count, rows } = await this.findAndCountAll({
    where,
    include: [
      {
        model: sequelize.models.Message,
        as: 'message',
        include: [{
          model: sequelize.models.User,
          as: 'expediteur',
          attributes: ['id', 'nom', 'prenom', 'email']
        }]
      },
      {
        model: sequelize.models.Dossier,
        as: 'dossier',
        attributes: ['id', 'nom']
      }
    ],
    order: [['message', 'date_envoi', 'DESC']],
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

ReceptionMessage.countUnread = async function(destinataire_id) {
  return await this.count({
    where: { 
      destinataire_id, 
      etat: 'RECU' 
    }
  });
};

module.exports = ReceptionMessage; 