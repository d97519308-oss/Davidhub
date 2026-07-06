const express = require('express');
const router = express.Router({ mergeParams: true });
const issueController = require('../controllers/issueController');
const { auth, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, issueController.listIssues);
router.get('/:issueId', issueController.getIssue);
router.post('/', auth, issueController.createIssue);
router.put('/:issueId', auth, issueController.updateIssue);
router.delete('/:issueId', auth, issueController.deleteIssue);
router.post('/:issueId/comments', auth, issueController.addComment);

module.exports = router;
