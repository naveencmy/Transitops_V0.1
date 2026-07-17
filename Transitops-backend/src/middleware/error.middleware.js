/**
 * Global Error Handler Middleware
 * Catches all errors and returns clean JSON responses
 */

const { AppError } = require('../utils/errors');
const env = require('../config/env');

/**
 * Format validation error details
 * @param {Array} details 
 * @returns {Array}
 */
function formatValidationDetails(details) {
  return details.map(d => ({
    field: d.field || d.path,
    message: d.message
  }));
}

/**
 * Global error handler
 * Must have 4 parameters to be recognized as error middleware
 */
function errorHandler(err, req, res, next) {
  // Log error
  console.error(`[ERROR] ${err.name || 'Error'}: ${err.message}`);
  if (env.isDevelopment() && err.stack) {
    console.error(err.stack);
  }

  // Operational errors (expected)
  if (err instanceof AppError) {
    const response = {
      success: false,
      error: {
        code: err.code,
        message: err.message
      }
    };

    if (err.details && err.details.length > 0) {
      response.error.details = formatValidationDetails(err.details);
    }

    return res.status(err.statusCode).json(response);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token'
      }
    });
  }

  // PostgreSQL unique constraint violation
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      error: {
        code: 'CONFLICT',
        message: 'A record with that value already exists'
      }
    });
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Referenced record does not exist'
      }
    });
  }

  // Default: internal server error
  console.error('[500] Unexpected error:', err.message);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
}

/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    }
  });
}

module.exports = { errorHandler, notFoundHandler };
