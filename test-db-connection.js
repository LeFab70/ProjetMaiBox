const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabaseConnection() {
  console.log('🧪 Test de connexion à la base de données...\n');

  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root123@@',
    database: process.env.DB_NAME || 'mailBoxBd',
    port: process.env.DB_PORT || 3306
  };

  console.log('Configuration de connexion:');
  console.log(`- Host: ${dbConfig.host}`);
  console.log(`- User: ${dbConfig.user}`);
  console.log(`- Database: ${dbConfig.database}`);
  console.log(`- Port: ${dbConfig.port}`);
  console.log(`- Password: ${dbConfig.password ? '***' : 'non défini'}\n`);

  try {
    // Test de connexion sans spécifier la base de données
    console.log('1. Test de connexion au serveur MySQL...');
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    console.log('✅ Connexion au serveur MySQL réussie !');

    // Vérifier si la base de données existe
    console.log('\n2. Vérification de l\'existence de la base de données...');
    const [databases] = await connection.execute('SHOW DATABASES');
    const databaseExists = databases.some(db => db.Database === dbConfig.database);

    if (databaseExists) {
      console.log(`✅ Base de données "${dbConfig.database}" trouvée !`);
      
      // Se connecter à la base de données spécifique
      await connection.execute(`USE ${dbConfig.database}`);
      console.log(`✅ Connexion à la base de données "${dbConfig.database}" réussie !`);

      // Vérifier les tables
      console.log('\n3. Vérification des tables...');
      const [tables] = await connection.execute('SHOW TABLES');
      
      if (tables.length > 0) {
        console.log('✅ Tables trouvées:');
        tables.forEach(table => {
          const tableName = Object.values(table)[0];
          console.log(`   - ${tableName}`);
        });
      } else {
        console.log('⚠️  Aucune table trouvée dans la base de données');
        console.log('💡 Vous devez exécuter le script SQL pour créer les tables');
      }

      // Test de requête simple
      console.log('\n4. Test de requête simple...');
      const [users] = await connection.execute('SELECT COUNT(*) as count FROM User');
      console.log(`✅ Requête réussie ! Nombre d'utilisateurs: ${users[0].count}`);

    } else {
      console.log(`❌ Base de données "${dbConfig.database}" non trouvée`);
      console.log('💡 Vous devez créer la base de données avec le script SQL');
    }

    await connection.end();
    console.log('\n🎉 Test de connexion terminé avec succès !');

  } catch (error) {
    console.error('\n❌ Erreur de connexion:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solutions possibles:');
      console.log('1. Vérifiez que MySQL est démarré');
      console.log('2. Vérifiez le port MySQL (par défaut: 3306)');
      console.log('3. Vérifiez les paramètres de connexion dans .env');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Solutions possibles:');
      console.log('1. Vérifiez le nom d\'utilisateur et le mot de passe');
      console.log('2. Vérifiez que l\'utilisateur a les permissions nécessaires');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Solutions possibles:');
      console.log('1. Créez la base de données avec: CREATE DATABASE mailBoxBd;');
      console.log('2. Exécutez le script SQL database.sql');
    }
  }
}

// Exécuter le test
testDatabaseConnection(); 