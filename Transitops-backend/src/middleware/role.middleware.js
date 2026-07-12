/**
 * Role-Based Access Control Middleware
 * Checks if the authenticated user has permission to access a route
 */

const { ForbiddenError } = require('../utils/errors');
const { ROLE_PERMISSIONS } = require('../utils/constants');

/**
 * Check if user role has permission for a module
 * Admin always has access
 * @param {string} role - User role name
 * @param {string} moduleName - Module being accessed
 * @returns {boolean}
 */
function hasPermission(role, moduleName) {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  if (permissions.includes('*')) return true;
  return permissions.includes(moduleName);
}

/**
 * Middleware factory for role-based access
 * @param {string} moduleName - The module this route belongs to
 * @returns {Function} Express middleware
 */
function requireRole(moduleName) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ForbiddenError('Authentication required'));
    }

    const userRole = req.user.role;

    if (!hasPermission(userRole, moduleName)) {
      return next(new ForbiddenError(`Access denied. Required role for '${moduleName}'`));
    }

    next();
  };
}

/**
 * Middleware to require specific roles (array)
 * @param {Array<string>} allowedRoles 
 * @returns {Function}
 */
function requireRoles(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ForbiddenError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Access denied. Required roles: ${allowedRoles.join(', ')}`));
    }

    next();
  };
}

module.exports = { requireRole, requireRoles, hasPermission };
