import type { FuelRecord } from '../types';
import { authFetch, mapExpense, mapFuelRecord } from './api';

export const expenseService = {
  async getExpenses(): Promise<any[]> {
    const response = await authFetch('/api/v1/expenses');
    if (!response.ok) throw new Error('Failed to fetch expenses');
    const json = await response.json();
    const data = json.data ?? json;
    return Array.isArray(data) ? data.map(mapExpense) : [];
  },
  async getFuelRecords(): Promise<FuelRecord[]> {
    const response = await authFetch('/api/v1/fuel/logs');
    if (!response.ok) throw new Error('Failed to fetch fuel records');
    const json = await response.json();
    const data = json.data ?? json;
    return Array.isArray(data) ? data.map(mapFuelRecord) : [];
  },
  async getExpensesByVehicle(vehicleId: string): Promise<any[]> {
    const response = await authFetch(`/api/v1/expenses?vehicleId=${encodeURIComponent(vehicleId)}`);
    if (!response.ok) throw new Error('Failed to fetch expenses');
    const json = await response.json();
    const data = json.data ?? json;
    return Array.isArray(data) ? data.map(mapExpense) : [];
  },
  async getFuelByVehicle(vehicleId: string): Promise<FuelRecord[]> {
    const response = await authFetch(`/api/v1/fuel/logs?vehicleId=${encodeURIComponent(vehicleId)}`);
    if (!response.ok) throw new Error('Failed to fetch fuel records');
    const json = await response.json();
    const data = json.data ?? json;
    return Array.isArray(data) ? data.map(mapFuelRecord) : [];
  },
  async createExpense(expenseData: any): Promise<any> {
    const response = await authFetch('/api/v1/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
    if (!response.ok) throw new Error('Failed to create expense');
    const json = await response.json();
    return mapExpense(json.data ?? json);
  },
  async updateExpense(id: string, expenseData: any): Promise<any> {
    const response = await authFetch(`/api/v1/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData),
    });
    if (!response.ok) throw new Error('Failed to update expense');
    const json = await response.json();
    return mapExpense(json.data ?? json);
  },
  async deleteExpense(id: string): Promise<void> {
    const response = await authFetch(`/api/v1/expenses/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete expense');
  },
};
