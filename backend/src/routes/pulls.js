/**
 * Pull Requests Routes
 * CEO and Creator: David Adriano Ferrari dos Santos
 */

const express = require('express');
const pullController = require('../controllers/pullController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router.get('/', pullController.listPullRequests.bind(pullController));
router.get('/:pullId', pullController.getPullRequest.bind(pullController));
router.post('/', authenticateToken, pullController.createPullRequest.bind(pullController));
router.put('/:pullId', authenticateToken, pullController.updatePullRequest.bind(pullController));
router.post('/:pullId/merge', authenticateToken, pullController.mergePullRequest.bind(pullController));
router.post('/:pullId/close', authenticateToken, pullController.closePullRequest.bind(pullController));
router.delete('/:pullId', authenticateToken, pullController.deletePullRequest.bind(pullController));

module.exports = router;
