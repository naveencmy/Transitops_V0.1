import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Fleet from './pages/Fleet';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import FuelExpenses from './pages/FuelExpenses';
import Analytics from './pages/Analytics';
import Compliance from './pages/Compliance';
import Settings from './pages/Settings';
import type { ModuleKey } from './config/permissions';

function Protected({ module, children }: { module: ModuleKey; children: React.ReactNode }) {
  return <AppLayout module={module}>{children}</AppLayout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Protected module="dashboard"><Dashboard /></Protected>} />
        <Route path="/fleet" element={<Protected module="fleet"><Fleet /></Protected>} />
        <Route path="/drivers" element={<Protected module="drivers"><Drivers /></Protected>} />
        <Route path="/trips" element={<Protected module="trips"><Trips /></Protected>} />
        <Route path="/maintenance" element={<Protected module="maintenance"><Maintenance /></Protected>} />
        <Route path="/expenses" element={<Protected module="expenses"><FuelExpenses /></Protected>} />
        <Route path="/analytics" element={<Protected module="analytics"><Analytics /></Protected>} />
        <Route path="/compliance" element={<Protected module="compliance"><Compliance /></Protected>} />
        <Route path="/settings" element={<Protected module="settings"><Settings /></Protected>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
