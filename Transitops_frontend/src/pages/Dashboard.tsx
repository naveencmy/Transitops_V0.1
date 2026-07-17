import { useState, useEffect } from 'react';
import { Truck, Users, Route, DollarSign, TrendingUp, TriangleAlert as AlertTriangle } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { PageHeader, Card, StatCard, Badge } from '../components/ui';
import { formatNumber } from '../services/format';
import { dashboardService } from '../services/dashboardService';
import { vehicleService } from '../services/vehicleService';
import { driverService } from '../services/driverService';
import { tripService } from '../services/tripService';
import { maintenanceService } from '../services/maintenanceService';
import type { Vehicle, Driver, Trip, MaintenanceRecord } from '../types';

const PIE_COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [v, d, t, m] = await Promise.all([
          vehicleService.getVehicles(),
          driverService.getDrivers(),
          tripService.getTrips(),
          maintenanceService.getRecords(),
        ]);
        setVehicles(v);
        setDrivers(d);
        setTrips(t);
        setMaintenance(m);
        try {
          const kpiRes = await dashboardService.getKPIs();
          setKpis(kpiRes.data || kpiRes);
        } catch { /* dashboard KPIs optional */ }
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeVehicles = vehicles.filter((v) => v.status === 'Active').length;
  const onDutyDrivers = drivers.filter((d) => d.status === 'On Duty').length;
  const activeTrips = trips.filter((t) => t.status === 'In Progress' || t.status === 'Dispatched').length;
  const overdueMaint = maintenance.filter((m) => m.status === 'Overdue').length;

  const totalRevenue = kpis?.total_revenue ?? 0;

  const vehicleStatusData = [
    { name: 'Active', value: vehicles.filter((v) => v.status === 'Active').length },
    { name: 'Maintenance', value: vehicles.filter((v) => v.status === 'Maintenance').length },
    { name: 'Idle', value: vehicles.filter((v) => v.status === 'Idle').length },
    { name: 'Retired', value: vehicles.filter((v) => v.status === 'Retired').length },
  ].filter((d) => d.value > 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" subtitle="Fleet operations overview" />
        <div className="flex items-center justify-center py-20">
          <div className="text-sm text-slate-400">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Fleet operations overview" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Active Vehicles" value={String(activeVehicles)} icon={<Truck className="h-5 w-5" />} change={0} accent="sky" />
        <StatCard title="On-Duty Drivers" value={String(onDutyDrivers)} icon={<Users className="h-5 w-5" />} change={0} accent="emerald" />
        <StatCard title="Active Trips" value={String(activeTrips)} icon={<Route className="h-5 w-5" />} change={0} accent="amber" />
        <StatCard title="Total Revenue" value={formatNumber(totalRevenue)} icon={<DollarSign className="h-5 w-5" />} change={0} accent="indigo" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Vehicle Status" subtitle="Current fleet breakdown">
          <div className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={vehicleStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {vehicleStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent Alerts" subtitle="Items needing attention">
          <div className="divide-y divide-slate-100">
            {overdueMaint > 0 && maintenance.filter((m) => m.status === 'Overdue').slice(0, 3).map((m) => (
              <AlertRow key={m.id} icon={<AlertTriangle className="h-4 w-4 text-rose-500" />} title={`${m.type} overdue`} subtitle={`${m.vehicleId} — ${m.notes}`} badge="Overdue" />
            ))}
            {overdueMaint === 0 && (
              <div className="p-5 text-center text-sm text-slate-400">No overdue items. All clear!</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AlertRow({ icon, title, subtitle, badge }: { icon: React.ReactNode; title: string; subtitle: string; badge: string }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-800">{title}</p>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      <Badge status={badge} />
    </div>
  );
}
