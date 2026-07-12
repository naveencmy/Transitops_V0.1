/**
 * Joi Schema Validation Middleware
 * Validates request body against Joi schemas
 */

const { ValidationError } = require('../utils/errors');

/**
 * Validate request body against a Joi schema
 * @param {Joi.ObjectSchema} schema 
 * @returns {Function} Express middleware
 */
function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }));
      return next(new ValidationError('Validation failed', details));
    }

    req.body = value;
    next();
  };
}

/**
 * Validate query parameters against a Joi schema
 * @param {Joi.ObjectSchema} schema 
 * @returns {Function}
 */
function validateQuery(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false
    });

    if (error) {
      const details = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }));
      return next(new ValidationError('Query validation failed', details));
    }

    req.query = value;
    next();
  };
}

module.exports = { validateBody, validateQuery };
