/**
 * Authentication Routes
 * CEO and Creator: David Adriano Ferrari dos Santos
 */

const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));
router.post('/logout', authenticateToken, authController.logout.bind(authController));

module.exports = router;
