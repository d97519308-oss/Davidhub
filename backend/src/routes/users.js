const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

router.get('/me', auth, userController.getCurrentUser);
router.put('/me', auth, userController.updateProfile);
router.get('/:id', userController.getUser);
router.get('/:id/repos', userController.getUserRepositories);

module.exports = router;
