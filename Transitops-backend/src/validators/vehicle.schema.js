const Joi = require('joi');

const vehicleCreateSchema = Joi.object({
  registration_number: Joi.string().max(50).required().messages({
    'string.max': 'Registration number cannot exceed 50 characters',
    'any.required': 'Registration number is required'
  }),
  name: Joi.string().max(100).required().messages({
    'string.max': 'Vehicle name cannot exceed 100 characters',
    'any.required': 'Vehicle name is required'
  }),
  model: Joi.string().max(100).optional().allow(''),
  type: Joi.string().max(50).optional().allow(''),
  max_load_capacity_kg: Joi.number().positive().required().messages({
    'number.positive': 'Load capacity must be a positive number',
    'any.required': 'Maximum load capacity is required'
  }),
  odometer_km: Joi.number().min(0).default(0),
  acquisition_cost: Joi.number().min(0).optional().allow(null)
});

const vehicleUpdateSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  model: Joi.string().max(100).optional().allow(''),
  type: Joi.string().max(50).optional().allow(''),
  max_load_capacity_kg: Joi.number().positive().optional(),
  odometer_km: Joi.number().min(0).optional(),
  acquisition_cost: Joi.number().min(0).optional().allow(null),
  status: Joi.string().valid('Available', 'OnTrip', 'InShop', 'Retired').optional()
});

module.exports = { vehicleCreateSchema, vehicleUpdateSchema };
