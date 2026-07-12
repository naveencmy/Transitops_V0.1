import { api } from "./api";

export interface DashboardKPIs {
  totalVehicles: number;
  activeVehicles: number;
  availableVehicles: number;
  retiredVehicles: number;

  totalDrivers: number;
  activeDrivers: number;

  totalTrips: number;
  completedTrips: number;
  activeTrips: number;

  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;

  fuelEfficiency: number;
  fleetUtilization: number;
}

export interface FuelEfficiencyReport {
  vehicle: string;
  efficiency: number;
}

export interface OperationalCostReport {
  category: string;
  amount: number;
}

export interface VehicleROIReport {
  vehicle: string;
  roi: number;
}

export interface TrendPoint {
  label: string;
  value: number;
}

class AnalyticsService {

  async getDashboardKPIs() {
    return api.get<DashboardKPIs>(
      "/dashboard/kpis"
    );
  }

  async getFuelEfficiency() {
    return api.get<FuelEfficiencyReport[]>(
      "/reports/fuel-efficiency"
    );
  }

  async getOperationalCost() {
    return api.get<OperationalCostReport[]>(
      "/reports/operational-cost"
    );
  }

  async getVehicleROI() {
    return api.get<VehicleROIReport[]>(
      "/reports/vehicle-roi"
    );
  }

  async getFleetUtilization() {
    return api.get<TrendPoint[]>(
      "/reports/fleet-utilization"
    );
  }

}

export const analyticsService =
  new AnalyticsService();