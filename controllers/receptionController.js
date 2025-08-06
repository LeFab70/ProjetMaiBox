const ReceptionMessage = require('../models/ReceptionMessage');
const PieceJointe = require('../models/PieceJointe');
const { NotFoundError, ValidationError } = require('../middlewares/errorHandler');

// Récupérer tous les messages reçus
const getReceivedMessages = async (req, res, next) => {
  try {
    const destinataire_id = req.user.id;
    const { page = 1, limit = 10, etat } = req.query;

    const result = await ReceptionMessage.findAllWithPagination(
      destinataire_id, 
      parseInt(page), 
      parseInt(limit), 
      etat
    );

    res.json({
      success: true,
      data: {
        messages: result.messages,
        pagination: result.pagination
      }
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer un message reçu spécifique
const getReceivedMessage = async (req, res, next) => {
  try {
    const receptionId = req.params.id;
    const destinataire_id = req.user.id;

    const reception = await ReceptionMessage.findById(receptionId);
    if (!reception) {
      throw new NotFoundError('Message non trouvé');
    }

    if (reception.destinataire_id !== destinataire_id) {
      throw new ValidationError('Accès non autorisé à ce message');
    }

    // Marquer comme lu si ce n'est pas déjà fait
    if (reception.etat === 'RECU') {
      await ReceptionMessage.markAsRead(receptionId);
      reception.etat = 'LU';
    }

    // Récupérer les pièces jointes
    const piecesJointes = await PieceJointe.findByMessage(reception.message_id);

    res.json({
      success: true,
      data: {
        message: {
          ...reception,
          pieces_jointes: piecesJointes
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Marquer un message comme lu
const markAsRead = async (req, res, next) => {
  try {
    const receptionId = req.params.id;
    const destinataire_id = req.user.id;

    const reception = await ReceptionMessage.findById(receptionId);
    if (!reception) {
      throw new NotFoundError('Message non trouvé');
    }

    if (reception.destinataire_id !== destinataire_id) {
      throw new ValidationError('Accès non autorisé à ce message');
    }

    const updated = await ReceptionMessage.markAsRead(receptionId);
    if (!updated) {
      throw new ValidationError('Erreur lors du marquage comme lu');
    }

    res.json({
      success: true,
      message: 'Message marqué comme lu'
    });
  } catch (error) {
    next(error);
  }
};

// Changer l'état d'un message reçu
const updateMessageState = async (req, res, next) => {
  try {
    const receptionId = req.params.id;
    const destinataire_id = req.user.id;
    const { etat } = req.body;

    const validStates = ['RECU', 'LU', 'SUPPRIME', 'ARCHIVE', 'CORBEILLE'];
    if (!validStates.includes(etat)) {
      throw new ValidationError('État invalide');
    }

    const reception = await ReceptionMessage.findById(receptionId);
    if (!reception) {
      throw new NotFoundError('Message non trouvé');
    }

    if (reception.destinataire_id !== destinataire_id) {
      throw new ValidationError('Accès non autorisé à ce message');
    }

    const updated = await ReceptionMessage.updateEtat(receptionId, etat);
    if (!updated) {
      throw new ValidationError('Erreur lors de la mise à jour de l\'état');
    }

    res.json({
      success: true,
      message: `Message ${etat.toLowerCase()} avec succès`
    });
  } catch (error) {
    next(error);
  }
};

// Déplacer un message vers un dossier
const moveToFolder = async (req, res, next) => {
  try {
    const receptionId = req.params.id;
    const destinataire_id = req.user.id;
    const { dossier_id } = req.body;

    const reception = await ReceptionMessage.findById(receptionId);
    if (!reception) {
      throw new NotFoundError('Message non trouvé');
    }

    if (reception.destinataire_id !== destinataire_id) {
      throw new ValidationError('Accès non autorisé à ce message');
    }

    const moved = await ReceptionMessage.moveToDossier(receptionId, dossier_id);
    if (!moved) {
      throw new ValidationError('Erreur lors du déplacement du message');
    }

    res.json({
      success: true,
      message: 'Message déplacé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer un message reçu (mise en corbeille)
const deleteReceivedMessage = async (req, res, next) => {
  try {
    const receptionId = req.params.id;
    const destinataire_id = req.user.id;

    const reception = await ReceptionMessage.findById(receptionId);
    if (!reception) {
      throw new NotFoundError('Message non trouvé');
    }

    if (reception.destinataire_id !== destinataire_id) {
      throw new ValidationError('Accès non autorisé à ce message');
    }

    const deleted = await ReceptionMessage.delete(receptionId);
    if (!deleted) {
      throw new ValidationError('Erreur lors de la suppression du message');
    }

    res.json({
      success: true,
      message: 'Message supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer définitivement un message reçu
const deleteReceivedMessagePermanent = async (req, res, next) => {
  try {
    const receptionId = req.params.id;
    const destinataire_id = req.user.id;

    const reception = await ReceptionMessage.findById(receptionId);
    if (!reception) {
      throw new NotFoundError('Message non trouvé');
    }

    if (reception.destinataire_id !== destinataire_id) {
      throw new ValidationError('Accès non autorisé à ce message');
    }

    const deleted = await ReceptionMessage.deletePermanent(receptionId);
    if (!deleted) {
      throw new ValidationError('Erreur lors de la suppression définitive du message');
    }

    res.json({
      success: true,
      message: 'Message supprimé définitivement'
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer les statistiques des messages reçus
const getReceivedMessageStats = async (req, res, next) => {
  try {
    const destinataire_id = req.user.id;

    const [recus, lus, archives, corbeille] = await Promise.all([
      ReceptionMessage.findByDestinataire(destinataire_id, 'RECU'),
      ReceptionMessage.findByDestinataire(destinataire_id, 'LU'),
      ReceptionMessage.findByDestinataire(destinataire_id, 'ARCHIVE'),
      ReceptionMessage.findByDestinataire(destinataire_id, 'CORBEILLE')
    ]);

    const nonLus = await ReceptionMessage.countUnread(destinataire_id);

    res.json({
      success: true,
      data: {
        stats: {
          recus: recus.length,
          lus: lus.length,
          non_lus: nonLus,
          archives: archives.length,
          corbeille: corbeille.length,
          total: recus.length + lus.length + archives.length + corbeille.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Marquer tous les messages comme lus
const markAllAsRead = async (req, res, next) => {
  try {
    const destinataire_id = req.user.id;

    // Récupérer tous les messages non lus
    const messagesNonLus = await ReceptionMessage.findByDestinataire(destinataire_id, 'RECU');
    
    // Les marquer tous comme lus
    for (const message of messagesNonLus) {
      await ReceptionMessage.markAsRead(message.id);
    }

    res.json({
      success: true,
      message: `${messagesNonLus.length} messages marqués comme lus`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReceivedMessages,
  getReceivedMessage,
  markAsRead,
  updateMessageState,
  moveToFolder,
  deleteReceivedMessage,
  deleteReceivedMessagePermanent,
  getReceivedMessageStats,
  markAllAsRead
}; 