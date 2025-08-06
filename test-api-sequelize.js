const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Test de l\'API MailBox avec Sequelize...\n');

  try {
    // Test 1: Route de base
    console.log('1. Test de la route de base...');
    const baseResponse = await axios.get('http://localhost:3000/');
    console.log('✅ Route de base:', baseResponse.data.message);

    // Test 2: Informations API
    console.log('\n2. Test des informations API...');
    const infoResponse = await axios.get(`${API_BASE_URL}/info`);
    console.log('✅ Informations API:', infoResponse.data.message);

    // Test 3: Inscription d'un utilisateur
    console.log('\n3. Test d\'inscription d\'un utilisateur...');
    const timestamp = Date.now();
    const userData = {
      nom: 'Test',
      prenom: 'User',
      email: `test${timestamp}@example.com`,
      mot_de_passe: 'password123',
      telephone_mobile: '1234567890'
    };

    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    console.log('✅ Utilisateur inscrit:', registerResponse.data.message);

    // Test 4: Connexion
    console.log('\n4. Test de connexion...');
    const loginData = {
      email: userData.email,
      mot_de_passe: userData.mot_de_passe
    };

    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
    const token = loginResponse.data.token;
    console.log('✅ Connexion réussie:', loginResponse.data.message);

    // Configuration des headers avec le token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Test 5: Récupération du profil
    console.log('\n5. Test de récupération du profil...');
    const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, { headers });
    console.log('✅ Profil récupéré:', profileResponse.data.data.nom);

    // Test 6: Création d'un dossier
    console.log('\n6. Test de création d\'un dossier...');
    const dossierData = {
      nom: 'Test Dossier'
    };

    const dossierResponse = await axios.post(`${API_BASE_URL}/dossiers`, dossierData, { headers });
    console.log('✅ Dossier créé:', dossierResponse.data.message);

    // Test 7: Récupération des dossiers
    console.log('\n7. Test de récupération des dossiers...');
    const dossiersResponse = await axios.get(`${API_BASE_URL}/dossiers`, { headers });
    console.log('✅ Dossiers récupérés:', dossiersResponse.data.data.length, 'dossier(s)');

    // Test 8: Création d'un message
    console.log('\n8. Test de création d\'un message...');
    const messageData = {
      objet: 'Test Message',
      contenu: 'Ceci est un message de test',
      destinataires: [profileResponse.data.data.id], // Envoyer à soi-même pour le test
      statut: 'ENVOYE'
    };

    const messageResponse = await axios.post(`${API_BASE_URL}/messages`, messageData, { headers });
    console.log('✅ Message créé:', messageResponse.data.message);

    // Test 9: Récupération des messages envoyés
    console.log('\n9. Test de récupération des messages envoyés...');
    const messagesResponse = await axios.get(`${API_BASE_URL}/messages`, { headers });
    console.log('✅ Messages envoyés récupérés:', messagesResponse.data.data.length, 'message(s)');

    // Test 10: Récupération des messages reçus
    console.log('\n10. Test de récupération des messages reçus...');
    const receptionsResponse = await axios.get(`${API_BASE_URL}/receptions`, { headers });
    console.log('✅ Messages reçus récupérés:', receptionsResponse.data.data.length, 'message(s)');

    // Test 11: Statistiques des messages
    console.log('\n11. Test des statistiques des messages...');
    const statsResponse = await axios.get(`${API_BASE_URL}/messages/stats`, { headers });
    console.log('✅ Statistiques récupérées:', statsResponse.data.data);

    console.log('\n🎉 Tous les tests de l\'API ont réussi !');
    console.log('✅ L\'API fonctionne correctement avec Sequelize, Joi et Swagger');

  } catch (error) {
    console.error('\n❌ Erreur lors des tests de l\'API:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Attendre un peu que le serveur démarre
setTimeout(() => {
  testAPI();
}, 2000); 