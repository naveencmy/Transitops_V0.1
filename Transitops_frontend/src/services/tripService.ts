import { api } from "./api";

export interface Trip {
  id: number;
  trip_code: string;
  source: string;
  destination: string;
  vehicle_id: number;
  driver_id: number;
  cargo_weight_kg: number;
  cargo_description?: string;
  planned_distance_km: number;
  actual_distance_km?: number;
  fuel_consumed_liters?: number;
  revenue?: number;
  departure_time?: string;
  arrival_time?: string;
  status: string;
  dispatched_at?: string;
  completed_at?: string;
}

export interface TripFilters {
  status?: string;
  vehicle_id?: number;
  driver_id?: number;
}

export interface CreateTripDto {
  source: string;
  destination: string;
  vehicle_id: number;
  driver_id: number;
  cargo_weight_kg: number;
  cargo_description?: string;
  planned_distance_km: number;
  revenue?: number;
  departure_time?: string;
}

export interface UpdateTripDto
  extends Partial<CreateTripDto> {}

class TripService {

  async getTrips(filters?: TripFilters): Promise<Trip[]> {

    const params = new URLSearchParams();

    if (filters?.status)
      params.append("status", filters.status);

    if (filters?.vehicle_id)
      params.append("vehicle_id", String(filters.vehicle_id));

    if (filters?.driver_id)
      params.append("driver_id", String(filters.driver_id));

    const query = params.toString();

    return api.get<Trip[]>(
      `/trips${query ? `?${query}` : ""}`
    );
  }

  async getTripById(
    id: number | string
  ): Promise<Trip> {

    return api.get<Trip>(
      `/trips/${id}`
    );
  }

  async createTrip(
    trip: CreateTripDto
  ): Promise<Trip> {

    return api.post<Trip>(
      "/trips",
      trip
    );
  }

  async updateTrip(
    id: number | string,
    trip: UpdateTripDto
  ): Promise<Trip> {

    return api.put<Trip>(
      `/trips/${id}`,
      trip
    );
  }

  async deleteTrip(
    id: number | string
  ): Promise<void> {

    return api.delete<void>(
      `/trips/${id}`
    );
  }

  async dispatchTrip(
    id: number | string
  ): Promise<Trip> {

    return api.post<Trip>(
      `/trips/${id}/dispatch`
    );
  }

  async completeTrip(
    id: number | string
  ): Promise<Trip> {

    return api.post<Trip>(
      `/trips/${id}/complete`
    );
  }

  async cancelTrip(
    id: number | string
  ): Promise<Trip> {

    return api.post<Trip>(
      `/trips/${id}/cancel`
    );
  }

  async getDraftTrips() {
    return this.getTrips({
      status: "Draft"
    });
  }

  async getDispatchedTrips() {
    return this.getTrips({
      status: "Dispatched"
    });
  }

  async getCompletedTrips() {
    return this.getTrips({
      status: "Completed"
    });
  }
}

export const tripService = new TripService();