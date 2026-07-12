/**
 * Driver Controller
 * Handles driver CRUD operations
 */

const driverService = require('../services/driver.service');

class DriverController {
  async getAll(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        search: req.query.search
      };
      const drivers = await driverService.getAllDrivers(filters);
      res.json({ success: true, data: drivers });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const driver = await driverService.getDriverById(req.params.id);
      res.json({ success: true, data: driver });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const driver = await driverService.createDriver(req.body);
      res.status(201).json({ success: true, data: driver });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const driver = await driverService.updateDriver(req.params.id, req.body);
      res.json({ success: true, data: driver });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await driverService.deleteDriver(req.params.id);
      res.json({ success: true, message: 'Driver deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DriverController();
