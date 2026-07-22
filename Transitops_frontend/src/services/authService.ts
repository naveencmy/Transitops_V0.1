import type { AppUser, Role } from '../types';
import { authFetch } from './api';

const STORAGE_KEY = 'fleetpilot_session';

export const authService = {
  async login(email: string, password: string): Promise<AppUser> {
    if (!email || !password) throw new Error('Email and password are required');

    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.error?.message || body.message || 'Invalid email or password');
    }

    const body = await response.json();
    const raw = body.data;
    const user: AppUser = {
      id: String(raw.user.id),
      email: raw.user.email,
      name: raw.user.full_name,
      role: raw.user.role,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...user, token: raw.token }));
    return user;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser(): AppUser | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AppUser;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  },
};

export const userService = {
  async getUsers(): Promise<AppUser[]> {
    const response = await authFetch('/api/v1/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    const json = await response.json();
    const data = json.data ?? json;
    return (Array.isArray(data) ? data : []).map((u: any) => ({
      id: String(u.id),
      email: u.email,
      name: u.full_name,
      role: u.role,
    }));
  },

  async updateUserRole(id: string, role: Role): Promise<AppUser> {
    const response = await authFetch(`/api/v1/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error('Failed to update user role');
    const json = await response.json();
    const u = json.data ?? json;
    return { id: String(u.id), email: u.email, name: u.full_name, role: u.role };
  },

  async updateUserName(id: string, name: string): Promise<AppUser> {
    const response = await authFetch(`/api/v1/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('Failed to update user name');
    const json = await response.json();
    const u = json.data ?? json;
    return { id: String(u.id), email: u.email, name: u.full_name, role: u.role };
  },

  async deleteUser(id: string): Promise<void> {
    const response = await authFetch(`/api/v1/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
  },

  async addUser(name: string, email: string, role: Role): Promise<AppUser> {
    const response = await authFetch('/api/v1/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, role }),
    });
    if (!response.ok) throw new Error('Failed to add user');
    const json = await response.json();
    const u = json.data ?? json;
    return { id: String(u.id), email: u.email, name: u.full_name, role: u.role };
  },
};

