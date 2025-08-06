const Joi = require('joi');

// Schémas de validation Joi
const schemas = {
  // Validation pour l'inscription
  register: Joi.object({
    nom: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 100 caractères',
      'any.required': 'Le nom est requis'
    }),
    prenom: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Le prénom doit contenir au moins 2 caractères',
      'string.max': 'Le prénom ne peut pas dépasser 100 caractères',
      'any.required': 'Le prénom est requis'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Format d\'email invalide',
      'any.required': 'L\'email est requis'
    }),
    mot_de_passe: Joi.string().min(6).required().messages({
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
      'any.required': 'Le mot de passe est requis'
    }),
    telephone_mobile: Joi.string().pattern(/^[0-9+\-\s()]+$/).optional().messages({
      'string.pattern.base': 'Format de téléphone invalide'
    }),
    photo_profil: Joi.string().uri().optional().messages({
      'string.uri': 'URL de photo de profil invalide'
    })
  }),

  // Validation pour la connexion
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Format d\'email invalide',
      'any.required': 'L\'email est requis'
    }),
    mot_de_passe: Joi.string().required().messages({
      'any.required': 'Le mot de passe est requis'
    })
  }),

  // Validation pour la création de message
  createMessage: Joi.object({
    objet: Joi.string().max(255).optional().messages({
      'string.max': 'L\'objet ne peut pas dépasser 255 caractères'
    }),
    contenu: Joi.string().optional(),
    destinataires: Joi.array().items(Joi.number().integer().positive()).min(1).required().messages({
      'array.min': 'Au moins un destinataire est requis',
      'any.required': 'Les destinataires sont requis'
    }),
    statut: Joi.string().valid('CREATED', 'ENVOYE', 'BROUILLON').default('CREATED').messages({
      'any.only': 'Statut invalide'
    })
  }),

  // Validation pour la mise à jour de message
  updateMessage: Joi.object({
    objet: Joi.string().max(255).optional().messages({
      'string.max': 'L\'objet ne peut pas dépasser 255 caractères'
    }),
    contenu: Joi.string().optional(),
    statut: Joi.string().valid('CREATED', 'ENVOYE', 'BROUILLON', 'CORBEILLE').optional().messages({
      'any.only': 'Statut invalide'
    })
  }),

  // Validation pour la création de dossier
  createDossier: Joi.object({
    nom: Joi.string().min(1).max(100).required().messages({
      'string.min': 'Le nom du dossier doit contenir au moins 1 caractère',
      'string.max': 'Le nom du dossier ne peut pas dépasser 100 caractères',
      'any.required': 'Le nom du dossier est requis'
    })
  }),

  // Validation pour la mise à jour de dossier
  updateDossier: Joi.object({
    nom: Joi.string().min(1).max(100).required().messages({
      'string.min': 'Le nom du dossier doit contenir au moins 1 caractère',
      'string.max': 'Le nom du dossier ne peut pas dépasser 100 caractères',
      'any.required': 'Le nom du dossier est requis'
    })
  }),

  // Validation pour l'ajout de contact
  addContact: Joi.object({
    contact_id: Joi.number().integer().positive().required().messages({
      'number.base': 'L\'ID du contact doit être un nombre',
      'number.integer': 'L\'ID du contact doit être un entier',
      'number.positive': 'L\'ID du contact doit être positif',
      'any.required': 'L\'ID du contact est requis'
    })
  }),

  // Validation pour les paramètres d'ID
  idParam: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      'number.base': 'L\'ID doit être un nombre',
      'number.integer': 'L\'ID doit être un entier',
      'number.positive': 'L\'ID doit être positif',
      'any.required': 'L\'ID est requis'
    })
  }),

  // Validation pour la pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'La page doit être un nombre',
      'number.integer': 'La page doit être un entier',
      'number.min': 'La page doit être au moins 1'
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      'number.base': 'La limite doit être un nombre',
      'number.integer': 'La limite doit être un entier',
      'number.min': 'La limite doit être au moins 1',
      'number.max': 'La limite ne peut pas dépasser 100'
    })
  }),

  // Validation pour la recherche
  search: Joi.object({
    q: Joi.string().min(1).max(100).required().messages({
      'string.min': 'Le terme de recherche doit contenir au moins 1 caractère',
      'string.max': 'Le terme de recherche ne peut pas dépasser 100 caractères',
      'any.required': 'Le terme de recherche est requis'
    })
  }),

  // Validation pour le changement de mot de passe
  changePassword: Joi.object({
    ancien_mot_de_passe: Joi.string().required().messages({
      'any.required': 'L\'ancien mot de passe est requis'
    }),
    nouveau_mot_de_passe: Joi.string().min(6).required().messages({
      'string.min': 'Le nouveau mot de passe doit contenir au moins 6 caractères',
      'any.required': 'Le nouveau mot de passe est requis'
    })
  }),

  // Validation pour la mise à jour de profil
  updateProfile: Joi.object({
    nom: Joi.string().min(2).max(100).optional().messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 100 caractères'
    }),
    prenom: Joi.string().min(2).max(100).optional().messages({
      'string.min': 'Le prénom doit contenir au moins 2 caractères',
      'string.max': 'Le prénom ne peut pas dépasser 100 caractères'
    }),
    email: Joi.string().email().optional().messages({
      'string.email': 'Format d\'email invalide'
    }),
    telephone_mobile: Joi.string().pattern(/^[0-9+\-\s()]+$/).optional().messages({
      'string.pattern.base': 'Format de téléphone invalide'
    }),
    photo_profil: Joi.string().uri().optional().messages({
      'string.uri': 'URL de photo de profil invalide'
    })
  }),

  // Validation pour la mise à jour d'état de message
  updateMessageState: Joi.object({
    etat: Joi.string().valid('RECU', 'LU', 'SUPPRIME', 'ARCHIVE', 'CORBEILLE').required().messages({
      'any.only': 'État invalide',
      'any.required': 'L\'état est requis'
    })
  }),

  // Validation pour le déplacement vers un dossier
  moveToDossier: Joi.object({
    dossier_id: Joi.number().integer().positive().allow(null).optional().messages({
      'number.base': 'L\'ID du dossier doit être un nombre',
      'number.integer': 'L\'ID du dossier doit être un entier',
      'number.positive': 'L\'ID du dossier doit être positif'
    })
  })
};

// Middleware de validation générique
const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({
        success: false,
        message: 'Schéma de validation non trouvé'
      });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Données de validation invalides',
        errors
      });
    }

    // Remplacer req.body par les données validées
    req.body = value;
    next();
  };
};

// Middleware de validation pour les paramètres de requête
const validateQuery = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({
        success: false,
        message: 'Schéma de validation non trouvé'
      });
    }

    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Paramètres de requête invalides',
        errors
      });
    }

    // Remplacer req.query par les données validées
    req.query = value;
    next();
  };
};

// Middleware de validation pour les paramètres d'URL
const validateParams = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({
        success: false,
        message: 'Schéma de validation non trouvé'
      });
    }

    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Paramètres d\'URL invalides',
        errors
      });
    }

    // Remplacer req.params par les données validées
    req.params = value;
    next();
  };
};

module.exports = {
  validate,
  validateQuery,
  validateParams,
  schemas
}; 