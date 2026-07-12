// src/services/api.ts

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

const TOKEN_KEY = "transitops_token";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private buildHeaders(isJson = true): HeadersInit {
    const headers: HeadersInit = {};

    if (isJson) {
      headers["Content-Type"] = "application/json";
    }

    const token = this.getToken();

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();

    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
          ...options,
          headers: {
            ...this.buildHeaders(),
            ...(options.headers || {})
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeout);

      if (response.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem("transitops_user");

        window.location.href = "/login";

        throw new ApiError(401, "Session expired");
      }

      const json = await response.json();

      if (!response.ok) {
        throw new ApiError(
          response.status,
          json.message || "Request failed"
        );
      }

      return json.data;
    } catch (error) {
      clearTimeout(timeout);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof DOMException) {
        throw new ApiError(
          408,
          "Request timeout"
        );
      }

      throw new ApiError(
        500,
        "Unable to connect to server"
      );
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, {
      method: "GET"
    });
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body)
    });
  }

  put<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body)
    });
  }

  patch<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body)
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, {
      method: "DELETE"
    });
  }
}

export const api = new ApiClient();

export const tokenStorage = {
  save(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  get() {
    return localStorage.getItem(TOKEN_KEY);
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}