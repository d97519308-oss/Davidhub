/**
 * Repository Routes
 * CEO and Creator: David Adriano Ferrari dos Santos
 */

const express = require('express');
const repositoryController = require('../controllers/repositoryController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/', repositoryController.listRepositories.bind(repositoryController));
router.get('/:id', repositoryController.getRepository.bind(repositoryController));

// Protected routes
router.post('/', authenticateToken, repositoryController.createRepository.bind(repositoryController));
router.put('/:id', authenticateToken, repositoryController.updateRepository.bind(repositoryController));
router.delete('/:id', authenticateToken, repositoryController.deleteRepository.bind(repositoryController));

// Collaborators
router.post('/:id/collaborators', authenticateToken, repositoryController.addCollaborator.bind(repositoryController));
router.get('/:id/collaborators', repositoryController.listCollaborators.bind(repositoryController));
router.delete('/:id/collaborators/:userId', authenticateToken, repositoryController.removeCollaborator.bind(repositoryController));

module.exports = router;
