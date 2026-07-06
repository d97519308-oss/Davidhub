const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

class IssueController {
  async listIssues(req, res) {
    try {
      const { repoId } = req.params;
      const issues = [{ id: uuidv4(), title: 'Implement dark mode', description: 'Add dark mode support', state: 'open', author: 'David Adriano Ferrari dos Santos', createdAt: new Date() }];
      res.json({ message: 'Issues retrieved', repoId, data: issues });
    } catch (err) {
      res.status(500).json({ error: { status: 500, message: 'Failed to retrieve issues' } });
    }
  }

  async getIssue(req, res) {
    try {
      const { repoId, issueId } = req.params;
      const issue = { id: issueId, title: 'Implement dark mode', description: 'Add dark mode support', state: 'open', author: 'David Adriano Ferrari dos Santos', labels: ['feature', 'ui'], comments: [] };
      res.json({ message: 'Issue retrieved', repoId, data: issue });
    } catch (err) {
      res.status(500).json({ error: { status: 500, message: 'Failed to retrieve issue' } });
    }
  }

  async createIssue(req, res) {
    try {
      const { repoId } = req.params;
      const { title, description, labels = [], assignee } = req.body;
      if (!title) {
        return res.status(400).json({ error: { status: 400, message: 'Issue title required' } });
      }
      const issue = { id: uuidv4(), title, description, state: 'open', author: req.user.id, assignee, labels, createdAt: new Date() };
      logger.info('Issue created', { issueId: issue.id, repoId });
      res.status(201).json({ message: 'Issue created', repoId, data: issue });
    } catch (err) {
      res.status(500).json({ error: { status: 500, message: 'Failed to create issue' } });
    }
  }

  async updateIssue(req, res) {
    try {
      const { repoId, issueId } = req.params;
      const { title, description, state, labels, assignee } = req.body;
      const updated = { id: issueId, title, description, state, labels, assignee, updatedAt: new Date() };
      logger.info('Issue updated', { issueId });
      res.json({ message: 'Issue updated', repoId, data: updated });
    } catch (err) {
      res.status(500).json({ error: { status: 500, message: 'Failed to update issue' } });
    }
  }

  async deleteIssue(req, res) {
    try {
      const { repoId, issueId } = req.params;
      logger.info('Issue deleted', { issueId });
      res.json({ message: 'Issue deleted', deletedId: issueId });
    } catch (err) {
      res.status(500).json({ error: { status: 500, message: 'Failed to delete issue' } });
    }
  }

  async addComment(req, res) {
    try {
      const { repoId, issueId } = req.params;
      const { content } = req.body;
      const comment = { id: uuidv4(), content, author: req.user.id, createdAt: new Date() };
      res.status(201).json({ message: 'Comment added', issueId, data: comment });
    } catch (err) {
      res.status(500).json({ error: { status: 500, message: 'Failed to add comment' } });
    }
  }
}

module.exports = new IssueController();
