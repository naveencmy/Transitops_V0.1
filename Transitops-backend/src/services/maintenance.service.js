/**
 * Maintenance Service
 * Business logic for maintenance operations
 * Enforces Rules: 12, 13
 */

const maintenanceRepository = require('../repositories/maintenance.repository');
const vehicleRepository = require('../repositories/vehicle.repository');
const { NotFoundError, BadRequestError } = require('../utils/errors');
const { VEHICLE_STATUS, MAINTENANCE_STATUS } = require('../utils/constants');
const { withTransaction } = require('../config/database');

class MaintenanceService {
  async getAllMaintenance(filters = {}) {
    return await maintenanceRepository.findAll(filters);
  }

  async getMaintenanceById(id) {
    const record = await maintenanceRepository.findById(id);
    if (!record) {
      throw new NotFoundError('Maintenance record');
    }
    return record;
  }

  /**
   * Create maintenance record
   * Enforces Rule 12: Vehicle must NOT be OnTrip, set to InShop
   */
  async createMaintenance(maintenanceData) {
    const { vehicle_id } = maintenanceData;

    // Validate vehicle exists
    const vehicle = await vehicleRepository.findById(vehicle_id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle');
    }

    // Rule 12: Vehicle must NOT be OnTrip
    if (vehicle.status === VEHICLE_STATUS.ON_TRIP) {
      throw new BadRequestError(`Vehicle ${vehicle.registration_number} is currently on a trip and cannot be put in maintenance`);
    }

    return await withTransaction(async (client) => {
      // Create maintenance record
      const record = await maintenanceRepository.create(maintenanceData, client);

      // Set vehicle to InShop
      await vehicleRepository.updateStatus(vehicle_id, VEHICLE_STATUS.IN_SHOP, client);

      return record;
    });
  }

  /**
   * Close maintenance record
   * Enforces Rule 13: Only Open logs can be closed, restore vehicle to Available
   */
  async closeMaintenance(id) {
    const record = await maintenanceRepository.findById(id);
    if (!record) {
      throw new NotFoundError('Maintenance record');
    }

    // Rule 13: Only Open logs can be closed
    if (record.status === MAINTENANCE_STATUS.COMPLETED) {
      throw new BadRequestError('Maintenance record is already closed');
    }

    return await withTransaction(async (client) => {
      // Close maintenance
      const updated = await maintenanceRepository.close(id, client);

      // Restore vehicle to Available
      await vehicleRepository.updateStatus(record.vehicle_id, VEHICLE_STATUS.AVAILABLE, client);

      return updated;
    });
  }

  async updateMaintenance(id, updates) {
    const record = await maintenanceRepository.findById(id);
    if (!record) {
      throw new NotFoundError('Maintenance record');
    }

    if (record.status === MAINTENANCE_STATUS.COMPLETED) {
      throw new BadRequestError('Cannot update completed maintenance record');
    }

    // If status is changing to Completed, restore vehicle to Available
    if (updates.status === MAINTENANCE_STATUS.COMPLETED && record.status !== MAINTENANCE_STATUS.COMPLETED) {
      return await withTransaction(async (client) => {
        const updated = await maintenanceRepository.update(id, updates, client);
        await vehicleRepository.updateStatus(record.vehicle_id, VEHICLE_STATUS.AVAILABLE, client);
        return updated;
      });
    }

    return await maintenanceRepository.update(id, updates);
  }

  async deleteMaintenance(id) {
    const record = await maintenanceRepository.findById(id);
    if (!record) {
      throw new NotFoundError('Maintenance record');
    }

    // If deleting an active maintenance, restore vehicle
    if (record.status !== MAINTENANCE_STATUS.COMPLETED) {
      await vehicleRepository.updateStatus(record.vehicle_id, VEHICLE_STATUS.AVAILABLE);
    }

    return await maintenanceRepository.delete(id);
  }

  async getMaintenanceStats() {
    return await maintenanceRepository.countByStatus();
  }
}

module.exports = new MaintenanceService();
