/**
 * Fuel & Expense Controller
 * Handles fuel logs and operational expenses
 */

const fuelExpenseService = require('../services/fuelExpense.service');

class FuelExpenseController {
  // Fuel Logs
  async getFuelLogs(req, res, next) {
    try {
      const filters = { vehicle_id: req.query.vehicle_id };
      const logs = await fuelExpenseService.getAllFuelLogs(filters);
      res.json({ success: true, data: logs });
    } catch (err) {
      next(err);
    }
  }

  async createFuelLog(req, res, next) {
    try {
      const log = await fuelExpenseService.createFuelLog(req.body);
      res.status(201).json({ success: true, data: log });
    } catch (err) {
      next(err);
    }
  }

  // Expenses
  async getExpenses(req, res, next) {
    try {
      const filters = { 
        category: req.query.category,
        vehicle_id: req.query.vehicle_id 
      };
      const expenses = await fuelExpenseService.getAllExpenses(filters);
      res.json({ success: true, data: expenses });
    } catch (err) {
      next(err);
    }
  }

  async createExpense(req, res, next) {
    try {
      const expense = await fuelExpenseService.createExpense(req.body);
      res.status(201).json({ success: true, data: expense });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new FuelExpenseController();
