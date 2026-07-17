export type Role = 'Admin' | 'Fleet Manager' | 'Dispatcher' | 'Safety Officer' | 'Financial Analyst';

export type ModuleKey =
  | 'dashboard'
  | 'fleet'
  | 'drivers'
  | 'trips'
  | 'maintenance'
  | 'expenses'
  | 'analytics'
  | 'compliance'
  | 'settings';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export type VehicleStatus = 'Active' | 'Maintenance' | 'Idle' | 'Retired';
export type VehicleType = 'Truck' | 'Van' | 'Trailer' | 'Bus' | 'Refrigerated';

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  type: VehicleType;
  status: VehicleStatus;
  capacityKg: number;
  fuelLevel: number;
  odometerKm: number;
  nextMaintenanceKm: number;
  driverId: string | null;
}

export type DriverStatus = 'On Duty' | 'Off Duty' | 'On Leave' | 'Suspended';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: DriverStatus;
  rating: number;
  totalTrips: number;
  assignedVehicleId: string | null;
}

export type TripStatus = 'Scheduled' | 'Dispatched' | 'In Progress' | 'Completed' | 'Cancelled' | 'Delayed';

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  distanceKm: number;
  departureTime: string;
  arrivalTime: string;
  driverId: string;
  vehicleId: string;
  cargo: string;
  weightTons: number;
  revenue: number;
  status: TripStatus;
  progress: number;
}

export type MaintenanceStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: string;
  description: string;
  status: MaintenanceStatus;
  scheduledDate: string;
  completedDate: string | null;
  cost: number;
  mechanic: string;
  notes: string;
}

export type ExpenseCategory = 'Fuel' | 'Maintenance' | 'Tolls' | 'Insurance' | 'Salaries' | 'Other';

export interface ExpenseRecord {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  vehicleId: string | null;
}

export interface FuelRecord {
  id: string;
  date: string;
  vehicleId: string;
  liters: number;
  costPerLiter: number;
  totalCost: number;
  odometerKm: number;
  station: string;
}

export type ComplianceCategory = 'License' | 'Medical' | 'Training' | 'Hours of Service' | 'Drug Test';
export type ComplianceStatus = 'Compliant' | 'Expiring Soon' | 'Expired' | 'Pending Review';

export interface ComplianceItem {
  id: string;
  driverId: string;
  category: ComplianceCategory;
  title: string;
  status: ComplianceStatus;
  dueDate: string;
  notes: string;
}

export interface SeriesPoint {
  name: string;
  [key: string]: string | number;
}
