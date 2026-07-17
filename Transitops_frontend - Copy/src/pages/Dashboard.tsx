import { Truck, Users, Route, DollarSign, TrendingUp, TriangleAlert as AlertTriangle } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { mockVehicles, mockDrivers, mockTrips, mockMaintenance, monthlyRevenue, fleetUtilization } from '../data/mockData';
import { PageHeader, Card, StatCard, Badge } from '../components/ui';
import { formatNumber } from '../services/format';

const PIE_COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const activeVehicles = mockVehicles.filter((v) => v.status === 'Active').length;
  const onDutyDrivers = mockDrivers.filter((d) => d.status === 'On Duty').length;
  const activeTrips = mockTrips.filter((t) => t.status === 'In Progress' || t.status === 'Dispatched').length;
  const overdueMaint = mockMaintenance.filter((m) => m.status === 'Overdue').length;
  const totalRevenue = monthlyRevenue.reduce((s, m) => s + (m.revenue as number), 0);

  const vehicleStatusData = [
    { name: 'Active', value: mockVehicles.filter((v) => v.status === 'Active').length },
    { name: 'Maintenance', value: mockVehicles.filter((v) => v.status === 'Maintenance').length },
    { name: 'Idle', value: mockVehicles.filter((v) => v.status === 'Idle').length },
    { name: 'Retired', value: mockVehicles.filter((v) => v.status === 'Retired').length },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Fleet operations overview" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Active Vehicles" value={String(activeVehicles)} icon={<Truck className="h-5 w-5" />} change={3} accent="sky" />
        <StatCard title="On-Duty Drivers" value={String(onDutyDrivers)} icon={<Users className="h-5 w-5" />} change={5} accent="emerald" />
        <StatCard title="Active Trips" value={String(activeTrips)} icon={<Route className="h-5 w-5" />} change={-2} accent="amber" />
        <StatCard title="Total Revenue" value={formatNumber(totalRevenue)} icon={<DollarSign className="h-5 w-5" />} change={8} accent="indigo" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Revenue vs Expenses" subtitle="Last 7 months" className="lg:col-span-2">
          <div className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v) => formatNumber(Number(v))} />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} fill="url(#revGrad)" />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fill="url(#expGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

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
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Fleet Utilization" subtitle="Vehicles active per day">
          <div className="p-5">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={fleetUtilization}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="active" name="Active" stackId="a" fill="#0ea5e9" radius={[0, 0, 0, 0]} />
                <Bar dataKey="idle" name="Idle" stackId="a" fill="#e2e8f0" radius={[0, 0, 0, 0]} />
                <Bar dataKey="maintenance" name="Maintenance" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent Alerts" subtitle="Items needing attention">
          <div className="divide-y divide-slate-100">
            <AlertRow icon={<AlertTriangle className="h-4 w-4 text-rose-500" />} title="Brake service overdue" subtitle="V-005 (Peterbilt 579) — 11 days overdue" badge="Overdue" />
            <AlertRow icon={<TrendingUp className="h-4 w-4 text-amber-500" />} title="License expiring soon" subtitle="D-002 (Sarah Williams) — expires Nov 2026" badge="Expiring Soon" />
            <AlertRow icon={<AlertTriangle className="h-4 w-4 text-rose-500" />} title="Drug screening expired" subtitle="D-006 (Jessica Martinez) — expired May 2026" badge="Expired" />
            <AlertRow icon={<Truck className="h-4 w-4 text-amber-500" />} title="Vehicle in maintenance" subtitle="V-003 (Volvo VNL 760) — turbocharger repair" badge="Maintenance" />
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
