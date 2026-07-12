import { api, tokenStorage } from "./api";

const USER_KEY = "transitops_user";

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

class AuthService {
  async login(email: string, password: string): Promise<User> {
    if (!email.trim()) {
      throw new Error("Email is required");
    }

    if (!password.trim()) {
      throw new Error("Password is required");
    }

    const result = await api.post<LoginResponse>(
      "/auth/login",
      {
        email,
        password,
      }
    );

    tokenStorage.save(result.accessToken);

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(result.user)
    );

    return result.user;
  }

  async getProfile(): Promise<User> {
    const user = await api.get<User>(
      "/auth/profile"
    );

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );

    return user;
  }

  logout(): void {
    tokenStorage.clear();
    localStorage.removeItem(USER_KEY);
  }

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);

    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return tokenStorage.get() !== null;
  }

  getRole(): string | null {
    return this.getCurrentUser()?.role ?? null;
  }

  hasRole(...roles: string[]): boolean {
    const role = this.getRole();

    if (!role) return false;

    return roles.includes(role);
  }
}

export const authService = new AuthService();