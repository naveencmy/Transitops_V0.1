import { useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { authService } from '../../services/authService';
import { canAccess, type ModuleKey } from '../../config/permissions';

interface AppLayoutProps {
  module: ModuleKey;
  children: ReactNode;
}

export default function AppLayout({ module, children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const user = authService.getCurrentUser();

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!canAccess(user.role, module)) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
