import type { SeriesPoint } from '../types';
import { authFetch } from './api';

export const dashboardService = {
  async getKPIs() {
    const response = await authFetch('/api/v1/dashboard/kpis');
    if (!response.ok) throw new Error('Failed to fetch KPIs');
    const json = await response.json();
    return json.data ?? json;
  },
};
