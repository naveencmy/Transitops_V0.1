import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogOut, Bell } from 'lucide-react';
import { authService } from '../../services/authService';

interface HeaderProps {
  onMenuClick: () => void;
}

const titleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/fleet': 'Fleet',
  '/drivers': 'Drivers',
  '/trips': 'Trips',
  '/maintenance': 'Maintenance',
  '/expenses': 'Fuel & Expenses',
  '/analytics': 'Analytics',
  '/compliance': 'Compliance',
  '/settings': 'Settings',
};

export default function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const title = titleMap[location.pathname] ?? 'FleetPilot';

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>
        <div className="hidden items-center gap-2.5 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-sm font-semibold text-white">
            {user?.name?.charAt(0) ?? 'U'}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">{user?.name ?? 'User'}</p>
            <p className="text-xs text-slate-400">{user?.role ?? ''}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-rose-600">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
