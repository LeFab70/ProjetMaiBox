const Dossier = require('../models/Dossier');
const ReceptionMessage = require('../models/ReceptionMessage');
const { NotFoundError, ValidationError } = require('../middlewares/errorHandler');

// Récupérer tous les dossiers d'un utilisateur
const getDossiers = async (req, res, next) => {
  try {
    const proprietaire_id = req.user.id;

    const dossiers = await Dossier.findByProprietaireWithMessageCount(proprietaire_id);

    res.json({
      success: true,
      data: {
        dossiers
      }
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer un dossier spécifique
const getDossier = async (req, res, next) => {
  try {
    const dossierId = req.params.id;
    const proprietaire_id = req.user.id;

    const dossier = await Dossier.findByIdWithMessageCount(dossierId);
    if (!dossier) {
      throw new NotFoundError('Dossier non trouvé');
    }

    if (dossier.proprietaire_id !== proprietaire_id) {
      throw new ValidationError('Accès non autorisé à ce dossier');
    }

    res.json({
      success: true,
      data: {
        dossier
      }
    });
  } catch (error) {
    next(error);
  }
};

// Créer un nouveau dossier
const createDossier = async (req, res, next) => {
  try {
    const proprietaire_id = req.user.id;
    const { nom } = req.body;

    const newDossier = await Dossier.create({
      nom,
      proprietaire_id
    });

    res.status(201).json({
      success: true,
      message: 'Dossier créé avec succès',
      data: {
        dossier: newDossier
      }
    });
  } catch (error) {
    next(error);
  }
};

// Mettre à jour un dossier
const updateDossier = async (req, res, next) => {
  try {
    const dossierId = req.params.id;
    const proprietaire_id = req.user.id;
    const { nom } = req.body;

    const dossier = await Dossier.findById(dossierId);
    if (!dossier) {
      throw new NotFoundError('Dossier non trouvé');
    }

    if (dossier.proprietaire_id !== proprietaire_id) {
      throw new ValidationError('Accès non autorisé à ce dossier');
    }

    const updated = await Dossier.update(dossierId, { nom });
    if (!updated) {
      throw new ValidationError('Erreur lors de la mise à jour du dossier');
    }

    const updatedDossier = await Dossier.findById(dossierId);

    res.json({
      success: true,
      message: 'Dossier mis à jour avec succès',
      data: {
        dossier: updatedDossier
      }
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer un dossier
const deleteDossier = async (req, res, next) => {
  try {
    const dossierId = req.params.id;
    const proprietaire_id = req.user.id;

    const dossier = await Dossier.findById(dossierId);
    if (!dossier) {
      throw new NotFoundError('Dossier non trouvé');
    }

    if (dossier.proprietaire_id !== proprietaire_id) {
      throw new ValidationError('Accès non autorisé à ce dossier');
    }

    const deleted = await Dossier.delete(dossierId);
    if (!deleted) {
      throw new ValidationError('Erreur lors de la suppression du dossier');
    }

    res.json({
      success: true,
      message: 'Dossier supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer les messages d'un dossier
const getDossierMessages = async (req, res, next) => {
  try {
    const dossierId = req.params.id;
    const proprietaire_id = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const dossier = await Dossier.findById(dossierId);
    if (!dossier) {
      throw new NotFoundError('Dossier non trouvé');
    }

    if (dossier.proprietaire_id !== proprietaire_id) {
      throw new ValidationError('Accès non autorisé à ce dossier');
    }

    // Récupérer les messages du dossier
    const result = await ReceptionMessage.findAllWithPagination(
      proprietaire_id,
      parseInt(page),
      parseInt(limit)
    );

    // Filtrer les messages qui appartiennent à ce dossier
    const dossierMessages = result.messages.filter(message => 
      message.dossier_id === parseInt(dossierId)
    );

    // Recalculer la pagination pour ce dossier
    const totalMessages = await ReceptionMessage.findByDestinataire(proprietaire_id);
    const dossierTotal = totalMessages.filter(message => 
      message.dossier_id === parseInt(dossierId)
    ).length;

    res.json({
      success: true,
      data: {
        messages: dossierMessages,
        dossier: {
          id: dossier.id,
          nom: dossier.nom
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: dossierTotal,
          totalPages: Math.ceil(dossierTotal / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Déplacer des messages vers un dossier
const moveMessagesToDossier = async (req, res, next) => {
  try {
    const dossierId = req.params.id;
    const proprietaire_id = req.user.id;
    const { message_ids } = req.body;

    if (!Array.isArray(message_ids) || message_ids.length === 0) {
      throw new ValidationError('Liste de messages requise');
    }

    const dossier = await Dossier.findById(dossierId);
    if (!dossier) {
      throw new NotFoundError('Dossier non trouvé');
    }

    if (dossier.proprietaire_id !== proprietaire_id) {
      throw new ValidationError('Accès non autorisé à ce dossier');
    }

    // Déplacer chaque message
    let movedCount = 0;
    for (const messageId of message_ids) {
      const reception = await ReceptionMessage.findById(messageId);
      if (reception && reception.destinataire_id === proprietaire_id) {
        await ReceptionMessage.moveToDossier(messageId, dossierId);
        movedCount++;
      }
    }

    res.json({
      success: true,
      message: `${movedCount} messages déplacés vers le dossier "${dossier.nom}"`
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer les statistiques des dossiers
const getDossierStats = async (req, res, next) => {
  try {
    const proprietaire_id = req.user.id;

    const dossiers = await Dossier.findByProprietaireWithMessageCount(proprietaire_id);
    const totalDossiers = await Dossier.countByProprietaire(proprietaire_id);

    const totalMessages = dossiers.reduce((sum, dossier) => sum + dossier.nombre_messages, 0);

    res.json({
      success: true,
      data: {
        stats: {
          total_dossiers: totalDossiers,
          total_messages: totalMessages,
          dossiers: dossiers.map(dossier => ({
            id: dossier.id,
            nom: dossier.nom,
            nombre_messages: dossier.nombre_messages
          }))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDossiers,
  getDossier,
  createDossier,
  updateDossier,
  deleteDossier,
  getDossierMessages,
  moveMessagesToDossier,
  getDossierStats
}; 