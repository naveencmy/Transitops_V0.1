import { api } from "./api";

export interface Expense {
  id: number;
  trip_id?: number;
  vehicle_id?: number;
  category: string;
  amount: number;
  description: string;
  created_at: string;
}

export interface FuelLog {
  id: number;
  vehicle_id: number;
  trip_id?: number;
  liters: number;
  cost_per_liter: number;
  total_cost: number;
  odometer_reading: number;
  station: string;
  created_at: string;
}

export interface ExpenseFilters {
  category?: string;
  vehicle_id?: number;
}

export interface FuelFilters {
  vehicle_id?: number;
}

export interface CreateExpenseDto {
  trip_id?: number;
  vehicle_id?: number;
  category: string;
  amount: number;
  description: string;
}

export interface CreateFuelDto {
  vehicle_id: number;
  trip_id?: number;
  liters: number;
  cost_per_liter: number;
  total_cost: number;
  odometer_reading: number;
  station: string;
}

class ExpenseService {

  // ---------------- Expenses ----------------

  async getExpenses(
    filters?: ExpenseFilters
  ): Promise<Expense[]> {

    const params = new URLSearchParams();

    if (filters?.category)
      params.append("category", filters.category);

    if (filters?.vehicle_id)
      params.append(
        "vehicle_id",
        String(filters.vehicle_id)
      );

    const query = params.toString();

    return api.get<Expense[]>(
      `/expenses${query ? `?${query}` : ""}`
    );
  }

  async createExpense(
    expense: CreateExpenseDto
  ): Promise<Expense> {

    return api.post<Expense>(
      "/expenses",
      expense
    );
  }

  // ---------------- Fuel ----------------

  async getFuelLogs(
    filters?: FuelFilters
  ): Promise<FuelLog[]> {

    const params = new URLSearchParams();

    if (filters?.vehicle_id)
      params.append(
        "vehicle_id",
        String(filters.vehicle_id)
      );

    const query = params.toString();

    return api.get<FuelLog[]>(
      `/fuel${query ? `?${query}` : ""}`
    );
  }

  async createFuelLog(
    fuel: CreateFuelDto
  ): Promise<FuelLog> {

    return api.post<FuelLog>(
      "/fuel",
      fuel
    );
  }

  async getVehicleExpenses(
    vehicleId: number
  ) {

    return this.getExpenses({
      vehicle_id: vehicleId
    });
  }

  async getVehicleFuelLogs(
    vehicleId: number
  ) {

    return this.getFuelLogs({
      vehicle_id: vehicleId
    });
  }

}

export const expenseService =
  new ExpenseService();