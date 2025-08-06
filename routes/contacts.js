const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken } = require('../middlewares/auth');
const { validate, validateQuery, validateParams } = require('../middlewares/validation');

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Récupérer tous les contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste des contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/', validateQuery('pagination'), contactController.getContacts);

/**
 * @swagger
 * /contacts/stats:
 *   get:
 *     summary: Obtenir les statistiques des contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques des contacts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
router.get('/stats', contactController.getContactStats);

/**
 * @swagger
 * /contacts/search:
 *   get:
 *     summary: Rechercher des contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Terme de recherche
 *     responses:
 *       200:
 *         description: Résultats de recherche
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
router.get('/search', validateQuery('search'), contactController.searchContacts);

/**
 * @swagger
 * /contacts/search-users:
 *   get:
 *     summary: Rechercher des utilisateurs à ajouter comme contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Terme de recherche
 *     responses:
 *       200:
 *         description: Résultats des utilisateurs trouvés
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
router.get('/search-users', validateQuery('search'), contactController.searchUsersToAdd);

/**
 * @swagger
 * /contacts/check/{user_id}:
 *   get:
 *     summary: Vérifier si un utilisateur est déjà en contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur à vérifier
 *     responses:
 *       200:
 *         description: Statut du contact
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
router.get('/check/:user_id', validateParams('idParam'), contactController.checkContactStatus);

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Ajouter un nouveau contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - destinataire_id
 *             properties:
 *               destinataire_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Contact ajouté
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Données invalides
 */
router.post('/', validate('addContact'), contactController.addContact);

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Récupérer un contact spécifique
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails du contact
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/:id', validateParams('idParam'), contactController.getContact);

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Supprimer un contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact supprimé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
router.delete('/:id', validateParams('idParam'), contactController.deleteContact);

module.exports = router;
