const { sendResponse } = require('../utils/responseHelper');

// Handle 404 errors for unknown routes
const notFoundHandler = (req, res, next) => {
  sendResponse(res, 404, null, `Route ${req.originalUrl} not found`);
};

// General error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Invalid ID format';
    return sendResponse(res, 400, null, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    return sendResponse(res, 400, null, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return sendResponse(res, 400, null, message);
  }

  // Default error response
  sendResponse(res, error.statusCode || 500, null, error.message || 'Server Error');
};

module.exports = {
  notFoundHandler,
  errorHandler
};
