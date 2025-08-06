-- Suppression de la base si elle existe
DROP DATABASE IF EXISTS mailBoxBd;

-- Création de la base de données
CREATE DATABASE mailBoxBd;
USE mailBoxBd;

-- Suppression des tables si elles existent déjà (ordre inverse des dépendances)
DROP TABLE IF EXISTS PieceJointe;
DROP TABLE IF EXISTS ReceptionMessage;
DROP TABLE IF EXISTS Message;
DROP TABLE IF EXISTS Dossier;
DROP TABLE IF EXISTS Contact;
DROP TABLE IF EXISTS User;

-- Table des utilisateurs
CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    photo_profil VARCHAR(255),
    telephone_mobile VARCHAR(20)
);

-- Table des relations de contact entre utilisateurs
CREATE TABLE Contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proprietaire_id INT NOT NULL,        -- Celui qui ajoute le contact
    contact_id INT NOT NULL,             -- L'utilisateur ajouté comme contact
    FOREIGN KEY (proprietaire_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES User(id) ON DELETE CASCADE
);

-- Table des dossiers personnalisés
CREATE TABLE Dossier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    proprietaire_id INT NOT NULL,
    FOREIGN KEY (proprietaire_id) REFERENCES User(id) ON DELETE CASCADE
);

-- Table des messages
CREATE TABLE Message (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expediteur_id INT NOT NULL,
    objet VARCHAR(255),
    contenu TEXT,
    date_envoi DATETIME DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('CREATED', 'ENVOYE', 'BROUILLON', 'CORBEILLE') DEFAULT 'CREATED',
    FOREIGN KEY (expediteur_id) REFERENCES User(id) ON DELETE CASCADE
);

-- Table de réception des messages
CREATE TABLE ReceptionMessage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id INT NOT NULL,
    destinataire_id INT NOT NULL,
    etat ENUM('RECU', 'LU', 'SUPPRIME', 'ARCHIVE', 'CORBEILLE') DEFAULT 'RECU',
    dossier_id INT,
    FOREIGN KEY (message_id) REFERENCES Message(id) ON DELETE CASCADE,
    FOREIGN KEY (destinataire_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (dossier_id) REFERENCES Dossier(id) ON DELETE SET NULL
);

-- Table des pièces jointes
CREATE TABLE PieceJointe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id INT NOT NULL,
    nom_fichier VARCHAR(255) NOT NULL,
    chemin_fichier VARCHAR(500) NOT NULL,
    FOREIGN KEY (message_id) REFERENCES Message(id) ON DELETE CASCADE
);

USE mailBoxBd;

-- Insertion des utilisateurs avec photo de profil
INSERT INTO User (nom, prenom, email, mot_de_passe, telephone_mobile, photo_profil) VALUES
('Doe', 'Andy', 'andy@mail.com', 'pass123', '1234567890', 'andy.png'),
('Kouonang', 'Fabrice', 'fabrice@mail.com', 'pass123', '1234567891', 'fabrice.jpg'),
('Lemoine', 'Éthane', 'ethane@mail.com', 'pass123', '1234567892', 'ethane.png'),
('Durand', 'Mat', 'mat@mail.com', 'pass123', '1234567893', 'mat.jpg'),
('Martin', 'Cyrianne', 'cyrianne@mail.com', 'pass123', '1234567894', 'cyrianne.png'),
('Dupuis', 'Keyline', 'keyline@mail.com', 'pass123', '1234567895', 'keyline.jpg');

-- Insertion de dossiers
INSERT INTO Dossier (nom, proprietaire_id) VALUES
('Important', 1), -- Andy
('Travail', 2),   -- Fabrice
('Projet MailBox', 3), -- Éthane
('Perso', 4),     -- Mat
('Archives', 5);  -- Cyrianne

-- Insertion des contacts
INSERT INTO Contact (proprietaire_id, contact_id) VALUES
(1, 2), (1, 3), -- Andy ajoute Fabrice et Éthane
(2, 1), (2, 3), -- Fabrice ajoute Andy et Éthane
(3, 4),         -- Éthane ajoute Mat
(4, 5), (4, 6), -- Mat ajoute Cyrianne et Keyline
(5, 1);         -- Cyrianne ajoute Andy

-- Insertion de messages (avec statuts variés)
INSERT INTO Message (expediteur_id, objet, contenu, statut) VALUES
(1, 'Création de compte', 'As-tu terminé l\'interface de création de compte utilisateur ?', 'ENVOYE'),
(2, 'Dossiers de messagerie', 'On pourrait permettre aux utilisateurs de créer des dossiers.', 'ENVOYE'),
(3, 'Fonction lire messages', 'J\'ai ajouté la fonction pour marquer un message comme lu.', 'ENVOYE'),
(4, 'Maquette UI', 'La maquette des écrans de login est terminée.', 'CORBEILLE'),
(5, 'Ajout pièces jointes', 'J\'ai implémenté les pièces jointes dans les messages.', 'ENVOYE'),
(1, 'Réception OK', 'La réception de message fonctionne bien.', 'ENVOYE'),
(2, 'Connexion API', 'L\'authentification avec le token JWT est en place.', 'ENVOYE'),
(3, 'CRUD Contact', 'Le module de gestion des contacts fonctionne.', 'ENVOYE'),
(4, 'Test BDD', 'Les tests avec la base MySQL sont validés.', 'ENVOYE'),
(5, 'MongoDB', 'Insertion multiple avec Mongo terminée.', 'CORBEILLE');

-- Insertion des messages reçus (avec états variés)
INSERT INTO ReceptionMessage (message_id, destinataire_id, etat, dossier_id) VALUES
(1, 2, 'RECU', 2),
(2, 1, 'LU', 1),
(3, 2, 'LU', 2),
(4, 3, 'CORBEILLE', 3),
(5, 4, 'RECU', 4),
(6, 5, 'LU', 5),
(7, 3, 'RECU', 3),
(8, 4, 'RECU', 4),
(9, 5, 'RECU', 5),
(10, 6, 'CORBEILLE', NULL);

-- Insertion de pièces jointes pour certains messages
INSERT INTO PieceJointe (message_id, nom_fichier, chemin_fichier) VALUES
(5, 'specs.pdf', '/files/specs.pdf'),
(5, 'demo.zip', '/files/demo.zip'),
(2, 'screenshot_ui.png', '/files/screenshot_ui.png'),
(9, 'test_result.txt', '/files/test_result.txt'); 