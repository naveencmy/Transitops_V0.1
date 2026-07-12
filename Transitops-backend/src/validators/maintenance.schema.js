const Joi = require('joi');

const maintenanceCreateSchema = Joi.object({
  vehicle_id: Joi.number().integer().positive().required().messages({
    'any.required': 'Vehicle is required'
  }),
  maintenance_type: Joi.string().max(100).required().messages({
    'any.required': 'Maintenance type is required'
  }),
  description: Joi.string().max(500).optional().allow(''),
  cost: Joi.number().min(0).optional().allow(null),
  scheduled_date: Joi.date().iso().optional().allow(null)
});

module.exports = { maintenanceCreateSchema };
