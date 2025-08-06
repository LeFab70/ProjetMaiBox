const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AuthenticationError, ValidationError } = require('../middlewares/errorHandler');

// Générer un token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'X9V6gR!zC3q@fKm#7Ls0tA$eN1uHwPgY',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Inscription d'un nouvel utilisateur
const register = async (req, res, next) => {
  try {
    const { nom, prenom, email, mot_de_passe, telephone_mobile, photo_profil } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new ValidationError('Cet email est déjà utilisé');
    }

    // Créer le nouvel utilisateur
    const newUser = await User.create({
      nom,
      prenom,
      email,
      mot_de_passe,
      telephone_mobile,
      photo_profil
    });

    // Générer le token
    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        user: {
          id: newUser.id,
          nom: newUser.nom,
          prenom: newUser.prenom,
          email: newUser.email,
          telephone_mobile: newUser.telephone_mobile,
          photo_profil: newUser.photo_profil
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Connexion d'un utilisateur
const login = async (req, res, next) => {
  try {
    const { email, mot_de_passe } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.verifyPassword(mot_de_passe);
    if (!isPasswordValid) {
      throw new AuthenticationError('Email ou mot de passe incorrect');
    }

    // Générer le token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone_mobile: user.telephone_mobile,
        photo_profil: user.photo_profil
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir le profil de l'utilisateur connecté
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByIdWithoutPassword(userId);
    if (!user) {
      throw new ValidationError('Utilisateur non trouvé');
    }

    res.json({
      success: true,
      message: 'Profil récupéré avec succès',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Mettre à jour le profil de l'utilisateur
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { nom, prenom, email, telephone_mobile, photo_profil } = req.body;

    // Vérifier si l'email existe déjà (sauf pour l'utilisateur actuel)
    if (email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        throw new ValidationError('Cet email est déjà utilisé');
      }
    }

    // Mettre à jour l'utilisateur
    const updated = await User.updateById(userId, {
      nom,
      prenom,
      email,
      telephone_mobile,
      photo_profil
    });

    if (!updated) {
      throw new ValidationError('Utilisateur non trouvé');
    }

    // Récupérer l'utilisateur mis à jour
    const user = await User.findByIdWithoutPassword(userId);

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Changer le mot de passe
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { ancien_mot_de_passe, nouveau_mot_de_passe } = req.body;

    // Récupérer l'utilisateur
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ValidationError('Utilisateur non trouvé');
    }

    // Vérifier l'ancien mot de passe
    const isOldPasswordValid = await user.verifyPassword(ancien_mot_de_passe);
    if (!isOldPasswordValid) {
      throw new AuthenticationError('Ancien mot de passe incorrect');
    }

    // Changer le mot de passe
    const updated = await User.changePasswordById(userId, nouveau_mot_de_passe);
    if (!updated) {
      throw new ValidationError('Erreur lors du changement de mot de passe');
    }

    res.json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// Vérifier la validité du token
const verifyToken = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByIdWithoutPassword(userId);
    if (!user) {
      throw new ValidationError('Utilisateur non trouvé');
    }

    res.json({
      success: true,
      message: 'Token valide',
      user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken
}; 