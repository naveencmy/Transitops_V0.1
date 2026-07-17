import type { Vehicle } from '../types';
import { authFetch, mapVehicle } from './api';

export const vehicleService = {
  async getVehicles(): Promise<Vehicle[]> {
    const response = await authFetch('/api/v1/vehicles');
    if (!response.ok) throw new Error('Failed to fetch vehicles');
    const json = await response.json();
    const data = json.data ?? json;
    return Array.isArray(data) ? data.map(mapVehicle) : [];
  },
  async getVehicleById(id: string): Promise<Vehicle> {
    const response = await authFetch(`/api/v1/vehicles/${id}`);
    if (!response.ok) throw new Error('Failed to fetch vehicle');
    const json = await response.json();
    return mapVehicle(json.data ?? json);
  },
  async createVehicle(vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const response = await authFetch('/api/v1/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
    if (!response.ok) throw new Error('Failed to create vehicle');
    const json = await response.json();
    return mapVehicle(json.data ?? json);
  },
  async updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const response = await authFetch(`/api/v1/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
    if (!response.ok) throw new Error('Failed to update vehicle');
    const json = await response.json();
    return mapVehicle(json.data ?? json);
  },
  async deleteVehicle(id: string): Promise<void> {
    const response = await authFetch(`/api/v1/vehicles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete vehicle');
  },
};
