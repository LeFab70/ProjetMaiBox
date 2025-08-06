const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Test de base pour vérifier que l'API fonctionne
async function testAPI() {
  try {
    console.log('🧪 Test de l\'API MailBox...\n');

    // Test 1: Route de base
    console.log('1. Test de la route de base...');
    const baseResponse = await axios.get(`${API_BASE_URL}/`);
    console.log('✅ Route de base:', baseResponse.data.message);

    // Test 2: Informations de l'API
    console.log('\n2. Test des informations de l\'API...');
    const infoResponse = await axios.get(`${API_BASE_URL}/info`);
    console.log('✅ Informations API:', infoResponse.data.data.name);

    // Test 3: Inscription d'un utilisateur de test
    console.log('\n3. Test d\'inscription...');
    const registerData = {
      nom: 'Test',
      prenom: 'User',
      email: 'test@mailbox.com',
      mot_de_passe: 'test123',
      telephone_mobile: '1234567890'
    };

    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
    console.log('✅ Inscription réussie:', registerResponse.data.message);

    // Test 4: Connexion
    console.log('\n4. Test de connexion...');
    const loginData = {
      email: 'test@mailbox.com',
      mot_de_passe: 'test123'
    };

    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
    console.log('✅ Connexion réussie:', loginResponse.data.message);

    const token = loginResponse.data.data.token;

    // Test 5: Récupération du profil
    console.log('\n5. Test de récupération du profil...');
    const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profil récupéré:', profileResponse.data.data.user.email);

    // Test 6: Création d'un dossier
    console.log('\n6. Test de création d\'un dossier...');
    const dossierData = { nom: 'Test Dossier' };
    const dossierResponse = await axios.post(`${API_BASE_URL}/dossiers`, dossierData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Dossier créé:', dossierResponse.data.message);

    // Test 7: Récupération des dossiers
    console.log('\n7. Test de récupération des dossiers...');
    const dossiersResponse = await axios.get(`${API_BASE_URL}/dossiers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Dossiers récupérés:', dossiersResponse.data.data.dossiers.length, 'dossier(s)');

    // Test 8: Statistiques
    console.log('\n8. Test des statistiques...');
    const statsResponse = await axios.get(`${API_BASE_URL}/messages/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Statistiques récupérées');

    console.log('\n🎉 Tous les tests sont passés avec succès !');
    console.log('\n📋 Résumé:');
    console.log('- API fonctionnelle');
    console.log('- Authentification JWT opérationnelle');
    console.log('- CRUD des dossiers fonctionnel');
    console.log('- Gestion des profils utilisateur opérationnelle');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Assurez-vous que le serveur est démarré avec: npm run dev');
    }
  }
}

// Exécuter les tests
testAPI(); 