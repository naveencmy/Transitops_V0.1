/**
 * Vehicle Service
 * Business logic for vehicle operations
 * Enforces: unique registration, status transitions
 */

const vehicleRepository = require('../repositories/vehicle.repository');
const { ConflictError, NotFoundError, BadRequestError } = require('../utils/errors');
const { VEHICLE_STATUS } = require('../utils/constants');

class VehicleService {
  async getAllVehicles(filters = {}) {
    return await vehicleRepository.findAll(filters);
  }

  async getVehicleById(id) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle');
    }
    return vehicle;
  }

  async createVehicle(vehicleData) {
    // Check unique registration number
    const existing = await vehicleRepository.findByRegistrationNumber(vehicleData.registration_number);
    if (existing) {
      throw new ConflictError(`Vehicle with registration number '${vehicleData.registration_number}' already exists`);
    }

    return await vehicleRepository.create(vehicleData);
  }

  async updateVehicle(id, updates) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle');
    }

    // If updating registration number, check uniqueness
    if (updates.registration_number && updates.registration_number !== vehicle.registration_number) {
      const existing = await vehicleRepository.findByRegistrationNumber(updates.registration_number);
      if (existing) {
        throw new ConflictError(`Registration number '${updates.registration_number}' already exists`);
      }
    }

    return await vehicleRepository.update(id, updates);
  }

  async deleteVehicle(id) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle');
    }

    // Prevent deletion if vehicle is on trip
    if (vehicle.status === VEHICLE_STATUS.ON_TRIP) {
      throw new BadRequestError('Cannot delete vehicle that is currently on a trip');
    }

    return await vehicleRepository.delete(id);
  }

  async getAvailableForDispatch() {
    return await vehicleRepository.getAvailableForDispatch();
  }

  async getVehicleStats() {
    return await vehicleRepository.countByStatus();
  }
}

module.exports = new VehicleService();
