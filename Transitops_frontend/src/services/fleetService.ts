import { api } from "./api";

export interface Vehicle {
  id: number;
  registration_number: string;
  name: string;
  model: string;
  type: string;
  max_load_capacity_kg: number;
  odometer_km: number;
  acquisition_cost: number;
  fuel_level_pct: number;
  next_maintenance_km: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface VehicleFilters {
  status?: string;
  type?: string;
  search?: string;
}

export interface CreateVehicleDto {
  registration_number: string;
  name: string;
  model: string;
  type: string;
  max_load_capacity_kg: number;
  odometer_km: number;
  acquisition_cost: number;
  fuel_level_pct: number;
  next_maintenance_km: number;
  status?: string;
}

export interface UpdateVehicleDto
  extends Partial<CreateVehicleDto> {}

class FleetService {

  async getVehicles(
    filters?: VehicleFilters
  ): Promise<Vehicle[]> {

    const params = new URLSearchParams();

    if (filters?.status)
      params.append("status", filters.status);

    if (filters?.type)
      params.append("type", filters.type);

    if (filters?.search)
      params.append("search", filters.search);

    const query = params.toString();

    return api.get<Vehicle[]>(
      `/vehicles${query ? `?${query}` : ""}`
    );
  }

  async getVehicleById(
    id: number | string
  ): Promise<Vehicle> {

    return api.get<Vehicle>(
      `/vehicles/${id}`
    );
  }

  async createVehicle(
    vehicle: CreateVehicleDto
  ): Promise<Vehicle> {

    return api.post<Vehicle>(
      "/vehicles",
      vehicle
    );
  }

  async updateVehicle(
    id: number | string,
    vehicle: UpdateVehicleDto
  ): Promise<Vehicle> {

    return api.put<Vehicle>(
      `/vehicles/${id}`,
      vehicle
    );
  }

  async deleteVehicle(
    id: number | string
  ): Promise<void> {

    return api.delete<void>(
      `/vehicles/${id}`
    );
  }

  async searchVehicles(
    keyword: string
  ): Promise<Vehicle[]> {

    return this.getVehicles({
      search: keyword
    });
  }

  async getAvailableVehicles(): Promise<Vehicle[]> {

    return this.getVehicles({
      status: "Available"
    });
  }

  async getInShopVehicles(): Promise<Vehicle[]> {

    return this.getVehicles({
      status: "InShop"
    });
  }

  async getRetiredVehicles(): Promise<Vehicle[]> {

    return this.getVehicles({
      status: "Retired"
    });
  }

}

export const fleetService = new FleetService();