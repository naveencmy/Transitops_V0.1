/**
 * Trip Service Unit Tests
 * Critical business rule validation
 */

const tripService = require('../../src/services/trip.service');
const vehicleRepository = require('../../src/repositories/vehicle.repository');
const driverRepository = require('../../src/repositories/driver.repository');
const tripRepository = require('../../src/repositories/trip.repository');
const { withTransaction } = require('../../src/config/database');

// Mock all dependencies
jest.mock('../../src/repositories/vehicle.repository');
jest.mock('../../src/repositories/driver.repository');
jest.mock('../../src/repositories/trip.repository');
jest.mock('../../src/config/database');

describe('TripService Business Rules', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock transaction to execute callback directly
    withTransaction.mockImplementation(async (callback) => {
      const mockClient = { query: jest.fn() };
      return await callback(mockClient);
    });
  });

  describe('createTrip - Rule 4: Vehicle Status Validation', () => {
    it('should reject trip with retired vehicle', async () => {
      vehicleRepository.findById.mockResolvedValue({
        id: 1, registration_number: 'TX-001', status: 'Retired', max_load_capacity_kg: 5000
      });

      await expect(tripService.createTrip({
        vehicle_id: 1, driver_id: 1, cargo_weight_kg: 1000, source: 'A', destination: 'B'
      })).rejects.toThrow('retired and cannot be assigned');
    });

    it('should reject trip with vehicle in maintenance', async () => {
      vehicleRepository.findById.mockResolvedValue({
        id: 1, registration_number: 'TX-001', status: 'InShop', max_load_capacity_kg: 5000
      });

      await expect(tripService.createTrip({
        vehicle_id: 1, driver_id: 1, cargo_weight_kg: 1000, source: 'A', destination: 'B'
      })).rejects.toThrow('in maintenance');
    });

    it('should reject trip when vehicle not found', async () => {
      vehicleRepository.findById.mockResolvedValue(null);

      await expect(tripService.createTrip({
        vehicle_id: 999, driver_id: 1, cargo_weight_kg: 1000, source: 'A', destination: 'B'
      })).rejects.toThrow('Vehicle not found');
    });
  });

  describe('createTrip - Rules 5,6,7: Driver Validation', () => {
    beforeEach(() => {
      vehicleRepository.findById.mockResolvedValue({
        id: 1, registration_number: 'TX-001', status: 'Available', max_load_capacity_kg: 5000
      });
    });

    it('should reject trip with suspended driver', async () => {
      driverRepository.findById.mockResolvedValue({
        id: 1, full_name: 'John Doe', status: 'Suspended', license_expiry: '2027-01-01'
      });

      await expect(tripService.createTrip({
        vehicle_id: 1, driver_id: 1, cargo_weight_kg: 1000, source: 'A', destination: 'B'
      })).rejects.toThrow('suspended');
    });

    it('should reject trip with expired license', async () => {
      driverRepository.findById.mockResolvedValue({
        id: 1, full_name: 'John Doe', status: 'Available', license_expiry: '2020-01-01'
      });

      await expect(tripService.createTrip({
        vehicle_id: 1, driver_id: 1, cargo_weight_kg: 1000, source: 'A', destination: 'B'
      })).rejects.toThrow('expired');
    });

    it('should reject trip when driver already on trip', async () => {
      driverRepository.findById.mockResolvedValue({
        id: 1, full_name: 'John Doe', status: 'OnTrip', license_expiry: '2027-01-01'
      });

      await expect(tripService.createTrip({
        vehicle_id: 1, driver_id: 1, cargo_weight_kg: 1000, source: 'A', destination: 'B'
      })).rejects.toThrow('already on a trip');
    });

    it('should reject trip when driver not found', async () => {
      driverRepository.findById.mockResolvedValue(null);

      await expect(tripService.createTrip({
        vehicle_id: 1, driver_id: 999, cargo_weight_kg: 1000, source: 'A', destination: 'B'
      })).rejects.toThrow('Driver not found');
    });
  });

  describe('createTrip - Rule 7: Vehicle OnTrip Mutual Exclusion', () => {
    beforeEach(() => {
      driverRepository.findById.mockResolvedValue({
        id: 1, full_name: 'John Doe', status: 'Available', license_expiry: '2027-01-01'
      });
    });

    it('should reject trip when vehicle already on trip', async () => {
      vehicleRepository.findById.mockResolvedValue({
        id: 1, registration_number: 'TX-001', status: 'OnTrip', max_load_capacity_kg: 5000
      });

      await expect(tripService.createTrip({
        vehicle_id: 1, driver_id: 1, cargo_weight_kg: 1000, source: 'A', destination: 'B'
      })).rejects.toThrow('already on a trip');
    });
  });

  describe('createTrip - Rule 8: Cargo Capacity Validation', () => {
    beforeEach(() => {
      driverRepository.findById.mockResolvedValue({
        id: 1, full_name: 'John Doe', status: 'Available', license_expiry: '2027-01-01'
      });
    });

    it('should reject trip when cargo exceeds capacity', async () => {
      vehicleRepository.findById.mockResolvedValue({
        id: 1, registration_number: 'TX-001', status: 'Available', max_load_capacity_kg: 500
      });

      await expect(tripService.createTrip({
        vehicle_id: 1, driver_id: 1, cargo_weight_kg: 600, source: 'A', destination: 'B'
      })).rejects.toThrow('exceeds vehicle capacity');
    });

    it('should allow trip when cargo is within capacity', async () => {
      vehicleRepository.findById.mockResolvedValue({
        id: 1, registration_number: 'TX-001', status: 'Available', max_load_capacity_kg: 5000
      });
      tripRepository.create.mockResolvedValue({
        id: 1, trip_code: 'TRP-0001', status: 'Draft'
      });

      const result = await tripService.createTrip({
        vehicle_id: 1, driver_id: 1, cargo_weight_kg: 1000, source: 'A', destination: 'B'
      });

      expect(result.status).toBe('Draft');
    });
  });

  describe('dispatchTrip - Rule 14: Status Transition', () => {
    it('should only allow dispatch from Draft status', async () => {
      tripRepository.findById.mockResolvedValue({
        id: 1, status: 'Completed', vehicle_id: 1, driver_id: 1
      });

      await expect(tripService.dispatchTrip(1)).rejects.toThrow("Only 'Draft' trips can be dispatched");
    });

    it('should only allow dispatch from InProgress status', async () => {
      tripRepository.findById.mockResolvedValue({
        id: 1, status: 'InProgress', vehicle_id: 1, driver_id: 1
      });

      await expect(tripService.dispatchTrip(1)).rejects.toThrow("Only 'Draft' trips can be dispatched");
    });
  });

  describe('completeTrip - Rule 15: Status Transition', () => {
    it('should only allow complete from Dispatched status', async () => {
      tripRepository.findById.mockResolvedValue({
        id: 1, status: 'Draft', vehicle_id: 1, driver_id: 1
      });

      await expect(tripService.completeTrip(1, {
        actual_distance_km: 100, fuel_consumed_liters: 50, final_odometer_km: 1000
      })).rejects.toThrow("Only 'Dispatched' or 'InProgress' trips can be completed");
    });

    it('should allow complete from InProgress status', async () => {
      tripRepository.findById.mockResolvedValue({
        id: 1, status: 'InProgress', vehicle_id: 1, driver_id: 1
      });
      vehicleRepository.updateStatus.mockResolvedValue({});
      vehicleRepository.updateOdometer.mockResolvedValue({});
      driverRepository.updateStatus.mockResolvedValue({});
      tripRepository.update.mockResolvedValue({ id: 1, status: 'Completed' });

      const result = await tripService.completeTrip(1, {
        actual_distance_km: 100, fuel_consumed_liters: 50, final_odometer_km: 1000
      });

      expect(result.status).toBe('Completed');
    });
  });

  describe('cancelTrip - Rule 16: Status Transition', () => {
    it('should not allow cancel of Completed trip', async () => {
      tripRepository.findById.mockResolvedValue({
        id: 1, status: 'Completed', vehicle_id: 1, driver_id: 1
      });

      await expect(tripService.cancelTrip(1)).rejects.toThrow('Cannot cancel trip with status');
    });

    it('should allow cancel of Draft trip', async () => {
      tripRepository.findById.mockResolvedValue({
        id: 1, status: 'Draft', vehicle_id: 1, driver_id: 1
      });
      tripRepository.updateStatus.mockResolvedValue({ id: 1, status: 'Cancelled' });

      const result = await tripService.cancelTrip(1);
      expect(result.status).toBe('Cancelled');
    });

    it('should restore vehicle/driver when cancelling Dispatched trip', async () => {
      tripRepository.findById.mockResolvedValue({
        id: 1, status: 'Dispatched', vehicle_id: 1, driver_id: 1
      });
      vehicleRepository.updateStatus.mockResolvedValue({});
      driverRepository.updateStatus.mockResolvedValue({});
      tripRepository.updateStatus.mockResolvedValue({ id: 1, status: 'Cancelled' });

      await tripService.cancelTrip(1);

      expect(vehicleRepository.updateStatus).toHaveBeenCalledWith(1, 'Available', expect.anything());
      expect(driverRepository.updateStatus).toHaveBeenCalledWith(1, 'Available', expect.anything());
    });
  });

  describe('dispatchTrip - Rule 9: Atomic Status Updates', () => {
    it('should update both vehicle and driver to OnTrip', async () => {
      tripRepository.findById.mockResolvedValue({
        id: 1, status: 'Draft', vehicle_id: 1, driver_id: 2
      });
      vehicleRepository.findById.mockResolvedValue({ id: 1, status: 'Available' });
      driverRepository.findById.mockResolvedValue({ id: 2, status: 'Available' });
      vehicleRepository.updateStatus.mockResolvedValue({});
      driverRepository.updateStatus.mockResolvedValue({});
      tripRepository.updateStatus.mockResolvedValue({ id: 1, status: 'Dispatched' });

      await tripService.dispatchTrip(1);

      expect(vehicleRepository.updateStatus).toHaveBeenCalledWith(1, 'OnTrip', expect.anything());
      expect(driverRepository.updateStatus).toHaveBeenCalledWith(2, 'OnTrip', expect.anything());
    });
  });

  describe('completeTrip - Rule 10: Atomic Status Updates', () => {
    it('should update both vehicle and driver back to Available', async () => {
      tripRepository.findById.mockResolvedValue({
        id: 1, status: 'Dispatched', vehicle_id: 1, driver_id: 2
      });
      vehicleRepository.updateStatus.mockResolvedValue({});
      vehicleRepository.updateOdometer.mockResolvedValue({});
      driverRepository.updateStatus.mockResolvedValue({});
      tripRepository.update.mockResolvedValue({ id: 1, status: 'Completed' });

      await tripService.completeTrip(1, {
        actual_distance_km: 100, fuel_consumed_liters: 50, final_odometer_km: 1000
      });

      expect(vehicleRepository.updateStatus).toHaveBeenCalledWith(1, 'Available', expect.anything());
      expect(driverRepository.updateStatus).toHaveBeenCalledWith(2, 'Available', expect.anything());
      expect(vehicleRepository.updateOdometer).toHaveBeenCalledWith(1, 1000, expect.anything());
    });
  });
});
