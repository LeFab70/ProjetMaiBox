const Message = require('../models/Message');
const ReceptionMessage = require('../models/ReceptionMessage');
const User = require('../models/User');
const PieceJointe = require('../models/PieceJointe');
const { NotFoundError, ValidationError } = require('../middlewares/errorHandler');

// Créer et envoyer un nouveau message
const createMessage = async (req, res, next) => {
  try {
    const expediteur_id = req.user.id;
    const { objet, contenu, destinataires, statut = 'CREATED' } = req.body;

    // Vérifier que tous les destinataires existent
    for (const destinataire_id of destinataires) {
      const destinataire = await User.findByPk(destinataire_id);
      if (!destinataire) {
        throw new ValidationError(`Destinataire avec l'ID ${destinataire_id} non trouvé`);
      }
    }

    // Créer le message
    const message = await Message.create({
      expediteur_id,
      objet,
      contenu,
      statut
    });

    // Créer les réceptions pour chaque destinataire
    const receptions = [];
    for (const destinataire_id of destinataires) {
      const reception = await ReceptionMessage.create({
        message_id: message.id,
        destinataire_id
      });
      receptions.push(reception);
    }

    // Récupérer le message avec les informations de l'expéditeur
    const messageComplet = await Message.findByPk(message.id, {
      include: [{
        model: require('../models').sequelize.models.User,
        as: 'expediteur',
        attributes: ['id', 'nom', 'prenom', 'email']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès',
      data: {
        message: messageComplet,
        destinataires: destinataires.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer tous les messages envoyés par l'utilisateur
const getSentMessages = async (req, res, next) => {
  try {
    const expediteur_id = req.user.id;
    const { page = 1, limit = 10, statut } = req.query;

    let messages;
    let pagination;
    
    if (statut) {
      messages = await Message.findByStatut(expediteur_id, statut);
    } else {
      const result = await Message.findAllWithPagination(expediteur_id, parseInt(page), parseInt(limit));
      messages = result.messages;
      pagination = result.pagination;
    }

    res.json({
      success: true,
      data: {
        messages,
        pagination
      }
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer un message envoyé spécifique
const getSentMessage = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const expediteur_id = req.user.id;

    const message = await Message.findByPk(messageId, {
      include: [{
        model: require('../models').sequelize.models.User,
        as: 'expediteur',
        attributes: ['id', 'nom', 'prenom', 'email']
      }]
    });
    
    if (!message) {
      throw new NotFoundError('Message non trouvé');
    }

    if (message.expediteur_id !== expediteur_id) {
      throw new ValidationError('Accès non autorisé à ce message');
    }

    // Récupérer les pièces jointes
    const piecesJointes = await PieceJointe.findByMessage(messageId);

    res.json({
      success: true,
      data: {
        message,
        pieces_jointes: piecesJointes
      }
    });
  } catch (error) {
    next(error);
  }
};

// Mettre à jour un message
const updateMessage = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const expediteur_id = req.user.id;
    const { objet, contenu, statut } = req.body;

    // Vérifier que le message existe et appartient à l'utilisateur
    const message = await Message.findByPk(messageId);
    if (!message) {
      throw new NotFoundError('Message non trouvé');
    }

    if (message.expediteur_id !== expediteur_id) {
      throw new ValidationError('Accès non autorisé à ce message');
    }

    // Mettre à jour le message
    await message.update({
      objet: objet || message.objet,
      contenu: contenu || message.contenu,
      statut: statut || message.statut
    });

    res.json({
      success: true,
      message: 'Message mis à jour avec succès',
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer un message (mise en corbeille)
const deleteMessage = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const expediteur_id = req.user.id;

    // Vérifier que le message existe et appartient à l'utilisateur
    const message = await Message.findByPk(messageId);
    if (!message) {
      throw new NotFoundError('Message non trouvé');
    }

    if (message.expediteur_id !== expediteur_id) {
      throw new ValidationError('Accès non autorisé à ce message');
    }

    // Mettre en corbeille
    const deleted = await Message.delete(messageId);
    if (!deleted) {
      throw new ValidationError('Erreur lors de la suppression du message');
    }

    res.json({
      success: true,
      message: 'Message mis en corbeille avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer définitivement un message
const deleteMessagePermanent = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const expediteur_id = req.user.id;

    // Vérifier que le message existe et appartient à l'utilisateur
    const message = await Message.findByPk(messageId);
    if (!message) {
      throw new NotFoundError('Message non trouvé');
    }

    if (message.expediteur_id !== expediteur_id) {
      throw new ValidationError('Accès non autorisé à ce message');
    }

    // Supprimer définitivement
    const deleted = await Message.deletePermanent(messageId);
    if (!deleted) {
      throw new ValidationError('Erreur lors de la suppression définitive du message');
    }

    res.json({
      success: true,
      message: 'Message supprimé définitivement avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// Envoyer un brouillon
const sendDraft = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const expediteur_id = req.user.id;
    const { destinataires } = req.body;

    // Vérifier que le message existe et appartient à l'utilisateur
    const message = await Message.findByPk(messageId);
    if (!message) {
      throw new NotFoundError('Message non trouvé');
    }

    if (message.expediteur_id !== expediteur_id) {
      throw new ValidationError('Accès non autorisé à ce message');
    }

    if (message.statut !== 'BROUILLON') {
      throw new ValidationError('Ce message n\'est pas un brouillon');
    }

    // Vérifier que tous les destinataires existent
    for (const destinataire_id of destinataires) {
      const destinataire = await User.findByPk(destinataire_id);
      if (!destinataire) {
        throw new ValidationError(`Destinataire avec l'ID ${destinataire_id} non trouvé`);
      }
    }

    // Créer les réceptions pour chaque destinataire
    for (const destinataire_id of destinataires) {
      await ReceptionMessage.create({
        message_id: messageId,
        destinataire_id
      });
    }

    // Mettre à jour le statut du message
    await message.update({ statut: 'ENVOYE' });

    res.json({
      success: true,
      message: 'Brouillon envoyé avec succès',
      data: {
        destinataires: destinataires.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir les statistiques des messages
const getMessageStats = async (req, res, next) => {
  try {
    const expediteur_id = req.user.id;

    // Compter les messages par statut
    const stats = {
      total: await Message.count({ where: { expediteur_id } }),
      envoyes: await Message.count({ where: { expediteur_id, statut: 'ENVOYE' } }),
      brouillons: await Message.count({ where: { expediteur_id, statut: 'BROUILLON' } }),
      corbeille: await Message.count({ where: { expediteur_id, statut: 'CORBEILLE' } })
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMessage,
  getSentMessages,
  getSentMessage,
  updateMessage,
  deleteMessage,
  deleteMessagePermanent,
  sendDraft,
  getMessageStats
}; 