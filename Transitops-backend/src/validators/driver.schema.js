const Joi = require('joi');

const driverCreateSchema = Joi.object({
  full_name: Joi.string().max(100).required().messages({
    'any.required': 'Full name is required'
  }),
  license_number: Joi.string().max(50).required().messages({
    'any.required': 'License number is required'
  }),
  license_category: Joi.string().max(20).optional().allow(''),
  license_expiry: Joi.date().iso().required().messages({
    'date.format': 'License expiry must be a valid date (YYYY-MM-DD)',
    'any.required': 'License expiry date is required'
  }),
  contact_number: Joi.string().max(30).optional().allow(''),
  safety_score: Joi.number().min(0).max(5).optional().allow(null),
  email: Joi.string().email().optional().allow(''),
  password: Joi.string().min(6).optional()
});

const driverUpdateSchema = Joi.object({
  full_name: Joi.string().max(100).optional(),
  license_number: Joi.string().max(50).optional(),
  license_category: Joi.string().max(20).optional().allow(''),
  license_expiry: Joi.date().iso().optional(),
  contact_number: Joi.string().max(30).optional().allow(''),
  safety_score: Joi.number().min(0).max(5).optional().allow(null),
  assigned_vehicle_id: Joi.number().integer().positive().optional().allow(null)
}).min(1);

module.exports = { driverCreateSchema, driverUpdateSchema };
