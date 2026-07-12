/**
 * Maintenance Controller
 * Handles maintenance record operations
 */

const maintenanceService = require('../services/maintenance.service');

class MaintenanceController {
  async getAll(req, res, next) {
    try {
      const filters = { 
        status: req.query.status, 
        vehicle_id: req.query.vehicle_id 
      };
      const records = await maintenanceService.getAllMaintenance(filters);
      res.json({ success: true, data: records });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const record = await maintenanceService.getMaintenanceById(req.params.id);
      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const record = await maintenanceService.createMaintenance(req.body);
      res.status(201).json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }

  async close(req, res, next) {
    try {
      const record = await maintenanceService.closeMaintenance(req.params.id);
      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const record = await maintenanceService.updateMaintenance(req.params.id, req.body);
      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await maintenanceService.deleteMaintenance(req.params.id);
      res.json({ success: true, message: 'Maintenance record deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MaintenanceController();
