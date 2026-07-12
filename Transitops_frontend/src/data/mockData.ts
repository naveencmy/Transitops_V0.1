import type {
  Vehicle, Driver, Trip, MaintenanceRecord, ExpenseRecord, FuelRecord, ComplianceItem, AppUser, SeriesPoint,
} from '../types';

export const mockUsers: AppUser[] = [
  { id: 'U-001', email: 'admin@fleetco.com', name: 'Alex Morgan', role: 'Admin' },
  { id: 'U-002', email: 'fleet@fleetco.com', name: 'Sofia Chen', role: 'Fleet Manager' },
  { id: 'U-003', email: 'dispatch@fleetco.com', name: 'James Okafor', role: 'Dispatcher' },
  { id: 'U-004', email: 'safety@fleetco.com', name: 'Priya Nair', role: 'Safety Officer' },
  { id: 'U-005', email: 'finance@fleetco.com', name: 'Liam Murphy', role: 'Financial Analyst' },
];

export const mockVehicles: Vehicle[] = [
  { id: 'V-001', plate: 'TX-7782', model: 'Freightliner Cascadia', type: 'Truck', status: 'Active', capacityKg: 12000, fuelLevel: 78, odometerKm: 145230, nextMaintenanceKm: 150000, driverId: 'D-001' },
  { id: 'V-002', plate: 'TX-7783', model: 'Kenworth T680', type: 'Truck', status: 'Active', capacityKg: 18000, fuelLevel: 45, odometerKm: 98450, nextMaintenanceKm: 100000, driverId: 'D-002' },
  { id: 'V-003', plate: 'TX-7784', model: 'Volvo VNL 760', type: 'Truck', status: 'Maintenance', capacityKg: 15000, fuelLevel: 90, odometerKm: 210800, nextMaintenanceKm: 210000, driverId: null },
  { id: 'V-004', plate: 'TX-7785', model: 'Ford Transit 350', type: 'Van', status: 'Active', capacityKg: 3500, fuelLevel: 62, odometerKm: 54300, nextMaintenanceKm: 60000, driverId: 'D-003' },
  { id: 'V-005', plate: 'TX-7786', model: 'Peterbilt 579', type: 'Truck', status: 'Idle', capacityKg: 16000, fuelLevel: 30, odometerKm: 178900, nextMaintenanceKm: 180000, driverId: null },
  { id: 'V-006', plate: 'TX-7787', model: 'International LT', type: 'Truck', status: 'Active', capacityKg: 14000, fuelLevel: 85, odometerKm: 67200, nextMaintenanceKm: 70000, driverId: 'D-004' },
  { id: 'V-007', plate: 'TX-7788', model: 'Mercedes Sprinter', type: 'Van', status: 'Active', capacityKg: 3000, fuelLevel: 55, odometerKm: 32100, nextMaintenanceKm: 40000, driverId: 'D-005' },
  { id: 'V-008', plate: 'TX-7789', model: 'Mack Anthem', type: 'Truck', status: 'Active', capacityKg: 20000, fuelLevel: 70, odometerKm: 112400, nextMaintenanceKm: 120000, driverId: 'D-006' },
];

