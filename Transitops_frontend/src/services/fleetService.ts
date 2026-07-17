import type { Vehicle } from '../types';

export const fleetService = {
  async getVehicles(): Promise<Vehicle[]> {
    const response = await fetch('/api/v1/vehicles');
    if (!response.ok) throw new Error('Failed to fetch vehicles');
    return response.json();
  },
  async getVehicleById(id: string): Promise<Vehicle | undefined> {
    const response = await fetch(`/api/v1/vehicles/${id}`);
    if (!response.ok) throw new Error('Failed to fetch vehicle');
    return response.json();
  },
  async getVehicleByDriver(driverId: string): Promise<Vehicle | undefined> {
    const vehicles = await this.getVehicles();
    return vehicles.find((v: any) => v.driverId === driverId);
  },
};

