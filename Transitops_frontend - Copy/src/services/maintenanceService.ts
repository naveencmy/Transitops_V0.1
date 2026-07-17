import { maintenanceRecords } from '../data/mockData';import type { MaintenanceRecord } from '../types';import { mockRequest } from './api';

export const maintenanceService = {async getRecords(): Promise<MaintenanceRecord[]> {return mockRequest(maintenanceRecords);},async getRecordsByVehicle(vehicleId: string): Promise<MaintenanceRecord[]> {return mockRequest(maintenanceRecords.filter((m) => m.vehicleId === vehicleId));},};

