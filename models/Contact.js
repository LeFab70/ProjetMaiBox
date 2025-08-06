const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  proprietaire_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  contact_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  }
}, {
  tableName: 'Contact',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['proprietaire_id', 'contact_id']
    }
  ]
});

// Méthodes statiques
Contact.findByProprietaire = async function(proprietaire_id) {
  return await this.findAll({
    where: { proprietaire_id },
    include: [{
      model: sequelize.models.User,
      as: 'contact',
      attributes: ['id', 'nom', 'prenom', 'email', 'telephone_mobile', 'photo_profil']
    }],
    order: [['contact', 'nom', 'ASC'], ['contact', 'prenom', 'ASC']]
  });
};

Contact.findByProprietaireAndContact = async function(proprietaire_id, contact_id) {
  return await this.findOne({
    where: { proprietaire_id, contact_id }
  });
};

Contact.searchContacts = async function(proprietaire_id, searchTerm) {
  return await this.findAll({
    where: { proprietaire_id },
    include: [{
      model: sequelize.models.User,
      as: 'contact',
      attributes: ['id', 'nom', 'prenom', 'email', 'telephone_mobile', 'photo_profil'],
      where: {
        [sequelize.Op.or]: [
          { nom: { [sequelize.Op.like]: `%${searchTerm}%` } },
          { prenom: { [sequelize.Op.like]: `%${searchTerm}%` } },
          { email: { [sequelize.Op.like]: `%${searchTerm}%` } }
        ]
      }
    }],
    order: [['contact', 'nom', 'ASC'], ['contact', 'prenom', 'ASC']]
  });
};

Contact.delete = async function(id) {
  const contact = await this.findByPk(id);
  if (!contact) return false;
  
  await contact.destroy();
  return true;
};

Contact.deleteByProprietaireAndContact = async function(proprietaire_id, contact_id) {
  const contact = await this.findOne({
    where: { proprietaire_id, contact_id }
  });
  if (!contact) return false;
  
  await contact.destroy();
  return true;
};

Contact.countByProprietaire = async function(proprietaire_id) {
  return await this.count({
    where: { proprietaire_id }
  });
};

Contact.isContact = async function(proprietaire_id, contact_id) {
  const count = await this.count({
    where: { proprietaire_id, contact_id }
  });
  return count > 0;
};

module.exports = Contact; 