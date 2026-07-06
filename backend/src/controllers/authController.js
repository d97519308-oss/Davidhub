const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password, fullName } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ error: { status: 400, message: 'Missing required fields' } });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { id: uuidv4(), username, email, password: hashedPassword, fullName, createdAt: new Date() };
      logger.info('User registered', { userId: user.id });
      const accessToken = jwt.sign({ id: user.id, email, username }, process.env.JWT_SECRET, { expiresIn: '7d' });
      const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      res.status(201).json({ message: 'User registered successfully', user: { id: user.id, username, email }, tokens: { accessToken, refreshToken } });
    } catch (err) {
      logger.error('Registration failed', { error: err.message });
      res.status(500).json({ error: { status: 500, message: 'Registration failed' } });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: { status: 400, message: 'Email and password required' } });
      }
      const user = { id: uuidv4(), email, username: 'testuser' };
      logger.info('User logged in', { email });
      const accessToken = jwt.sign({ id: user.id, email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
      const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      res.json({ message: 'Login successful', user, tokens: { accessToken, refreshToken } });
    } catch (err) {
      logger.error('Login failed');
      res.status(500).json({ error: { status: 500, message: 'Login failed' } });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ error: { status: 400, message: 'Refresh token required' } });
      }
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ message: 'Token refreshed', accessToken: newAccessToken });
    } catch (err) {
      res.status(401).json({ error: { status: 401, message: 'Invalid refresh token' } });
    }
  }

  async logout(req, res) {
    try {
      logger.info('User logged out');
      res.json({ message: 'Logout successful' });
    } catch (err) {
      res.status(500).json({ error: { status: 500, message: 'Logout failed' } });
    }
  }
}

module.exports = new AuthController();
