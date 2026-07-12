/**
 * Vehicle Controller
 * Handles vehicle CRUD operations
 */

const vehicleService = require('../services/vehicle.service');

class VehicleController {
  async getAll(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        type: req.query.type,
        search: req.query.search
      };
      const vehicles = await vehicleService.getAllVehicles(filters);
      res.json({ success: true, data: vehicles });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const vehicle = await vehicleService.getVehicleById(req.params.id);
      res.json({ success: true, data: vehicle });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const vehicle = await vehicleService.createVehicle(req.body);
      res.status(201).json({ success: true, data: vehicle });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
      res.json({ success: true, data: vehicle });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await vehicleService.deleteVehicle(req.params.id);
      res.json({ success: true, message: 'Vehicle deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new VehicleController();
