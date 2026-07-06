const express = require('express');
const router = express.Router({ mergeParams: true });
const pullController = require('../controllers/pullController');
const { auth, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, pullController.listPullRequests);
router.get('/:pullId', pullController.getPullRequest);
router.post('/', auth, pullController.createPullRequest);
router.put('/:pullId', auth, pullController.updatePullRequest);
router.post('/:pullId/merge', auth, pullController.mergePullRequest);
router.post('/:pullId/close', auth, pullController.closePullRequest);

module.exports = router;
