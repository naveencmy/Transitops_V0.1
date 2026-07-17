/**
 * Trip Service
 * THE MOST COMPLEX FILE - enforces all 16 business rules
 * Handles trip lifecycle: Draft → Dispatched → Completed/Cancelled
 */

const tripRepository = require('../repositories/trip.repository');
const vehicleRepository = require('../repositories/vehicle.repository');
const driverRepository = require('../repositories/driver.repository');
const { 
  NotFoundError, 
  BadRequestError, 
  ConflictError 
} = require('../utils/errors');
const { VEHICLE_STATUS, DRIVER_STATUS, TRIP_STATUS } = require('../utils/constants');
const { isLicenseExpired } = require('../utils/helpers');
const { withTransaction } = require('../config/database');

class TripService {
  async getAllTrips(filters = {}) {
    return await tripRepository.findAll(filters);
  }

  async getTripById(id) {
    const trip = await tripRepository.findById(id);
    if (!trip) {
      throw new NotFoundError('Trip');
    }
    return trip;
  }

  /**
   * Create a new trip (Draft status)
   * Enforces Rules: 4, 5, 6, 7, 8
   */
  async createTrip(tripData) {
    const { vehicle_id, driver_id, cargo_weight_kg } = tripData;

    // Rule 4: Vehicle must exist and not be Retired or InShop
    const vehicle = await vehicleRepository.findById(vehicle_id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle');
    }
    if (vehicle.status === VEHICLE_STATUS.RETIRED) {
      throw new BadRequestError(`Vehicle ${vehicle.registration_number} is retired and cannot be assigned to trips`);
    }
    if (vehicle.status === VEHICLE_STATUS.IN_SHOP) {
      throw new BadRequestError(`Vehicle ${vehicle.registration_number} is in maintenance and cannot be assigned to trips`);
    }

    // Rule 5, 6, 7: Driver validations
    const driver = await driverRepository.findById(driver_id);
    if (!driver) {
      throw new NotFoundError('Driver');
    }
    if (driver.status === DRIVER_STATUS.SUSPENDED) {
      throw new BadRequestError(`Driver ${driver.full_name} is suspended and cannot be assigned to trips`);
    }
    if (isLicenseExpired(driver.license_expiry)) {
      throw new BadRequestError(`Driver ${driver.full_name}'s license has expired (${driver.license_expiry})`);
    }
    if (driver.status === DRIVER_STATUS.ON_TRIP) {
      throw new BadRequestError(`Driver ${driver.full_name} is already on a trip`);
    }

    // Rule 7: Vehicle must not be on another trip
    if (vehicle.status === VEHICLE_STATUS.ON_TRIP) {
      throw new BadRequestError(`Vehicle ${vehicle.registration_number} is already on a trip`);
    }

    // Rule 8: Cargo weight must not exceed capacity
    if (cargo_weight_kg > vehicle.max_load_capacity_kg) {
      throw new BadRequestError(
        `Cargo weight (${cargo_weight_kg}kg) exceeds vehicle capacity (${vehicle.max_load_capacity_kg}kg)`
      );
    }

    // Generate unique trip code
    const tripCode = await this.generateUniqueTripCode();

    return await tripRepository.create({
      ...tripData,
      trip_code: tripCode
    });
  }

  async generateUniqueTripCode(attempt = 0) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const code = `TRP-${String(timestamp).slice(-4)}${String(random).padStart(3, '0')}`;

