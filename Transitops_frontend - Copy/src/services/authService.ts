import { mockUsers } from '../data/mockData';
import type { AppUser, Role } from '../types';

const STORAGE_KEY = 'fleetpilot_session';
const USERS_KEY = 'fleetpilot_users';

function getUsers(): AppUser[] {const raw = localStorage.getItem(USERS_KEY);if (raw) {try { return JSON.parse(raw) as AppUser[]; } catch { /* ignore */ }}localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));return [...mockUsers];}

function saveUsers(users: AppUser[]) {localStorage.setItem(USERS_KEY, JSON.stringify(users));}

export const authService = {login(email: string, password: string): AppUser {if (!email || !password) throw new Error('Email and password are required');const users = getUsers();const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());if (!user) throw new Error('Invalid email or password');localStorage.setItem(STORAGE_KEY, JSON.stringify(user));return user;},

logout(): void {localStorage.removeItem(STORAGE_KEY);},

getCurrentUser(): AppUser | null {const raw = localStorage.getItem(STORAGE_KEY);if (!raw) return null;try { return JSON.parse(raw) as AppUser; } catch { return null; }},

isAuthenticated(): boolean {return Boolean(localStorage.getItem(STORAGE_KEY));},};

export const userService = {getUsers(): AppUser[] { return getUsers(); },

updateUserRole(id: string, role: Role): AppUser[] {const users = getUsers().map((u) => (u.id === id ? { ...u, role } : u));saveUsers(users);return users;},

updateUserName(id: string, name: string): AppUser[] {const users = getUsers().map((u) => (u.id === id ? { ...u, name } : u));saveUsers(users);return users;},

deleteUser(id: string): AppUser[] {const users = getUsers().filter((u) => u.id !== id);saveUsers(users);return users;},

addUser(name: string, email: string, role: Role): AppUser[] {const users = getUsers();const id = U-${String(users.length + 1).padStart(3, '0')};const updated = [...users, { id, name, email, role }];saveUsers(updated);return updated;},};

