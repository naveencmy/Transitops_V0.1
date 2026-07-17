import { authFetch } from './api';

export const reportService = {
  async getRevenueExpenseTrend() {
    const response = await authFetch('/api/v1/reports/revenue-expense');
    if (!response.ok) throw new Error('Failed to fetch revenue expense trend');
    const json = await response.json();
    return json.data ?? json;
  },
  async getFleetUtilization() {
    const response = await authFetch('/api/v1/reports/fleet-utilization');
    if (!response.ok) throw new Error('Failed to fetch fleet utilization');
    const json = await response.json();
    return json.data ?? json;
  },
  async getTripStatusDistribution() {
    const response = await authFetch('/api/v1/reports/trip-status');
    if (!response.ok) throw new Error('Failed to fetch trip status distribution');
    const json = await response.json();
    return json.data ?? json;
  },
  async getFuelEfficiency() {
    const response = await authFetch('/api/v1/reports/fuel-efficiency');
    if (!response.ok) throw new Error('Failed to fetch fuel efficiency');
    const json = await response.json();
    return json.data ?? json;
  },
  async getOperationalCost() {
    const response = await authFetch('/api/v1/reports/operational-cost');
    if (!response.ok) throw new Error('Failed to fetch operational cost');
    const json = await response.json();
    return json.data ?? json;
  },
  async getVehicleROI() {
    const response = await authFetch('/api/v1/reports/vehicle-roi');
    if (!response.ok) throw new Error('Failed to fetch vehicle ROI');
    const json = await response.json();
    return json.data ?? json;
  },
};
