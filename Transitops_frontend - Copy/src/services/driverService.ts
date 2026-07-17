import { drivers } from '../data/mockData';
import type { Driver } from '../types';
import { mockRequest } from './api';

export const driverService = {async getDrivers(): Promise<Driver[]> {return mockRequest(drivers);},async getDriverById(id: string): Promise<Driver | undefined> {return mockRequest(drivers.find((d) => d.id === id));},async getDriverByVehicle(vehicleId: string): Promise<Driver | undefined> {return mockRequest(drivers.find((d) => d.assignedVehicleId === vehicleId));},};

