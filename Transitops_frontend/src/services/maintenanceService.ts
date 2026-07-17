import type { MaintenanceRecord } from '../types';
import { authFetch, mapMaintenance } from './api';

export const maintenanceService = {
  async getRecords(): Promise<MaintenanceRecord[]> {
    const response = await authFetch('/api/v1/maintenance');
    if (!response.ok) throw new Error('Failed to fetch maintenance records');
    const json = await response.json();
    const data = json.data ?? json;
    return Array.isArray(data) ? data.map(mapMaintenance) : [];
  },
  async getRecordsByVehicle(vehicleId: string): Promise<MaintenanceRecord[]> {
    const response = await authFetch(`/api/v1/maintenance?vehicleId=${encodeURIComponent(vehicleId)}`);
    if (!response.ok) throw new Error('Failed to fetch maintenance records');
    const json = await response.json();
    const data = json.data ?? json;
    return Array.isArray(data) ? data.map(mapMaintenance) : [];
  },
  async createRecord(recordData: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    const response = await authFetch('/api/v1/maintenance', {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
    if (!response.ok) throw new Error('Failed to create maintenance record');
    const json = await response.json();
    return mapMaintenance(json.data ?? json);
  },
  async updateRecord(id: string, recordData: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    const response = await authFetch(`/api/v1/maintenance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recordData),
    });
    if (!response.ok) throw new Error('Failed to update maintenance record');
    const json = await response.json();
    return mapMaintenance(json.data ?? json);
  },
  async deleteRecord(id: string): Promise<void> {
    const response = await authFetch(`/api/v1/maintenance/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete maintenance record');
  },
};
