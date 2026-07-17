import type { Role, ModuleKey } from '../types';

export type { Role, ModuleKey };

export const ROLE_PERMISSIONS: Record<Role, ModuleKey[]> = {
  Admin: ['dashboard', 'fleet', 'drivers', 'trips', 'maintenance', 'expenses', 'analytics', 'compliance', 'settings'],
  'Fleet Manager': ['dashboard', 'fleet', 'maintenance'],
  Dispatcher: ['dashboard', 'trips'],
  'Safety Officer': ['dashboard', 'drivers', 'compliance'],
  'Financial Analyst': ['dashboard', 'expenses', 'analytics'],
};

export function canAccess(role: string | undefined | null, module: ModuleKey): boolean {
  if (!role) return false;
  const perms = ROLE_PERMISSIONS[role as Role];
  return Boolean(perms?.includes(module));
}

export const ALL_ROLES: Role[] = ['Admin', 'Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'];
