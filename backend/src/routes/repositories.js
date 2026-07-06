const express = require('express');
const router = express.Router();
const repoController = require('../controllers/repositoryController');
const { auth } = require('../middleware/auth');

router.get('/', repoController.listRepositories);
router.get('/:id', repoController.getRepository);
router.post('/', auth, repoController.createRepository);
router.put('/:id', auth, repoController.updateRepository);
router.delete('/:id', auth, repoController.deleteRepository);
router.post('/:id/collaborators', auth, repoController.addCollaborator);
router.delete('/:id/collaborators/:userId', auth, repoController.removeCollaborator);
router.get('/:id/collaborators', repoController.listCollaborators);

module.exports = router;
