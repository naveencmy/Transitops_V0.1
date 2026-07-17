import type { Role } from '../config/permissions';
import type { AppUser } from '../types';

export interface ManagedUser {id: string;email: string;name: string;role: Role;created_at: string;}

export const userService = {
  async getUsers(): Promise<AppUser[]> {
    const response = await fetch('/api/v1/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async updateUserRole(id: string, role: Role): Promise<AppUser> {
    const response = await fetch(`/api/v1/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error('Failed to update user role');
    return response.json();
  },

  async updateUserName(id: string, name: string): Promise<AppUser> {
    const response = await fetch(`/api/v1/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('Failed to update user name');
    return response.json();
  },

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`/api/v1/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
  },

  async addUser(name: string, email: string, role: Role): Promise<AppUser> {
    const response = await fetch('/api/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role }),
    });
    if (!response.ok) throw new Error('Failed to add user');
    return response.json();
  },
};