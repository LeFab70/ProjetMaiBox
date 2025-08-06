const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MailBox API',
      version: '1.0.0',
      description: 'API REST pour l\'application de messagerie MailBox',
      contact: {
        name: 'Fabrice Kouonang',
        email: 'kouonang2002@gmail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Serveur de développement'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nom: { type: 'string', example: 'Doe' },
            prenom: { type: 'string', example: 'John' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            telephone_mobile: { type: 'string', example: '1234567890' },
            photo_profil: { type: 'string', example: 'profile.jpg' }
          }
        },
        Message: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            expediteur_id: { type: 'integer', example: 1 },
            objet: { type: 'string', example: 'Sujet du message' },
            contenu: { type: 'string', example: 'Contenu du message' },
            date_envoi: { type: 'string', format: 'date-time' },
            statut: { 
              type: 'string', 
              enum: ['CREATED', 'ENVOYE', 'BROUILLON', 'CORBEILLE'],
              example: 'ENVOYE'
            }
          }
        },
        ReceptionMessage: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            message_id: { type: 'integer', example: 1 },
            destinataire_id: { type: 'integer', example: 2 },
            etat: { 
              type: 'string', 
              enum: ['RECU', 'LU', 'SUPPRIME', 'ARCHIVE', 'CORBEILLE'],
              example: 'RECU'
            },
            dossier_id: { type: 'integer', nullable: true, example: 1 }
          }
        },
        Contact: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            proprietaire_id: { type: 'integer', example: 1 },
            contact_id: { type: 'integer', example: 2 }
          }
        },
        Dossier: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nom: { type: 'string', example: 'Important' },
            proprietaire_id: { type: 'integer', example: 1 }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Message d\'erreur' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Email invalide' }
                }
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Opération réussie' },
            data: { type: 'object' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './models/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs; 