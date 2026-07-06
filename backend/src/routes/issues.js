/**
 * Issues Routes
 * CEO and Creator: David Adriano Ferrari dos Santos
 */

const express = require('express');
const issueController = require('../controllers/issueController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router.get('/', issueController.listIssues.bind(issueController));
router.get('/:issueId', issueController.getIssue.bind(issueController));
router.post('/', authenticateToken, issueController.createIssue.bind(issueController));
router.put('/:issueId', authenticateToken, issueController.updateIssue.bind(issueController));
router.delete('/:issueId', authenticateToken, issueController.deleteIssue.bind(issueController));

module.exports = router;
