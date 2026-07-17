import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Route, Wrench, Fuel, BarChart3, Settings, X, Truck as TruckIcon, ShieldCheck } from 'lucide-react';
import { ROLE_PERMISSIONS, type ModuleKey, type Role } from '../../config/permissions';
import { authService } from '../../services/authService';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const allNavItems: { to: string; key: ModuleKey; label: string; icon: typeof LayoutDashboard }[] = [
  { to: '/dashboard', key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/fleet', key: 'fleet', label: 'Fleet', icon: Truck },
  { to: '/drivers', key: 'drivers', label: 'Drivers', icon: Users },
  { to: '/trips', key: 'trips', label: 'Trips', icon: Route },
  { to: '/maintenance', key: 'maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/expenses', key: 'expenses', label: 'Fuel & Expenses', icon: Fuel },
  { to: '/analytics', key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/compliance', key: 'compliance', label: 'Compliance', icon: ShieldCheck },
  { to: '/settings', key: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const user = authService.getCurrentUser();
  const role = (user?.role ?? 'Dispatcher') as Role;
  const allowed = ROLE_PERMISSIONS[role] ?? [];
  const navItems = allNavItems.filter((item) => allowed.includes(item.key));

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white">
              <TruckIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-slate-900">FleetPilot</p>
              <p className="text-[11px] text-slate-400">Transport MS</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-700">{user?.name ?? 'User'}</p>
            <p className="mt-0.5 text-[11px] text-slate-500">{role}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
