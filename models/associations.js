const User = require('./User');
const Message = require('./Message');
const ReceptionMessage = require('./ReceptionMessage');
const Contact = require('./Contact');
const Dossier = require('./Dossier');
const PieceJointe = require('./PieceJointe');

// Associations User
User.hasMany(Message, { 
  foreignKey: 'expediteur_id', 
  as: 'messages_envoyes' 
});

User.hasMany(ReceptionMessage, { 
  foreignKey: 'destinataire_id', 
  as: 'messages_recus' 
});

User.hasMany(Contact, { 
  foreignKey: 'proprietaire_id', 
  as: 'contacts' 
});

User.hasMany(Dossier, { 
  foreignKey: 'proprietaire_id', 
  as: 'dossiers' 
});

// Associations Message
Message.belongsTo(User, { 
  foreignKey: 'expediteur_id', 
  as: 'expediteur' 
});

Message.hasMany(ReceptionMessage, { 
  foreignKey: 'message_id', 
  as: 'receptions' 
});

Message.hasMany(PieceJointe, { 
  foreignKey: 'message_id', 
  as: 'pieces_jointes' 
});

// Associations ReceptionMessage
ReceptionMessage.belongsTo(Message, { 
  foreignKey: 'message_id', 
  as: 'message' 
});

ReceptionMessage.belongsTo(User, { 
  foreignKey: 'destinataire_id', 
  as: 'destinataire' 
});

ReceptionMessage.belongsTo(Dossier, { 
  foreignKey: 'dossier_id', 
  as: 'dossier' 
});

// Associations Contact
Contact.belongsTo(User, { 
  foreignKey: 'proprietaire_id', 
  as: 'proprietaire' 
});

Contact.belongsTo(User, { 
  foreignKey: 'contact_id', 
  as: 'contact' 
});

// Associations Dossier
Dossier.belongsTo(User, { 
  foreignKey: 'proprietaire_id', 
  as: 'proprietaire' 
});

Dossier.hasMany(ReceptionMessage, { 
  foreignKey: 'dossier_id', 
  as: 'messages' 
});

// Associations PieceJointe
PieceJointe.belongsTo(Message, { 
  foreignKey: 'message_id', 
  as: 'message' 
});

module.exports = {
  User,
  Message,
  ReceptionMessage,
  Contact,
  Dossier,
  PieceJointe
}; 