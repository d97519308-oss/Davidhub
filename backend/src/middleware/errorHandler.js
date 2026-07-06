const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', { message: err.message, path: req.path });
  
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: { status: statusCode, message }
  });
};

module.exports = errorHandler;