export const mockDrivers: Driver[] = [
  { id: 'D-001', name: 'Marcus Johnson', phone: '+1 713-555-0101', email: 'marcus.j@fleetco.com', licenseNumber: 'CDL-A-99201', licenseExpiry: '2027-08-15', status: 'On Duty', rating: 4.8, totalTrips: 342, assignedVehicleId: 'V-001' },
  { id: 'D-002', name: 'Sarah Williams', phone: '+1 713-555-0102', email: 'sarah.w@fleetco.com', licenseNumber: 'CDL-A-99202', licenseExpiry: '2026-11-02', status: 'On Duty', rating: 4.9, totalTrips: 410, assignedVehicleId: 'V-002' },
  { id: 'D-003', name: 'David Brown', phone: '+1 713-555-0103', email: 'david.b@fleetco.com', licenseNumber: 'CDL-B-99203', licenseExpiry: '2027-06-10', status: 'Off Duty', rating: 4.6, totalTrips: 198, assignedVehicleId: 'V-004' },
  { id: 'D-004', name: 'Emily Garcia', phone: '+1 713-555-0104', email: 'emily.g@fleetco.com', licenseNumber: 'CDL-A-99204', licenseExpiry: '2026-09-30', status: 'On Duty', rating: 4.7, totalTrips: 275, assignedVehicleId: 'V-006' },
  { id: 'D-005', name: 'Robert Lee', phone: '+1 713-555-0105', email: 'robert.l@fleetco.com', licenseNumber: 'CDL-B-99205', licenseExpiry: '2028-01-20', status: 'On Leave', rating: 4.5, totalTrips: 156, assignedVehicleId: 'V-007' },
  { id: 'D-006', name: 'Jessica Martinez', phone: '+1 713-555-0106', email: 'jessica.m@fleetco.com', licenseNumber: 'CDL-A-99206', licenseExpiry: '2027-03-14', status: 'On Duty', rating: 4.9, totalTrips: 389, assignedVehicleId: 'V-008' },
  { id: 'D-007', name: 'Michael Davis', phone: '+1 713-555-0107', email: 'michael.d@fleetco.com', licenseNumber: 'CDL-A-99207', licenseExpiry: '2026-05-01', status: 'Off Duty', rating: 4.3, totalTrips: 112, assignedVehicleId: null },
];

export const mockTrips: Trip[] = [
  { id: 'T-1001', origin: 'Houston, TX', destination: 'New Orleans, LA', distanceKm: 568, departureTime: '2026-07-12 06:00', arrivalTime: '2026-07-12 14:00', driverId: 'D-001', vehicleId: 'V-001', cargo: 'Industrial Machinery', weightTons: 10, revenue: 4200, status: 'In Progress', progress: 45 },
  { id: 'T-1002', origin: 'Dallas, TX', destination: 'Oklahoma City, OK', distanceKm: 322, departureTime: '2026-07-12 08:00', arrivalTime: '2026-07-12 13:00', driverId: 'D-002', vehicleId: 'V-002', cargo: 'Electronics', weightTons: 8, revenue: 2800, status: 'Scheduled', progress: 0 },
  { id: 'T-1003', origin: 'Austin, TX', destination: 'San Antonio, TX', distanceKm: 128, departureTime: '2026-07-11 09:00', arrivalTime: '2026-07-11 11:30', driverId: 'D-004', vehicleId: 'V-006', cargo: 'Furniture', weightTons: 5, revenue: 1500, status: 'Completed', progress: 100 },
  { id: 'T-1004', origin: 'Houston, TX', destination: 'Dallas, TX', distanceKm: 385, departureTime: '2026-07-13 07:00', arrivalTime: '2026-07-13 12:30', driverId: 'D-006', vehicleId: 'V-008', cargo: 'Construction Materials', weightTons: 18, revenue: 5100, status: 'Scheduled', progress: 0 },
  { id: 'T-1005', origin: 'Fort Worth, TX', destination: 'Little Rock, AR', distanceKm: 560, departureTime: '2026-07-10 05:00', arrivalTime: '2026-07-10 15:00', driverId: 'D-001', vehicleId: 'V-001', cargo: 'Agricultural Products', weightTons: 12, revenue: 3800, status: 'Delayed', progress: 60 },
  { id: 'T-1006', origin: 'San Antonio, TX', destination: 'El Paso, TX', distanceKm: 880, departureTime: '2026-07-12 04:00', arrivalTime: '2026-07-12 20:00', driverId: 'D-002', vehicleId: 'V-002', cargo: 'Auto Parts', weightTons: 14, revenue: 6200, status: 'Dispatched', progress: 0 },
  { id: 'T-1007', origin: 'Houston, TX', destination: 'Galveston, TX', distanceKm: 82, departureTime: '2026-07-09 10:00', arrivalTime: '2026-07-09 12:00', driverId: 'D-003', vehicleId: 'V-004', cargo: 'Medical Supplies', weightTons: 2, revenue: 900, status: 'Completed', progress: 100 },
  { id: 'T-1008', origin: 'Dallas, TX', destination: 'Shreveport, LA', distanceKm: 290, departureTime: '2026-07-14 06:00', arrivalTime: '2026-07-14 11:00', driverId: 'D-006', vehicleId: 'V-008', cargo: 'Retail Goods', weightTons: 7, revenue: 2200, status: 'Scheduled', progress: 0 },
];

