const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'mailBoxBd',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'root123@@',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Test de connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données MySQL établie avec Sequelize');
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
  }
};

testConnection();

module.exports = sequelize; 