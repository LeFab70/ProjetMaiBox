// Middleware de gestion d'erreurs global
const errorHandler = (err, req, res, next) => {
  console.error('Erreur:', err);

  // Erreur de validation MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      success: false,
      message: 'Cette ressource existe déjà',
      error: 'DUPLICATE_ENTRY'
    });
  }

  // Erreur de clé étrangère
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Référence invalide',
      error: 'FOREIGN_KEY_CONSTRAINT'
    });
  }

  // Erreur de connexion à la base de données
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      success: false,
      message: 'Service temporairement indisponible',
      error: 'DATABASE_CONNECTION_ERROR'
    });
  }

  // Erreur de validation personnalisée
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message,
      error: 'VALIDATION_ERROR'
    });
  }

  // Erreur d'authentification
  if (err.name === 'AuthenticationError') {
    return res.status(401).json({
      success: false,
      message: err.message,
      error: 'AUTHENTICATION_ERROR'
    });
  }

  // Erreur d'autorisation
  if (err.name === 'AuthorizationError') {
    return res.status(403).json({
      success: false,
      message: err.message,
      error: 'AUTHORIZATION_ERROR'
    });
  }

  // Erreur de ressource non trouvée
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      success: false,
      message: err.message,
      error: 'NOT_FOUND'
    });
  }

  // Erreur de limite de taille de fichier
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Fichier trop volumineux',
      error: 'FILE_TOO_LARGE'
    });
  }

  // Erreur de type de fichier non autorisé
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Type de fichier non autorisé',
      error: 'INVALID_FILE_TYPE'
    });
  }

  // Erreur par défaut
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Erreur interne du serveur' : message,
    error: process.env.NODE_ENV === 'production' ? 'INTERNAL_SERVER_ERROR' : err.stack
  });
};

// Middleware pour gérer les routes non trouvées
const notFound = (req, res, next) => {
  const error = new Error(`Route non trouvée - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Classe d'erreur personnalisée
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Classes d'erreur spécifiques
class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

class AuthenticationError extends AppError {
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

class AuthorizationError extends AppError {
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = {
  errorHandler,
  notFound,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError
}; 