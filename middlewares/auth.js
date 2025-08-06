const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware pour vérifier le token JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    console.log(token)
    console.info(authHeader)
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token d'accès requis",
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    // Récupérer l'utilisateur
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      console.error("Erreur JWT:", error); 
      return res.status(401).json({
        
        success: false,
        message: "Token invalide",
      });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expiré",
      });
    } else {
      console.error("Erreur JWT:", error); 
      return res.status(401).json({
        success: false,
        message: "Erreur d'authentification",
      });
    }
  }
};

// Middleware optionnel pour récupérer l'utilisateur si le token est présent
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // En cas d'erreur, on continue sans authentification
    next();
  }
};

// Middleware pour vérifier que l'utilisateur est le propriétaire de la ressource
const checkOwnership = (resourceModel) => {
  return async (req, res, next) => {
    try {
      const resourceId =
        req.params.id || req.params.messageId || req.params.dossierId;
      const userId = req.user.id;

      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: "ID de ressource requis",
        });
      }

      // Vérifier la propriété selon le modèle
      let isOwner = false;

      if (resourceModel === "message") {
        const message = await require("../models/Message").findById(resourceId);
        isOwner = message && message.expediteur_id === userId;
      } else if (resourceModel === "dossier") {
        isOwner = await require("../models/Dossier").belongsToUser(
          resourceId,
          userId
        );
      } else if (resourceModel === "reception") {
        const reception = await require("../models/ReceptionMessage").findById(
          resourceId
        );
        isOwner = reception && reception.destinataire_id === userId;
      }

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: "Accès non autorisé à cette ressource",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la vérification des permissions",
      });
    }
  };
};

module.exports = {
  authenticateToken,
  optionalAuth,
  checkOwnership,
};
