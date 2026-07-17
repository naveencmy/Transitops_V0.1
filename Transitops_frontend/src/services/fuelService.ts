import type { FuelRecord } from '../types';
import { authFetch, mapFuelRecord } from './api';

export const fuelService = {
  async getFuelLogs(): Promise<FuelRecord[]> {
    const response = await authFetch('/api/v1/fuel/logs');
    if (!response.ok) throw new Error('Failed to fetch fuel logs');
    const json = await response.json();
    const data = json.data ?? json;
    return Array.isArray(data) ? data.map(mapFuelRecord) : [];
  },
  async getFuelLogsByVehicle(vehicleId: string): Promise<FuelRecord[]> {
    const response = await authFetch(`/api/v1/fuel/logs?vehicleId=${encodeURIComponent(vehicleId)}`);
    if (!response.ok) throw new Error('Failed to fetch fuel logs');
    const json = await response.json();
    const data = json.data ?? json;
    return Array.isArray(data) ? data.map(mapFuelRecord) : [];
  },
  async createFuelLog(fuelData: Partial<FuelRecord>): Promise<FuelRecord> {
    const response = await authFetch('/api/v1/fuel/logs', {
      method: 'POST',
      body: JSON.stringify(fuelData),
    });
    if (!response.ok) throw new Error('Failed to create fuel log');
    const json = await response.json();
    return mapFuelRecord(json.data ?? json);
  },
  async updateFuelLog(id: string, fuelData: Partial<FuelRecord>): Promise<FuelRecord> {
    const response = await authFetch(`/api/v1/fuel/logs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(fuelData),
    });
    if (!response.ok) throw new Error('Failed to update fuel log');
    const json = await response.json();
    return mapFuelRecord(json.data ?? json);
  },
  async deleteFuelLog(id: string): Promise<void> {
    const response = await authFetch(`/api/v1/fuel/logs/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete fuel log');
  },
};
