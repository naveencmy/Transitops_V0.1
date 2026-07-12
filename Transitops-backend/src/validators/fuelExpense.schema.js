const Joi = require('joi');

const fuelLogSchema = Joi.object({
  vehicle_id: Joi.number().integer().positive().required(),
  trip_id: Joi.number().integer().positive().optional().allow(null),
  liters: Joi.number().positive().required().messages({
    'number.positive': 'Liters must be positive',
    'any.required': 'Liters is required'
  }),
  cost_per_liter: Joi.number().positive().required().messages({
    'number.positive': 'Cost per liter must be positive',
    'any.required': 'Cost per liter is required'
  }),
  odometer_reading: Joi.number().min(0).required().messages({
    'any.required': 'Odometer reading is required'
  }),
  station: Joi.string().max(100).optional().allow('')
});

const expenseSchema = Joi.object({
  trip_id: Joi.number().integer().positive().optional().allow(null),
  vehicle_id: Joi.number().integer().positive().optional().allow(null),
  category: Joi.string().valid('Fuel', 'Maintenance', 'Tolls', 'Insurance', 'Salaries', 'Other').required(),
  amount: Joi.number().positive().required().messages({
    'number.positive': 'Amount must be positive',
    'any.required': 'Amount is required'
  }),
  description: Joi.string().max(500).optional().allow('')
});

module.exports = { fuelLogSchema, expenseSchema };
