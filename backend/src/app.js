const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const repoRoutes = require('./routes/repositories');
const issueRoutes = require('./routes/issues');
const pullRoutes = require('./routes/pulls');
const userRoutes = require('./routes/users');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));

const limiter = rateLimit({
  windowMs: 900000,
  max: 100
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Davidhub Backend', creator: 'David Adriano Ferrari dos Santos' });
});

app.use('/api/auth', authRoutes);
app.use('/api/repos', repoRoutes);
app.use('/api/repos/:repoId/issues', issueRoutes);
app.use('/api/repos/:repoId/pulls', pullRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: `Route ${req.path} not found` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  logger.info(`🚀 Davidhub Server running on http://${HOST}:${PORT}`);
});

module.exports = app;
