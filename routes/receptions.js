/**
 * @swagger
 * tags:
 *   name: Réception
 *   description: Gestion des messages reçus
 */

const express = require('express');
const router = express.Router();
const receptionController = require('../controllers/receptionController');
const { authenticateToken } = require('../middlewares/auth');
const { validate, validateQuery, validateParams } = require('../middlewares/validation');

router.use(authenticateToken);

/**
 * @swagger
 * /reception:
 *   get:
 *     summary: Récupérer tous les messages reçus
 *     tags: [Réception]
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
 *         description: Liste des messages reçus
 */
router.get('/', validateQuery('pagination'), receptionController.getReceivedMessages);

/**
 * @swagger
 * /reception/stats:
 *   get:
 *     summary: Obtenir les statistiques des messages reçus
 *     tags: [Réception]
 *     responses:
 *       200:
 *         description: Statistiques récupérées
 */
router.get('/stats', receptionController.getReceivedMessageStats);

/**
 * @swagger
 * /reception/mark-all-read:
 *   post:
 *     summary: Marquer tous les messages comme lus
 *     tags: [Réception]
 *     responses:
 *       200:
 *         description: Tous les messages ont été marqués comme lus
 */
router.post('/mark-all-read', receptionController.markAllAsRead);

/**
 * @swagger
 * /reception/{id}:
 *   get:
 *     summary: Obtenir un message reçu spécifique
 *     tags: [Réception]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du message
 *     responses:
 *       200:
 *         description: Message reçu
 */
router.get('/:id', validateParams('idParam'), receptionController.getReceivedMessage);

/**
 * @swagger
 * /reception/{id}/read:
 *   put:
 *     summary: Marquer un message comme lu
 *     tags: [Réception]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du message
 *     responses:
 *       200:
 *         description: Message marqué comme lu
 */
router.put('/:id/read', validateParams('idParam'), receptionController.markAsRead);

/**
 * @swagger
 * /reception/{id}/state:
 *   put:
 *     summary: Changer l'état d'un message
 *     tags: [Réception]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 example: important
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: État mis à jour
 */
router.put('/:id/state', validateParams('idParam'), validate('updateMessageState'), receptionController.updateMessageState);

/**
 * @swagger
 * /reception/{id}/move:
 *   put:
 *     summary: Déplacer un message vers un dossier
 *     tags: [Réception]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               folderId:
 *                 type: string
 *                 example: 123456
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message déplacé
 */
router.put('/:id/move', validateParams('idParam'), validate('moveToDossier'), receptionController.moveToFolder);

/**
 * @swagger
 * /reception/{id}:
 *   delete:
 *     summary: Supprimer un message (mise en corbeille)
 *     tags: [Réception]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message supprimé
 */
router.delete('/:id', validateParams('idParam'), receptionController.deleteReceivedMessage);

/**
 * @swagger
 * /reception/{id}/permanent:
 *   delete:
 *     summary: Supprimer définitivement un message
 *     tags: [Réception]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message supprimé définitivement
 */
router.delete('/:id/permanent', validateParams('idParam'), receptionController.deleteReceivedMessagePermanent);

module.exports = router;
