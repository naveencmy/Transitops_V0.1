import { api } from "./api";

export interface Driver {
  id: number;
  full_name: string;
  license_number: string;
  license_category: string;
  license_expiry: string;
  contact_number: string;
  email: string;
  safety_score: number;
  total_trips: number;
  assigned_vehicle_id: number | null;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface DriverFilters {
  status?: string;
  search?: string;
}

export interface CreateDriverDto {
  full_name: string;
  license_number: string;
  license_category: string;
  license_expiry: string;
  contact_number: string;
  email: string;
  safety_score?: number;
  assigned_vehicle_id?: number | null;
  status?: string;
}

export interface UpdateDriverDto extends Partial<CreateDriverDto> {}

class DriverService {

  async getDrivers(filters?: DriverFilters): Promise<Driver[]> {

    const params = new URLSearchParams();

    if (filters?.status)
      params.append("status", filters.status);

    if (filters?.search)
      params.append("search", filters.search);

    const query = params.toString();

    return api.get<Driver[]>(
      `/drivers${query ? `?${query}` : ""}`
    );
  }

  async getDriverById(id: number | string): Promise<Driver> {
    return api.get<Driver>(`/drivers/${id}`);
  }

  async createDriver(driver: CreateDriverDto): Promise<Driver> {
    return api.post<Driver>("/drivers", driver);
  }

  async updateDriver(
    id: number | string,
    driver: UpdateDriverDto
  ): Promise<Driver> {

    return api.put<Driver>(
      `/drivers/${id}`,
      driver
    );
  }

  async deleteDriver(id: number | string): Promise<void> {
    return api.delete<void>(`/drivers/${id}`);
  }

  async getAvailableDrivers() {
    return this.getDrivers({
      status: "Available"
    });
  }

  async searchDrivers(search: string) {
    return this.getDrivers({
      search
    });
  }
}

export const driverService = new DriverService();