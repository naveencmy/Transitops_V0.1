import { api } from "./api";

export interface MaintenanceRecord {
  id: number;
  vehicle_id: number;
  maintenance_type: string;
  description: string;
  cost: number;
  mechanic: string;
  status: string;
  scheduled_date: string;
  started_at?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MaintenanceFilters {
  status?: string;
  vehicle_id?: number;
}

export interface CreateMaintenanceDto {
  vehicle_id: number;
  maintenance_type: string;
  description: string;
  cost: number;
  mechanic: string;
  scheduled_date: string;
}

export interface UpdateMaintenanceDto
  extends Partial<CreateMaintenanceDto> {}

class MaintenanceService {

  async getRecords(
    filters?: MaintenanceFilters
  ): Promise<MaintenanceRecord[]> {

    const params = new URLSearchParams();

    if (filters?.status)
      params.append("status", filters.status);

    if (filters?.vehicle_id)
      params.append("vehicle_id", String(filters.vehicle_id));

    const query = params.toString();

    return api.get<MaintenanceRecord[]>(
      `/maintenance${query ? `?${query}` : ""}`
    );
  }

  async getRecordById(
    id: number | string
  ): Promise<MaintenanceRecord> {

    return api.get<MaintenanceRecord>(
      `/maintenance/${id}`
    );
  }

  async createRecord(
    data: CreateMaintenanceDto
  ): Promise<MaintenanceRecord> {

    return api.post<MaintenanceRecord>(
      "/maintenance",
      data
    );
  }

  async updateRecord(
    id: number | string,
    data: UpdateMaintenanceDto
  ): Promise<MaintenanceRecord> {

    return api.put<MaintenanceRecord>(
      `/maintenance/${id}`,
      data
    );
  }

  async closeRecord(
    id: number | string
  ): Promise<MaintenanceRecord> {

    return api.post<MaintenanceRecord>(
      `/maintenance/${id}/close`
    );
  }

  async deleteRecord(
    id: number | string
  ): Promise<void> {

    return api.delete<void>(
      `/maintenance/${id}`
    );
  }

  async getScheduledRecords() {
    return this.getRecords({
      status: "Scheduled"
    });
  }

  async getCompletedRecords() {
    return this.getRecords({
      status: "Completed"
    });
  }

  async getInProgressRecords() {
    return this.getRecords({
      status: "InProgress"
    });
  }

}

export const maintenanceService =
  new MaintenanceService();