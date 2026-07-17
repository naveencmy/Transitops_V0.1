import type { Driver } from '../types';
import { authFetch, mapDriver } from './api';

export const driverService = {
  async getDrivers(): Promise<Driver[]> {
    const response = await authFetch('/api/v1/drivers');
    if (!response.ok) throw new Error('Failed to fetch drivers');
    const json = await response.json();
    const data = json.data ?? json;
    return Array.isArray(data) ? data.map(mapDriver) : [];
  },
  async getDriverById(id: string): Promise<Driver> {
    const response = await authFetch(`/api/v1/drivers/${id}`);
    if (!response.ok) throw new Error('Failed to fetch driver');
    const json = await response.json();
    return mapDriver(json.data ?? json);
  },
  async createDriver(driverData: Partial<Driver>): Promise<Driver> {
    const response = await authFetch('/api/v1/drivers', {
      method: 'POST',
      body: JSON.stringify(driverData),
    });
    if (!response.ok) throw new Error('Failed to create driver');
    const json = await response.json();
    return mapDriver(json.data ?? json);
  },
  async updateDriver(id: string, driverData: Partial<Driver>): Promise<Driver> {
    const response = await authFetch(`/api/v1/drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(driverData),
    });
    if (!response.ok) throw new Error('Failed to update driver');
    const json = await response.json();
    return mapDriver(json.data ?? json);
  },
  async deleteDriver(id: string): Promise<void> {
    const response = await authFetch(`/api/v1/drivers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete driver');
  },
};
