/**
 * Users Routes
 * CEO and Creator: David Adriano Ferrari dos Santos
 */

const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/me', authenticateToken, userController.getCurrentUser.bind(userController));
router.put('/me', authenticateToken, userController.updateProfile.bind(userController));
router.get('/:id', userController.getUser.bind(userController));
router.get('/:id/repositories', userController.getUserRepositories.bind(userController));

module.exports = router;
