import type { Trip } from '../types';
import { authFetch, mapTrip } from './api';

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    const response = await authFetch('/api/v1/trips');
    if (!response.ok) throw new Error('Failed to fetch trips');
    const json = await response.json();
    const data = json.data ?? json;
    return Array.isArray(data) ? data.map(mapTrip) : [];
  },
  async getTripById(id: string): Promise<Trip> {
    const response = await authFetch(`/api/v1/trips/${id}`);
    if (!response.ok) throw new Error('Failed to fetch trip');
    const json = await response.json();
    return mapTrip(json.data ?? json);
  },
  async getTripsByDriver(driverId: string): Promise<Trip[]> {
    const response = await authFetch(`/api/v1/trips?driverId=${encodeURIComponent(driverId)}`);
    if (!response.ok) throw new Error('Failed to fetch trips');
    const json = await response.json();
    const data = json.data ?? json;
    return Array.isArray(data) ? data.map(mapTrip) : [];
  },
  async getTripsByVehicle(vehicleId: string): Promise<Trip[]> {
    const response = await authFetch(`/api/v1/trips?vehicleId=${encodeURIComponent(vehicleId)}`);
    if (!response.ok) throw new Error('Failed to fetch trips');
    const json = await response.json();
    const data = json.data ?? json;
    return Array.isArray(data) ? data.map(mapTrip) : [];
  },
  async createTrip(tripData: Partial<Trip>): Promise<Trip> {
    const response = await authFetch('/api/v1/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
    if (!response.ok) throw new Error('Failed to create trip');
    const json = await response.json();
    return mapTrip(json.data ?? json);
  },
  async updateTrip(id: string, tripData: Partial<Trip>): Promise<Trip> {
    const response = await authFetch(`/api/v1/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tripData),
    });
    if (!response.ok) throw new Error('Failed to update trip');
    const json = await response.json();
    return mapTrip(json.data ?? json);
  },
  async dispatchTrip(id: string): Promise<Trip> {
    const response = await authFetch(`/api/v1/trips/${id}/dispatch`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to dispatch trip');
    const json = await response.json();
    return mapTrip(json.data ?? json);
  },
  async completeTrip(id: string, data: { actual_distance_km: number; fuel_consumed_liters: number; final_odometer_km: number }): Promise<Trip> {
    const response = await authFetch(`/api/v1/trips/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to complete trip');
    const json = await response.json();
    return mapTrip(json.data ?? json);
  },
  async cancelTrip(id: string): Promise<Trip> {
    const response = await authFetch(`/api/v1/trips/${id}/cancel`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to cancel trip');
    const json = await response.json();
    return mapTrip(json.data ?? json);
  },
  async deleteTrip(id: string): Promise<void> {
    const response = await authFetch(`/api/v1/trips/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete trip');
  },
};
