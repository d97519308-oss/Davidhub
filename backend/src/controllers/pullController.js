const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

class PullController {
  async listPullRequests(req, res) {
    try {
      const { repoId } = req.params;
      const pulls = [{ id: uuidv4(), title: 'Add authentication system', description: 'Implement JWT authentication', state: 'open', author: 'David Adriano Ferrari dos Santos', createdAt: new Date() }];
      res.json({ message: 'Pull requests retrieved', repoId, data: pulls });
    } catch (err) {
      res.status(500).json({ error: { status: 500, message: 'Failed to retrieve pull requests' } });
    }
  }

  async getPullRequest(req, res) {
    try {
      const { repoId, pullId } = req.params;
      const pull = { id: pullId, title: 'Add authentication system', description: 'Implement JWT authentication', state: 'open', author: 'David Adriano Ferrari dos Santos', sourceBranch: 'feature/auth', targetBranch: 'main', reviewers: [] };
      res.json({ message: 'Pull request retrieved', repoId, data: pull });
    } catch (err) {
      res.status(500).json({ error: { status: 500, message: 'Failed to retrieve pull request' } });
    }
  }

  async createPullRequest(req, res) {
    try {
      const { repoId } = req.params;
      const { title, description, sourceBranch, targetBranch } = req.body;
      if (!title || !sourceBranch || !targetBranch) {
        return res.status(400).json({ error: { status: 400, message: 'Title, sourceBranch, and targetBranch required' } });
      }
      const pull = { id: uuidv4(), title, description, state: 'open', author: req.user.id, sourceBranch, targetBranch, reviewers: [], createdAt: new Date() };
      logger.info('Pull request created', { pullId: pull.id, repoId });
      res.status(201).json({ message: 'Pull request created', repoId, data: pull });
    } catch (err) {
      res.status(500).json({ error: { status: 500, message: 'Failed to create pull request' } });
    }
  }

  async updatePullRequest(req, res) {
    try {
      const { repoId, pullId } = req.params;
      const { title, description, reviewers } = req.body;
      const updated = { id: pullId, title, description, reviewers, updatedAt: new Date() };
      logger.info('Pull request updated', { pullId });
      res.json({ message: 'Pull request updated', repoId, data: updated });
    } catch (err) {
      res.status(500).json({ error: { status: 500, message: 'Failed to update pull request' } });
    }
  }

  async mergePullRequest(req, res) {
    try {
      const { repoId, pullId } = req.params;
      logger.info('Pull request merged', { pullId });
      res.json({ message: 'Pull request merged', pullId, mergedAt: new Date() });
    } catch (err) {
      res.status(500).json({ error: { status: 500, message: 'Failed to merge pull request' } });
    }
  }

  async closePullRequest(req, res) {
    try {
      const { repoId, pullId } = req.params;
      res.json({ message: 'Pull request closed', pullId, closedAt: new Date() });
    } catch (err) {
      res.status(500).json({ error: { status: 500, message: 'Failed to close pull request' } });
    }
  }
}

module.exports = new PullController();
