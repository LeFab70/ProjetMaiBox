const Contact = require('../models/Contact');
const User = require('../models/User');
const { NotFoundError, ValidationError } = require('../middlewares/errorHandler');

// Récupérer tous les contacts d'un utilisateur
const getContacts = async (req, res, next) => {
  try {
    const proprietaire_id = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const contacts = await Contact.findByProprietaire(proprietaire_id);
    const total = await Contact.countByProprietaire(proprietaire_id);

    // Pagination côté serveur
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedContacts = contacts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        contacts: paginatedContacts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer un contact spécifique
const getContact = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const proprietaire_id = req.user.id;

    const contact = await Contact.findById(contactId);
    if (!contact) {
      throw new NotFoundError('Contact non trouvé');
    }

    // Vérifier que le contact appartient à l'utilisateur
    const userContacts = await Contact.findByProprietaire(proprietaire_id);
    const contactExists = userContacts.find(c => c.id === parseInt(contactId));
    
    if (!contactExists) {
      throw new ValidationError('Accès non autorisé à ce contact');
    }

    res.json({
      success: true,
      data: {
        contact
      }
    });
  } catch (error) {
    next(error);
  }
};

// Ajouter un nouveau contact
const addContact = async (req, res, next) => {
  try {
    const proprietaire_id = req.user.id;
    const { contact_id } = req.body;

    // Vérifier que l'utilisateur à ajouter existe
    const userToAdd = await User.findById(contact_id);
    if (!userToAdd) {
      throw new NotFoundError('Utilisateur non trouvé');
    }

    // Vérifier qu'on ne s'ajoute pas soi-même
    if (proprietaire_id === contact_id) {
      throw new ValidationError('Vous ne pouvez pas vous ajouter vous-même comme contact');
    }

    // Vérifier si le contact existe déjà
    const existingContact = await Contact.findByProprietaireAndContact(proprietaire_id, contact_id);
    if (existingContact) {
      throw new ValidationError('Ce contact existe déjà dans votre liste');
    }

    const newContact = await Contact.create({
      proprietaire_id,
      contact_id
    });

    // Récupérer les informations complètes du contact
    const contactInfo = await Contact.findById(newContact.id);

    res.status(201).json({
      success: true,
      message: 'Contact ajouté avec succès',
      data: {
        contact: contactInfo
      }
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer un contact
const deleteContact = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const proprietaire_id = req.user.id;

    const contact = await Contact.findById(contactId);
    if (!contact) {
      throw new NotFoundError('Contact non trouvé');
    }

    // Vérifier que le contact appartient à l'utilisateur
    const userContacts = await Contact.findByProprietaire(proprietaire_id);
    const contactExists = userContacts.find(c => c.id === parseInt(contactId));
    
    if (!contactExists) {
      throw new ValidationError('Accès non autorisé à ce contact');
    }

    const deleted = await Contact.delete(contactId);
    if (!deleted) {
      throw new ValidationError('Erreur lors de la suppression du contact');
    }

    res.json({
      success: true,
      message: 'Contact supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// Rechercher des contacts
const searchContacts = async (req, res, next) => {
  try {
    const proprietaire_id = req.user.id;
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      throw new ValidationError('Terme de recherche requis');
    }

    const contacts = await Contact.searchContacts(proprietaire_id, q.trim());

    res.json({
      success: true,
      data: {
        contacts,
        searchTerm: q.trim(),
        count: contacts.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Rechercher des utilisateurs pour les ajouter comme contacts
const searchUsersToAdd = async (req, res, next) => {
  try {
    const proprietaire_id = req.user.id;
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      throw new ValidationError('Terme de recherche requis');
    }

    // Récupérer tous les utilisateurs sauf l'utilisateur connecté
    const allUsers = await User.findAll();
    const filteredUsers = allUsers.filter(user => user.id !== proprietaire_id);

    // Rechercher par nom, prénom ou email
    const searchTerm = q.trim().toLowerCase();
    const matchingUsers = filteredUsers.filter(user => 
      user.nom.toLowerCase().includes(searchTerm) ||
      user.prenom.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );

    // Récupérer les contacts existants
    const existingContacts = await Contact.findByProprietaire(proprietaire_id);
    const existingContactIds = existingContacts.map(c => c.contact_id);

    // Marquer les utilisateurs déjà en contact
    const usersWithContactStatus = matchingUsers.map(user => ({
      ...user,
      isContact: existingContactIds.includes(user.id)
    }));

    res.json({
      success: true,
      data: {
        users: usersWithContactStatus,
        searchTerm: q.trim(),
        count: usersWithContactStatus.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Vérifier si un utilisateur est en contact
const checkContactStatus = async (req, res, next) => {
  try {
    const proprietaire_id = req.user.id;
    const { user_id } = req.params;

    // Vérifier que l'utilisateur existe
    const user = await User.findById(user_id);
    if (!user) {
      throw new NotFoundError('Utilisateur non trouvé');
    }

    const isContact = await Contact.isContact(proprietaire_id, user_id);

    res.json({
      success: true,
      data: {
        isContact,
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          photo_profil: user.photo_profil
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer les statistiques des contacts
const getContactStats = async (req, res, next) => {
  try {
    const proprietaire_id = req.user.id;

    const totalContacts = await Contact.countByProprietaire(proprietaire_id);

    res.json({
      success: true,
      data: {
        stats: {
          total: totalContacts
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  getContact,
  addContact,
  deleteContact,
  searchContacts,
  searchUsersToAdd,
  checkContactStatus,
  getContactStats
}; 