export const mockMaintenance: MaintenanceRecord[] = [
  { id: 'M-201', vehicleId: 'V-003', type: 'Engine Repair', description: 'Turbocharger replacement', status: 'In Progress', scheduledDate: '2026-07-08', completedDate: null, cost: 3200, mechanic: 'Erik Lund', notes: 'Turbo unit ordered, awaiting delivery' },
  { id: 'M-202', vehicleId: 'V-001', type: 'Oil Change', description: 'Routine oil and filter change', status: 'Scheduled', scheduledDate: '2026-07-20', completedDate: null, cost: 280, mechanic: 'Auto Shop Pro', notes: 'Next service at 150k km' },
  { id: 'M-203', vehicleId: 'V-005', type: 'Brake Service', description: 'Front brake pad replacement', status: 'Overdue', scheduledDate: '2026-07-01', completedDate: null, cost: 850, mechanic: 'Erik Lund', notes: 'Overdue - schedule immediately' },
  { id: 'M-204', vehicleId: 'V-002', type: 'Tire Rotation', description: 'Tire rotation and alignment', status: 'Completed', scheduledDate: '2026-06-28', completedDate: '2026-06-28', cost: 420, mechanic: 'Auto Shop Pro', notes: 'All tires in good condition' },
  { id: 'M-205', vehicleId: 'V-004', type: 'Inspection', description: 'Annual DOT inspection', status: 'Scheduled', scheduledDate: '2026-07-25', completedDate: null, cost: 150, mechanic: 'Inspector Cruz', notes: 'Annual safety inspection due' },
  { id: 'M-206', vehicleId: 'V-008', type: 'General', description: 'Coolant system flush', status: 'Completed', scheduledDate: '2026-06-15', completedDate: '2026-06-15', cost: 220, mechanic: 'Erik Lund', notes: 'No issues found' },
];

export const mockExpenses: ExpenseRecord[] = [
  { id: 'E-301', date: '2026-07-10', category: 'Fuel', description: 'Diesel refill - V-001', amount: 680, vehicleId: 'V-001' },
  { id: 'E-302', date: '2026-07-09', category: 'Maintenance', description: 'Oil change - V-002', amount: 280, vehicleId: 'V-002' },
  { id: 'E-303', date: '2026-07-08', category: 'Fuel', description: 'Diesel refill - V-002', amount: 720, vehicleId: 'V-002' },
  { id: 'E-304', date: '2026-07-07', category: 'Tolls', description: 'Highway tolls - T-1001', amount: 85, vehicleId: 'V-001' },
  { id: 'E-305', date: '2026-07-06', category: 'Maintenance', description: 'Brake service - V-005', amount: 850, vehicleId: 'V-005' },
  { id: 'E-306', date: '2026-07-05', category: 'Insurance', description: 'Monthly fleet insurance', amount: 2400, vehicleId: null },
  { id: 'E-307', date: '2026-07-04', category: 'Fuel', description: 'Diesel refill - V-006', amount: 540, vehicleId: 'V-006' },
  { id: 'E-308', date: '2026-07-03', category: 'Other', description: 'Driver training program', amount: 1200, vehicleId: null },
];

