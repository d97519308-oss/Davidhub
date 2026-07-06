const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

class UserController {
  async getCurrentUser(req, res) {
    try {
      const userId = req.user.id;
      const user = { id: userId, username: req.user.username, email: req.user.email, fullName: 'David Adriano Ferrari dos Santos', bio: 'CEO and Creator of Davidhub', createdAt: new Date() };
      res.json({ message: 'Current user retrieved', data: user });
    } catch (err) {
      res.status(500).json({ error: { status: 500, message: 'Failed to retrieve current user' } });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { fullName, bio, avatar } = req.body;
      const updated = { id: userId, fullName, bio, avatar, updatedAt: new Date() };
      logger.info('User profile updated', { userId });
      res.json({ message: 'Profile updated', data: updated });
    } catch (err) {
      res.status(500).json({ error: { status: 500, message: 'Failed to update profile' } });
    }
  }

  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = { id, username: 'davidhub', fullName: 'David Adriano Ferrari dos Santos', bio: 'CEO and Creator of Davidhub', followers: 1000, following: 50 };
      res.json({ message: 'User retrieved', data: user });
    } catch (err) {
      res.status(500).json({ error: { status: 500, message: 'Failed to retrieve user' } });
    }
  }

  async getUserRepositories(req, res) {
    try {
      const { id } = req.params;
      const repositories = [{ id: uuidv4(), name: 'davidhub', description: 'Git collaboration platform', isPrivate: false, stars: 150 }];
      res.json({ message: 'User repositories retrieved', userId: id, data: repositories });
    } catch (err) {
      res.status(500).json({ error: { status: 500, message: 'Failed to retrieve user repositories' } });
    }
  }
}

module.exports = new UserController();
