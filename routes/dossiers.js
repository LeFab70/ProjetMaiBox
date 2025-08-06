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

// Récupérer tous les dossiers
router.get("/", dossierController.getDossiers);

// Récupérer les statistiques des dossiers
router.get("/stats", dossierController.getDossierStats);

// Créer un nouveau dossier
//router.post("/", validateCreateDossier, dossierController.createDossier);

// Récupérer un dossier spécifique
//router.get("/:id", validateId, dossierController.getDossier);

// Mettre à jour un dossier
// router.put(
//   "/:id",
//   validateId,
//   validateUpdateDossier,
//   dossierController.updateDossier
// );

// Supprimer un dossier
//router.delete("/:id", validateId, dossierController.deleteDossier);

// Récupérer les messages d'un dossier
// router.get(
//   "/:id/messages",
//   validateId,
//   validatePagination,
//   dossierController.getDossierMessages
// );

// Déplacer des messages vers un dossier
// router.post(
//   "/:id/move-messages",
//   validateId,
//   dossierController.moveMessagesToDossier
// );

module.exports = router;