    // Ensure uniqueness (max 10 retries)
    const existing = await tripRepository.findByTripCode(code);
    if (existing && attempt < 10) {
      return this.generateUniqueTripCode(attempt + 1);
    }
    return code;
  }

  /**
   * Dispatch a trip
   * Enforces Rules: 9, 14
   */
  async dispatchTrip(id) {
    return await withTransaction(async (client) => {
      const trip = await tripRepository.findById(id);
      if (!trip) {
        throw new NotFoundError('Trip');
      }

      // Rule 14: Only Draft → Dispatched
      if (trip.status !== TRIP_STATUS.DRAFT) {
        throw new BadRequestError(`Cannot dispatch trip with status '${trip.status}'. Only 'Draft' trips can be dispatched.`);
      }

      // Re-validate vehicle and driver are still available
      const vehicle = await vehicleRepository.findById(trip.vehicle_id);
      const driver = await driverRepository.findById(trip.driver_id);

      if (vehicle.status !== VEHICLE_STATUS.AVAILABLE) {
        throw new BadRequestError(`Vehicle ${vehicle.registration_number} is no longer available (status: ${vehicle.status})`);
      }
      if (driver.status !== DRIVER_STATUS.AVAILABLE) {
        throw new BadRequestError(`Driver ${driver.full_name} is no longer available (status: ${driver.status})`);
      }

      // Rule 9: Atomic status updates - both to OnTrip
      await vehicleRepository.updateStatus(trip.vehicle_id, VEHICLE_STATUS.ON_TRIP, client);
      await driverRepository.updateStatus(trip.driver_id, DRIVER_STATUS.ON_TRIP, client);

      // Update trip status
      const updatedTrip = await tripRepository.updateStatus(id, TRIP_STATUS.DISPATCHED, client);

      return updatedTrip;
    });
  }

  /**
   * Complete a trip
   * Enforces Rules: 10, 15
   */
  async completeTrip(id, completionData) {
    const { actual_distance_km, fuel_consumed_liters, final_odometer_km } = completionData;

    return await withTransaction(async (client) => {
      const trip = await tripRepository.findById(id);
      if (!trip) {
        throw new NotFoundError('Trip');
      }

      // Rule 15: Only Dispatched → Completed
      if (trip.status !== TRIP_STATUS.DISPATCHED && trip.status !== TRIP_STATUS.IN_PROGRESS) {
        throw new BadRequestError(`Cannot complete trip with status '${trip.status}'. Only 'Dispatched' or 'InProgress' trips can be completed.`);
      }

      // Rule 10: Atomic status updates - both back to Available
      await vehicleRepository.updateStatus(trip.vehicle_id, VEHICLE_STATUS.AVAILABLE, client);
      await vehicleRepository.updateOdometer(trip.vehicle_id, final_odometer_km, client);
      await driverRepository.updateStatus(trip.driver_id, DRIVER_STATUS.AVAILABLE, client);

      // Update trip with completion data
      const updatedTrip = await tripRepository.update(id, {
        status: TRIP_STATUS.COMPLETED,
        actual_distance_km,
        fuel_consumed_liters,
        completed_at: new Date()
      }, client);

      return updatedTrip;
    });
  }

  /**
   * Cancel a trip
   * Enforces Rules: 11, 16
   */
  async cancelTrip(id) {
    return await withTransaction(async (client) => {
      const trip = await tripRepository.findById(id);
      if (!trip) {
        throw new NotFoundError('Trip');
      }

      // Rule 16: Only Draft/Dispatched → Cancelled
      if (![TRIP_STATUS.DRAFT, TRIP_STATUS.DISPATCHED, TRIP_STATUS.IN_PROGRESS].includes(trip.status)) {
        throw new BadRequestError(`Cannot cancel trip with status '${trip.status}'. Only 'Draft', 'Dispatched', or 'InProgress' trips can be cancelled.`);
      }

      // Rule 11: If Dispatched/InProgress, restore vehicle/driver to Available
      if (trip.status === TRIP_STATUS.DISPATCHED || trip.status === TRIP_STATUS.IN_PROGRESS) {
        await vehicleRepository.updateStatus(trip.vehicle_id, VEHICLE_STATUS.AVAILABLE, client);
        await driverRepository.updateStatus(trip.driver_id, DRIVER_STATUS.AVAILABLE, client);
      }

      const updatedTrip = await tripRepository.updateStatus(id, TRIP_STATUS.CANCELLED, client);
      return updatedTrip;
    });
  }

  async updateTrip(id, updates) {
    const trip = await tripRepository.findById(id);
    if (!trip) {
      throw new NotFoundError('Trip');
    }

    // Only allow updates on Draft trips
    if (trip.status !== TRIP_STATUS.DRAFT) {
      throw new BadRequestError('Only Draft trips can be updated');
    }

    // If changing vehicle, validate new vehicle
    if (updates.vehicle_id && updates.vehicle_id !== trip.vehicle_id) {
      const vehicle = await vehicleRepository.findById(updates.vehicle_id);
      if (!vehicle) {
        throw new NotFoundError('Vehicle');
      }
      if (vehicle.status === VEHICLE_STATUS.RETIRED || vehicle.status === VEHICLE_STATUS.IN_SHOP) {
        throw new BadRequestError('Selected vehicle is not available for dispatch');
      }
      if (vehicle.status === VEHICLE_STATUS.ON_TRIP) {
        throw new BadRequestError('Selected vehicle is already on a trip');
      }
    }

    // If changing driver, validate new driver
    if (updates.driver_id && updates.driver_id !== trip.driver_id) {
      const driver = await driverRepository.findById(updates.driver_id);
      if (!driver) {
        throw new NotFoundError('Driver');
      }
      if (driver.status === DRIVER_STATUS.SUSPENDED) {
        throw new BadRequestError('Selected driver is suspended');
      }
      if (isLicenseExpired(driver.license_expiry)) {
        throw new BadRequestError('Selected driver has an expired license');
      }
      if (driver.status === DRIVER_STATUS.ON_TRIP) {
        throw new BadRequestError('Selected driver is already on a trip');
      }
    }

    // If changing cargo weight, validate capacity
    if (updates.cargo_weight_kg) {
      const vehicleId = updates.vehicle_id || trip.vehicle_id;
      const vehicle = await vehicleRepository.findById(vehicleId);
      if (updates.cargo_weight_kg > vehicle.max_load_capacity_kg) {
        throw new BadRequestError(
          `Cargo weight (${updates.cargo_weight_kg}kg) exceeds vehicle capacity (${vehicle.max_load_capacity_kg}kg)`
        );
      }
    }

    return await tripRepository.update(id, updates);
  }

  async deleteTrip(id) {
    const trip = await tripRepository.findById(id);
    if (!trip) {
      throw new NotFoundError('Trip');
    }

    // Only allow deletion of Draft or Cancelled trips
    if (![TRIP_STATUS.DRAFT, TRIP_STATUS.CANCELLED].includes(trip.status)) {
      throw new BadRequestError('Only Draft or Cancelled trips can be deleted');
    }

    return await tripRepository.delete(id);
  }
}

module.exports = new TripService();
