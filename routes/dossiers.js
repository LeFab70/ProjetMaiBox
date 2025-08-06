/**
 * @swagger
 * tags:
 *   name: Dossiers
 *   description: Gestion des dossiers et organisation des messages
 */
const express = require("express");
const router = express.Router();
const dossierController = require("../controllers/dossierController");
console.log("CONTROLLER =>", dossierController);

const { authenticateToken } = require("../middlewares/auth");
const {
  validateCreateDossier,
  validateUpdateDossier,
  validateId,
  validatePagination,
} = require("../middlewares/validation");

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

/// Récupérer tous les dossiers
/**
 * @swagger
 * /dossiers:
 *   get:
 *     summary: Récupérer tous les dossiers
 *     tags: [Dossiers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des dossiers récupérée avec succès
 */
router.get("/", dossierController.getDossiers);

// Récupérer les statistiques des dossiers
/**
 * @swagger
 * /dossiers/stats:
 *   get:
 *     summary: Obtenir les statistiques des dossiers
 *     tags: [Dossiers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 */
router.get("/stats", dossierController.getDossierStats);

// Créer un nouveau dossier
/**
 * @swagger
 * /dossiers:
 *   post:
 *     summary: Créer un nouveau dossier
 *     tags: [Dossiers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Important
 *     responses:
 *       201:
 *         description: Dossier créé avec succès
 */
//router.post("/", validateCreateDossier, dossierController.createDossier);

// Récupérer un dossier spécifique
/**
 * @swagger
 * /dossiers/{id}:
 *   get:
 *     summary: Récupérer un dossier spécifique
 *     tags: [Dossiers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64c24f2e4fbbac2a8d3a8f73
 *         description: ID du dossier
 *     responses:
 *       200:
 *         description: Dossier récupéré avec succès
 */
//router.get("/:id", validateId, dossierController.getDossier);

// Mettre à jour un dossier
/**
 * @swagger
 * /dossiers/{id}:
 *   put:
 *     summary: Mettre à jour un dossier
 *     tags: [Dossiers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64c24f2e4fbbac2a8d3a8f73
 *         description: ID du dossier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Professionnel
 *     responses:
 *       200:
 *         description: Dossier mis à jour avec succès
 */
// router.put(
//   "/:id",
//   validateId,
//   validateUpdateDossier,
//   dossierController.updateDossier
// );

// Supprimer un dossier
/**
 * @swagger
 * /dossiers/{id}:
 *   delete:
 *     summary: Supprimer un dossier
 *     tags: [Dossiers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du dossier
 *     responses:
 *       200:
 *         description: Dossier supprimé avec succès
 */
//router.delete("/:id", validateId, dossierController.deleteDossier);

// Récupérer les messages d'un dossier
/**
 * @swagger
 * /dossiers/{id}/messages:
 *   get:
 *     summary: Récupérer les messages d'un dossier
 *     tags: [Dossiers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64c24f2e4fbbac2a8d3a8f73
 *         description: ID du dossier
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Messages récupérés avec succès
 */
// router.get(
//   "/:id/messages",
//   validateId,
//   validatePagination,
//   dossierController.getDossierMessages
// );

// Déplacer des messages vers un dossier
/**
 * @swagger
 * /dossiers/{id}/move-messages:
 *   post:
 *     summary: Déplacer des messages vers un dossier
 *     tags: [Dossiers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64c24f2e4fbbac2a8d3a8f73
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["msgid1", "msgid2"]
 *     responses:
 *       200:
 *         description: Messages déplacés avec succès
 */
// router.post(
//   "/:id/move-messages",
//   validateId,
//   dossierController.moveMessagesToDossier
// );


module.exports = router;
