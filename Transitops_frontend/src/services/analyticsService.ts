import type { SeriesPoint } from '../types';

export const analyticsService = {
  async getMonthlyRevenue(): Promise<SeriesPoint[]> {
    const response = await fetch('/api/v1/dashboard/revenue');
    if (!response.ok) throw new Error('Failed to fetch monthly revenue');
    return response.json();
  },
  async getWeeklyTrips(): Promise<SeriesPoint[]> {
    const response = await fetch('/api/v1/dashboard/trips');
    if (!response.ok) throw new Error('Failed to fetch weekly trips');
    return response.json();
  },
  async getFleetUtilization(): Promise<SeriesPoint[]> {
    const response = await fetch('/api/v1/dashboard/utilization');
    if (!response.ok) throw new Error('Failed to fetch fleet utilization');
    return response.json();
  },
};