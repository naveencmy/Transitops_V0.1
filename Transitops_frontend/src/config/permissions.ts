import type { Role, ModuleKey } from '../types';

export type { Role, ModuleKey };

export const ROLE_DISPLAY_NAMES: Record<Role, string> = {
  Admin: 'Admin',
  FleetManager: 'Fleet Manager',
  Dispatcher: 'Dispatcher',
  SafetyOfficer: 'Safety Officer',
  FinancialAnalyst: 'Financial Analyst',
};

export const ROLE_PERMISSIONS: Record<Role, ModuleKey[]> = {
  Admin: ['dashboard', 'fleet', 'drivers', 'trips', 'maintenance', 'expenses', 'analytics', 'compliance', 'settings'],
  FleetManager: ['dashboard', 'fleet', 'drivers', 'trips', 'maintenance', 'expenses', 'analytics'],
  Dispatcher: ['dashboard', 'fleet', 'drivers', 'trips'],
  SafetyOfficer: ['dashboard', 'drivers', 'compliance'],
  FinancialAnalyst: ['dashboard', 'fleet', 'expenses', 'analytics'],
};

export function canAccess(role: string | undefined | null, module: ModuleKey): boolean {
  if (!role) return false;
  const perms = ROLE_PERMISSIONS[role as Role];
  return Boolean(perms?.includes(module));
}

export const ALL_ROLES: Role[] = ['Admin', 'FleetManager', 'Dispatcher', 'SafetyOfficer', 'FinancialAnalyst'];
