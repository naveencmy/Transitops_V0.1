import { expenses, fuelRecords } from '../data/mockData';import type { Expense, FuelRecord } from '../types';import { mockRequest } from './api';

export const expenseService = {async getExpenses(): Promise<Expense[]> {return mockRequest(expenses);},async getFuelRecords(): Promise<FuelRecord[]> {return mockRequest(fuelRecords);},async getExpensesByVehicle(vehicleId: string): Promise<Expense[]> {return mockRequest(expenses.filter((e) => e.vehicleId === vehicleId));},async getFuelByVehicle(vehicleId: string): Promise<FuelRecord[]> {return mockRequest(fuelRecords.filter((f) => f.vehicleId === vehicleId));},};



