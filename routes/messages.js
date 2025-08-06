const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticateToken } = require('../middlewares/auth');
const { validate, validateQuery, validateParams } = require('../middlewares/validation');

// Authentification obligatoire pour toutes les routes
router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Gestion des messages
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Créer et envoyer un nouveau message
 *     tags: [Messages]
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
 *               - contenu
 *             properties:
 *               destinataire_id:
 *                 type: integer
 *                 example: 2
 *               contenu:
 *                 type: string
 *                 example: "Bonjour, comment vas-tu ?"
 *               objet:
 *                 type: string
 *                 example: "Sujet du message"
 *               brouillon:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Message envoyé avec succès
 */
router.post('/', validate('createMessage'), messageController.createMessage);

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Récupérer tous les messages envoyés
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des messages envoyés
 */
router.get('/', validateQuery('pagination'), messageController.getSentMessages);

/**
 * @swagger
 * /messages/stats:
 *   get:
 *     summary: Obtenir les statistiques des messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques de l'utilisateur
 */
router.get('/stats', messageController.getMessageStats);

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     summary: Récupérer un message spécifique
 *     tags: [Messages]
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
 *         description: Détail du message
 *       404:
 *         description: Message non trouvé
 */
router.get('/:id', validateParams('idParam'), messageController.getSentMessage);

/**
 * @swagger
 * /messages/{id}:
 *   put:
 *     summary: Mettre à jour un message brouillon
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               objet:
 *                 type: string
 *               contenu:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message mis à jour
 */
router.put('/:id', validateParams('idParam'), validate('updateMessage'), messageController.updateMessage);

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     summary: Supprimer un message (mise en corbeille)
 *     tags: [Messages]
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
 *         description: Message supprimé (corbeille)
 */
router.delete('/:id', validateParams('idParam'), messageController.deleteMessage);

/**
 * @swagger
 * /messages/{id}/permanent:
 *   delete:
 *     summary: Supprimer définitivement un message
 *     tags: [Messages]
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
 *         description: Message supprimé définitivement
 */
router.delete('/:id/permanent', validateParams('idParam'), messageController.deleteMessagePermanent);

/**
 * @swagger
 * /messages/{id}/send:
 *   post:
 *     summary: Envoyer un message enregistré en brouillon
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contenu
 *             properties:
 *               contenu:
 *                 type: string
 *                 example: "Contenu mis à jour du message"
 *     responses:
 *       200:
 *         description: Brouillon envoyé
 */
router.post('/:id/send', validateParams('idParam'), validate('createMessage'), messageController.sendDraft);

module.exports = router;
