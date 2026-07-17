import { vehicles } from '../data/mockData';
import type { Vehicle } from '../types';
import { mockRequest } from './api';

export const fleetService = {async getVehicles(): Promise<Vehicle[]> 
  {return mockRequest(vehicles);},async getVehicleById(id: string): Promise<Vehicle | undefined>
   {return mockRequest(vehicles.find((v) => v.id === id));},
   async getVehicleByDriver(driverId: string): Promise<Vehicle | undefined> 
   {return mockRequest(vehicles.find((v) => v.driverId === driverId));},};



export function formatDate(date: string | null | undefined): string {if (!date) return 'â€”';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });}

export function formatNumber(value: number): string {return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);}

export function formatNumber2(value: number): string {return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);}



export { fleetService } from './fleetService';export { driverService } from './driverService';export { tripService } from './tripService';export { maintenanceService } from './maintenanceService';export { expenseService } from './expenseService';export { analyticsService } from './analyticsService';export { authService } from './authService';export type { AppUser } from './authService';export { API_BASE_URL, formatDate, formatCurrency, formatNumber } from './api';export { supabase } from './supabaseClient';export { userService, type ManagedUser } from './userService';

