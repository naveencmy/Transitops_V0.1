const Joi = require('joi');

const tripCreateSchema = Joi.object({
  source: Joi.string().max(200).required().messages({
    'string.max': 'Source cannot exceed 200 characters',
    'any.required': 'Source is required'
  }),
  destination: Joi.string().max(200).required().messages({
    'string.max': 'Destination cannot exceed 200 characters',
    'any.required': 'Destination is required'
  }),
  vehicle_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Vehicle ID must be a number',
    'any.required': 'Vehicle is required'
  }),
  driver_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Driver ID must be a number',
    'any.required': 'Driver is required'
  }),
  cargo_weight_kg: Joi.number().positive().required().messages({
    'number.positive': 'Cargo weight must be positive',
    'any.required': 'Cargo weight is required'
  }),
  planned_distance_km: Joi.number().positive().optional().allow(null),
  revenue: Joi.number().min(0).optional().allow(null)
});

const tripCompleteSchema = Joi.object({
  actual_distance_km: Joi.number().min(0).required().messages({
    'number.min': 'Actual distance must be zero or positive',
    'any.required': 'Actual distance is required'
  }),
  fuel_consumed_liters: Joi.number().min(0).required().messages({
    'number.min': 'Fuel consumed must be zero or positive',
    'any.required': 'Fuel consumed is required'
  }),
  final_odometer_km: Joi.number().min(0).required().messages({
    'number.min': 'Final odometer must be zero or positive',
    'any.required': 'Final odometer is required'
  })
});

const tripUpdateSchema = Joi.object({
  source: Joi.string().max(200).optional(),
  destination: Joi.string().max(200).optional(),
  cargo_weight_kg: Joi.number().positive().optional(),
  planned_distance_km: Joi.number().positive().optional().allow(null),
  revenue: Joi.number().min(0).optional().allow(null)
});

module.exports = { tripCreateSchema, tripCompleteSchema, tripUpdateSchema };
