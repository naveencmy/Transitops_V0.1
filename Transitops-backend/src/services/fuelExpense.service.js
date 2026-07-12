/**
 * Fuel & Expense Service
 * Business logic for fuel logs and operational expenses
 */

const fuelExpenseRepository = require('../repositories/fuelExpense.repository');
const vehicleRepository = require('../repositories/vehicle.repository');
const { NotFoundError } = require('../utils/errors');

class FuelExpenseService {
  // Fuel Logs
  async getAllFuelLogs(filters = {}) {
    return await fuelExpenseRepository.findAllFuelLogs(filters);
  }

  async createFuelLog(fuelData) {
    // Validate vehicle exists
    const vehicle = await vehicleRepository.findById(fuelData.vehicle_id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle');
    }

    // Calculate total cost
    const total_cost = fuelData.liters * fuelData.cost_per_liter;

    return await fuelExpenseRepository.createFuelLog({
      ...fuelData,
      total_cost: parseFloat(total_cost.toFixed(2))
    });
  }

  async getFuelStats() {
    return await fuelExpenseRepository.getFuelStats();
  }

  // Expenses
  async getAllExpenses(filters = {}) {
    return await fuelExpenseRepository.findAllExpenses(filters);
  }

  async createExpense(expenseData) {
    // Validate vehicle if provided
    if (expenseData.vehicle_id) {
      const vehicle = await vehicleRepository.findById(expenseData.vehicle_id);
      if (!vehicle) {
        throw new NotFoundError('Vehicle');
      }
    }

    return await fuelExpenseRepository.createExpense(expenseData);
  }

  async getExpenseStats() {
    return await fuelExpenseRepository.getExpenseStats();
  }

  async getWeeklyTrends() {
    return await fuelExpenseRepository.getWeeklyTrends();
  }
}

module.exports = new FuelExpenseService();
