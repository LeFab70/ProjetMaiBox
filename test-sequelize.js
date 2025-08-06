const { sequelize, User, Message, ReceptionMessage, Contact, Dossier, PieceJointe } = require('./models');

async function testSequelize() {
  console.log('🧪 Test de Sequelize et des modèles...\n');

  try {
    // Test de connexion
    console.log('1. Test de connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie !');

    // Test de synchronisation
    console.log('\n2. Test de synchronisation des modèles...');
    await sequelize.sync({ alter: true });
    console.log('✅ Modèles synchronisés avec succès !');

    // Générer un email unique pour le test
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;

    // Test de création d'un utilisateur
    console.log('\n3. Test de création d\'un utilisateur...');
    const testUser = await User.create({
      nom: 'Test',
      prenom: 'User',
      email: testEmail,
      mot_de_passe: 'password123',
      telephone_mobile: '1234567890'
    });
    console.log('✅ Utilisateur créé:', testUser.get({ plain: true }));

    // Test de récupération d'un utilisateur
    console.log('\n4. Test de récupération d\'un utilisateur...');
    const foundUser = await User.findByEmail(testEmail);
    console.log('✅ Utilisateur trouvé:', foundUser ? 'Oui' : 'Non');

    // Test de création d'un dossier
    console.log('\n5. Test de création d\'un dossier...');
    const testDossier = await Dossier.create({
      nom: 'Test Dossier',
      proprietaire_id: testUser.id
    });
    console.log('✅ Dossier créé:', testDossier.get({ plain: true }));

    // Test de création d'un message
    console.log('\n6. Test de création d\'un message...');
    const testMessage = await Message.create({
      expediteur_id: testUser.id,
      objet: 'Test Message',
      contenu: 'Ceci est un message de test',
      statut: 'ENVOYE'
    });
    console.log('✅ Message créé:', testMessage.get({ plain: true }));

    // Test de création d'une réception de message
    console.log('\n7. Test de création d\'une réception de message...');
    const testReception = await ReceptionMessage.create({
      message_id: testMessage.id,
      destinataire_id: testUser.id,
      etat: 'RECU',
      dossier_id: testDossier.id
    });
    console.log('✅ Réception créée:', testReception.get({ plain: true }));

    // Test de récupération avec associations
    console.log('\n8. Test de récupération avec associations...');
    const messagesWithUser = await Message.findAll({
      include: [{
        model: sequelize.models.User,
        as: 'expediteur',
        attributes: ['id', 'nom', 'prenom', 'email']
      }]
    });
    console.log('✅ Messages avec expéditeur récupérés:', messagesWithUser.length);

    // Test de récupération de réceptions avec associations
    const receptionsWithDetails = await ReceptionMessage.findAll({
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
      ]
    });
    console.log('✅ Réceptions avec détails récupérées:', receptionsWithDetails.length);

    // Nettoyage des données de test
    console.log('\n9. Nettoyage des données de test...');
    await ReceptionMessage.destroy({ where: { id: testReception.id } });
    await Message.destroy({ where: { id: testMessage.id } });
    await Dossier.destroy({ where: { id: testDossier.id } });
    await User.destroy({ where: { id: testUser.id } });
    console.log('✅ Données de test supprimées');

    console.log('\n🎉 Tous les tests Sequelize ont réussi !');
    console.log('✅ La base de données et les modèles fonctionnent correctement');

  } catch (error) {
    console.error('\n❌ Erreur lors des tests Sequelize:', error.message);
    if (error.name === 'SequelizeValidationError') {
      console.error('Erreurs de validation:', error.errors.map(e => `${e.path}: ${e.message}`));
    }
    console.error('Stack trace:', error.stack);
  } finally {
    // Fermer la connexion
    await sequelize.close();
    console.log('\n🔌 Connexion à la base de données fermée');
  }
}

// Exécuter les tests
testSequelize(); 