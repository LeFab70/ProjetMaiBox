const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  prenom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  mot_de_passe: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  photo_profil: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  telephone_mobile: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'User',
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      if (user.mot_de_passe) {
        user.mot_de_passe = await bcrypt.hash(user.mot_de_passe, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('mot_de_passe')) {
        user.mot_de_passe = await bcrypt.hash(user.mot_de_passe, 10);
      }
    }
  }
});

// Méthodes d'instance
User.prototype.verifyPassword = async function(plainPassword) {
  return await bcrypt.compare(plainPassword, this.mot_de_passe);
};

// Méthodes statiques personnalisées
User.findByEmail = async function(email) {
  return await sequelize.models.User.findOne({ where: { email } });
};

User.findById = async function(id) {
  return await sequelize.models.User.findByPk(id);
};


User.findByIdWithoutPassword = async function(id) {
  return await sequelize.models.User.findByPk(id, {
    attributes: { exclude: ['mot_de_passe'] }
  });
};

User.findAllWithoutPassword = async function() {
  return await sequelize.models.User.findAll({
    attributes: { exclude: ['mot_de_passe'] }
  });
};

User.updateById = async function(id, userData) {
  const user = await sequelize.models.User.findByPk(id);
  if (!user) return false;
  
  await user.update(userData);
  return true;
};

User.changePasswordById = async function(id, newPassword) {
  const user = await sequelize.models.User.findByPk(id);
  if (!user) return false;
  
  user.mot_de_passe = newPassword;
  await user.save();
  return true;
};

User.deleteById = async function(id) {
  const user = await sequelize.models.User.findByPk(id);
  if (!user) return false;
  
  await user.destroy();
  return true;
};

module.exports = User; 