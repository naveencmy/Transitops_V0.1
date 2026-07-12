/**
 * Driver Service
 * Business logic for driver operations
 * Enforces: unique license, license expiry validation
 */

const driverRepository = require('../repositories/driver.repository');
const { ConflictError, NotFoundError, BadRequestError } = require('../utils/errors');
const { DRIVER_STATUS } = require('../utils/constants');
const { isLicenseExpired } = require('../utils/helpers');

class DriverService {
  async getAllDrivers(filters = {}) {
    return await driverRepository.findAll(filters);
  }

  async getDriverById(id) {
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new NotFoundError('Driver');
    }
    return driver;
  }

  async createDriver(driverData) {
    // Check unique license number
    const existing = await driverRepository.findByLicenseNumber(driverData.license_number);
    if (existing) {
      throw new ConflictError(`Driver with license number '${driverData.license_number}' already exists`);
    }

    // Check if license is already expired
    if (isLicenseExpired(driverData.license_expiry)) {
      throw new BadRequestError('License has already expired');
    }

    return await driverRepository.create(driverData);
  }

  async updateDriver(id, updates) {
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new NotFoundError('Driver');
    }

    // If updating license number, check uniqueness
    if (updates.license_number && updates.license_number !== driver.license_number) {
      const existing = await driverRepository.findByLicenseNumber(updates.license_number);
      if (existing) {
        throw new ConflictError(`License number '${updates.license_number}' already exists`);
      }
    }

    // If updating license expiry, validate it's not in the past
    if (updates.license_expiry && isLicenseExpired(updates.license_expiry)) {
      throw new BadRequestError('License expiry cannot be in the past');
    }

    return await driverRepository.update(id, updates);
  }

  async deleteDriver(id) {
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new NotFoundError('Driver');
    }

    // Prevent deletion if driver is on trip
    if (driver.status === DRIVER_STATUS.ON_TRIP) {
      throw new BadRequestError('Cannot delete driver that is currently on a trip');
    }

    return await driverRepository.delete(id);
  }

  async getAvailableForDispatch() {
    return await driverRepository.getAvailableForDispatch();
  }

  async getDriverStats() {
    return await driverRepository.countByStatus();
  }

  /**
   * Check if driver can be assigned to a trip
   * @param {number} driverId 
   * @returns {Object} { canAssign: boolean, reason: string|null }
   */
  async canAssignToTrip(driverId) {
    const driver = await driverRepository.findById(driverId);
    if (!driver) {
      return { canAssign: false, reason: 'Driver not found' };
    }

    if (driver.status === DRIVER_STATUS.SUSPENDED) {
      return { canAssign: false, reason: 'Driver is suspended' };
    }

    if (driver.status === DRIVER_STATUS.ON_TRIP) {
      return { canAssign: false, reason: 'Driver is already on a trip' };
    }

    if (isLicenseExpired(driver.license_expiry)) {
      return { canAssign: false, reason: 'Driver license has expired' };
    }

    return { canAssign: true, reason: null };
  }
}

module.exports = new DriverService();
