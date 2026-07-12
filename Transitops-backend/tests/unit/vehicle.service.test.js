/**
 * Vehicle Service Unit Tests
 */

const vehicleService = require('../../src/services/vehicle.service');
const vehicleRepository = require('../../src/repositories/vehicle.repository');

jest.mock('../../src/repositories/vehicle.repository');

describe('VehicleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createVehicle', () => {
    it('should reject duplicate registration number', async () => {
      vehicleRepository.findByRegistrationNumber.mockResolvedValue({
        id: 1, registration_number: 'TX-001'
      });

      await expect(vehicleService.createVehicle({
        registration_number: 'TX-001', name: 'Test', max_load_capacity_kg: 1000
      })).rejects.toThrow('already exists');
    });

    it('should create vehicle with unique registration', async () => {
      vehicleRepository.findByRegistrationNumber.mockResolvedValue(null);
      vehicleRepository.create.mockResolvedValue({
        id: 1, registration_number: 'TX-001', status: 'Available'
      });

      const result = await vehicleService.createVehicle({
        registration_number: 'TX-001', name: 'Test', max_load_capacity_kg: 1000
      });

      expect(result.status).toBe('Available');
    });
  });

  describe('deleteVehicle', () => {
    it('should reject deletion of vehicle on trip', async () => {
      vehicleRepository.findById.mockResolvedValue({
        id: 1, status: 'OnTrip'
      });

      await expect(vehicleService.deleteVehicle(1)).rejects.toThrow('on a trip');
    });

    it('should allow deletion of available vehicle', async () => {
      vehicleRepository.findById.mockResolvedValue({
        id: 1, status: 'Available'
      });
      vehicleRepository.delete.mockResolvedValue({ id: 1 });

      const result = await vehicleService.deleteVehicle(1);
      expect(result.id).toBe(1);
    });
  });
});