export const mockFuelRecords: FuelRecord[] = [
  { id: 'F-401', date: '2026-07-10', vehicleId: 'V-001', liters: 180, costPerLiter: 1.65, totalCost: 297, odometerKm: 145230, station: 'Shell Station 12' },
  { id: 'F-402', date: '2026-07-09', vehicleId: 'V-002', liters: 220, costPerLiter: 1.68, totalCost: 369.6, odometerKm: 98450, station: 'Chevron Hub 7' },
  { id: 'F-403', date: '2026-07-08', vehicleId: 'V-006', liters: 150, costPerLiter: 1.62, totalCost: 243, odometerKm: 67200, station: 'ExpressFuel 3' },
  { id: 'F-404', date: '2026-07-07', vehicleId: 'V-008', liters: 200, costPerLiter: 1.67, totalCost: 334, odometerKm: 112400, station: 'Shell Station 12' },
  { id: 'F-405', date: '2026-07-05', vehicleId: 'V-004', liters: 65, costPerLiter: 1.70, totalCost: 110.5, odometerKm: 54300, station: 'Chevron Hub 7' },
];

export const mockCompliance: ComplianceItem[] = [
  { id: 'C-501', driverId: 'D-001', category: 'License', title: 'CDL Renewal', status: 'Compliant', dueDate: '2027-08-15', notes: 'Valid through Aug 2027' },
  { id: 'C-502', driverId: 'D-002', category: 'License', title: 'CDL Renewal', status: 'Expiring Soon', dueDate: '2026-11-02', notes: 'Expires in 4 months' },
  { id: 'C-503', driverId: 'D-003', category: 'Medical', title: 'Medical Certificate', status: 'Compliant', dueDate: '2027-06-10', notes: 'DOT physical current' },
  { id: 'C-504', driverId: 'D-004', category: 'Training', title: 'Safety Training', status: 'Pending Review', dueDate: '2026-07-30', notes: 'Module completion under review' },
  { id: 'C-505', driverId: 'D-004', category: 'License', title: 'License Renewal', status: 'Expiring Soon', dueDate: '2026-09-30', notes: 'Class C renewal due' },
  { id: 'C-506', driverId: 'D-006', category: 'Drug Test', title: 'Annual Drug Screening', status: 'Expired', dueDate: '2026-05-01', notes: 'Overdue - immediate action required' },
  { id: 'C-507', driverId: 'D-007', category: 'Hours of Service', title: 'HOS Log Audit', status: 'Pending Review', dueDate: '2026-07-20', notes: 'Quarterly audit in progress' },
  { id: 'C-508', driverId: 'D-001', category: 'Medical', title: 'Medical Certificate', status: 'Expiring Soon', dueDate: '2026-08-01', notes: 'Expires next month' },
];

export const monthlyRevenue: SeriesPoint[] = [
  { name: 'Jan', revenue: 142000, expenses: 98000, profit: 44000 },
  { name: 'Feb', revenue: 155000, expenses: 102000, profit: 53000 },
  { name: 'Mar', revenue: 168000, expenses: 110000, profit: 58000 },
  { name: 'Apr', revenue: 162000, expenses: 105000, profit: 57000 },
  { name: 'May', revenue: 178000, expenses: 112000, profit: 66000 },
  { name: 'Jun', revenue: 185000, expenses: 118000, profit: 67000 },
  { name: 'Jul', revenue: 172000, expenses: 115000, profit: 57000 },
];

export const fleetUtilization: SeriesPoint[] = [
  { name: 'Mon', active: 6, idle: 2, maintenance: 1 },
  { name: 'Tue', active: 7, idle: 1, maintenance: 1 },
  { name: 'Wed', active: 5, idle: 3, maintenance: 1 },
  { name: 'Thu', active: 6, idle: 2, maintenance: 1 },
  { name: 'Fri', active: 7, idle: 1, maintenance: 1 },
  { name: 'Sat', active: 4, idle: 4, maintenance: 1 },
  { name: 'Sun', active: 2, idle: 6, maintenance: 1 },
];

export const fuelTrend: SeriesPoint[] = [
  { name: 'Week 1', fuel: 4200, maintenance: 1800 },
  { name: 'Week 2', fuel: 3800, maintenance: 2200 },
  { name: 'Week 3', fuel: 5100, maintenance: 850 },
  { name: 'Week 4', fuel: 4600, maintenance: 1500 },
];
