// const API_BASE_URL = '/api';export const API_DELAY = 0;

const STORAGE_KEY = 'fleetpilot_session';

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const raw = localStorage.getItem(STORAGE_KEY);
  let token: string | undefined;
  if (raw) {
    try {
      const session = JSON.parse(raw);
      token = session.token;
    } catch { /* ignore */ }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  return response;
}

export async function mockRequest<T>(data: T, shouldFail = false): Promise<T> {return new Promise((resolve, reject) => {if (shouldFail) {reject(new Error('Request failed (mock)'));return;}resolve(data);});}

export function formatDate(iso: string): string {return new Date(iso).toLocaleDateString('en-US', {year: 'numeric',month: 'short',day: 'numeric',});}

export function formatCurrency(value: number): string {return new Intl.NumberFormat('en-US', {style: 'currency',currency: 'INR',maximumFractionDigits: 0,}).format(value);}

export function formatNumber(value: number): string {return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);}

// Mapping functions: backend snake_case DB columns → frontend camelCase types

const VEHICLE_STATUS_MAP: Record<string, string> = {
  Available: 'Active',
  OnTrip: 'Active',
  InShop: 'Maintenance',
  Retired: 'Retired',
};

const DRIVER_STATUS_MAP: Record<string, string> = {
  Available: 'Off Duty',
  OnTrip: 'On Duty',
  Suspended: 'Suspended',
};

const TRIP_STATUS_MAP: Record<string, string> = {
  Draft: 'Scheduled',
  Dispatched: 'Dispatched',
  InProgress: 'In Progress',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
};

const MAINTENANCE_STATUS_MAP: Record<string, string> = {
  InProgress: 'In Progress',
  Scheduled: 'Scheduled',
  Completed: 'Completed',
  Overdue: 'Overdue',
};

export function toBackendMaintenanceStatus(status: string): string {
  const REVERSE: Record<string, string> = {
    'In Progress': 'InProgress',
    'Scheduled': 'Scheduled',
    'Completed': 'Completed',
    'Overdue': 'Overdue',
  };
  return REVERSE[status] || status;
}

export function mapVehicle(v: any) {
  return {
    id: String(v.id),
    plate: v.registration_number || '',
    model: v.name || v.model || '',
    type: v.type || 'Truck',
    status: VEHICLE_STATUS_MAP[v.status] || v.status || 'Active',
    capacityKg: Number(v.max_load_capacity_kg) || 0,
    fuelLevel: Number(v.fuel_level) || 0,
    odometerKm: Number(v.odometer_km) || 0,
    nextMaintenanceKm: Number(v.next_maintenance_km) || 0,
    driverId: v.assigned_vehicle_id ? String(v.assigned_vehicle_id) : null,
  };
}

export function mapDriver(d: any) {
  return {
    id: String(d.id),
    name: d.full_name || '',
    phone: d.contact_number || '',
    email: d.email || '',
    licenseNumber: d.license_number || '',
    licenseExpiry: d.license_expiry || '',
    status: DRIVER_STATUS_MAP[d.status] || d.status || 'Off Duty',
    rating: Number(d.safety_score) || 0,
    totalTrips: Number(d.total_trips) || 0,
    assignedVehicleId: d.assigned_vehicle_id ? String(d.assigned_vehicle_id) : null,
  };
}

export function mapTrip(t: any) {
  return {
    id: String(t.id),
    tripCode: t.trip_code || `TRP-${t.id}`,
    origin: t.source || t.origin || '',
    destination: t.destination || '',
    distanceKm: Number(t.planned_distance_km || t.actual_distance_km) || 0,
    departureTime: t.departure_time || t.dispatched_at || '',
    arrivalTime: t.arrival_time || t.completed_at || '',
    driverId: String(t.driver_id),
    vehicleId: String(t.vehicle_id),
    cargo: t.cargo_description || t.cargo || '',
    weightTons: Number(t.cargo_weight_kg) ? Number(t.cargo_weight_kg) / 1000 : 0,
    revenue: Number(t.revenue) || 0,
    status: TRIP_STATUS_MAP[t.status] || t.status || 'Scheduled',
    progress: Number(t.progress) || 0,
  };
}

export function mapMaintenance(m: any) {
  return {
    id: String(m.id),
    vehicleId: String(m.vehicle_id),
    type: m.maintenance_type || m.type || '',
    description: m.description || '',
    status: MAINTENANCE_STATUS_MAP[m.status] || m.status || 'Scheduled',
    scheduledDate: m.scheduled_date || '',
    completedDate: m.completed_at || m.completed_date || null,
    cost: Number(m.cost) || 0,
    mechanic: m.mechanic || '',
    notes: m.notes || m.description || '',
  };
}

export function mapExpense(e: any) {
  return {
    id: String(e.id),
    date: e.created_at || e.date || '',
    category: e.category || 'Other',
    description: e.description || '',
    amount: Number(e.amount) || 0,
    vehicleId: e.vehicle_id ? String(e.vehicle_id) : null,
  };
}

export function mapFuelRecord(f: any) {
  return {
    id: String(f.id),
    date: f.created_at || f.date || '',
    vehicleId: String(f.vehicle_id),
    liters: Number(f.liters) || 0,
    costPerLiter: Number(f.cost_per_liter) || 0,
    totalCost: Number(f.total_cost) || 0,
    odometerKm: Number(f.odometer_reading) || 0,
    station: f.station || '',
  };
}

