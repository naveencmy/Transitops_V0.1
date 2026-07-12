/**
 * JWT Authentication Middleware
 * Verifies token and attaches user to request
 */

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { UnauthorizedError } = require('../utils/errors');
const { query } = require('../config/database');

/**
 * Extract token from Authorization header
 * @param {string} authHeader 
 * @returns {string|null}
 */
function extractToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Authentication middleware
 * Verifies JWT and loads user with role from database
 */
async function authenticate(req, res, next) {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      throw new UnauthorizedError('Access token is required');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Load user with role from database
    const userResult = await query(`
      SELECT u.id, u.email, u.full_name, u.status, r.name as role
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = $1
    `, [decoded.userId]);

    if (userResult.rows.length === 0) {
      throw new UnauthorizedError('User not found');
    }

    const user = userResult.rows[0];

    if (user.status !== 'active') {
      throw new UnauthorizedError('Account is inactive');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Invalid or expired token'));
    }
    next(err);
  }
}

module.exports = { authenticate };
