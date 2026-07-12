import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { monthlyRevenue, fleetUtilization, fuelTrend, mockTrips } from '../data/mockData';
import { PageHeader, Card, StatCard } from '../components/ui';
import { formatNumber } from '../services/format';
import { TrendingUp, TrendingDown, DollarSign, Route } from 'lucide-react';

const PIE_COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

export default function Analytics() {
  const totalRevenue = monthlyRevenue.reduce((s, m) => s + (m.revenue as number), 0);
  const totalProfit = monthlyRevenue.reduce((s, m) => s + (m.profit as number), 0);
  const totalExpenses = monthlyRevenue.reduce((s, m) => s + (m.expenses as number), 0);
  const completedTrips = mockTrips.filter((t) => t.status === 'Completed').length;

  const expenseByCategory = [
    { name: 'Fuel', value: 17600 },
    { name: 'Maintenance', value: 6350 },
    { name: 'Tolls', value: 850 },
    { name: 'Insurance', value: 2400 },
    { name: 'Salaries', value: 45000 },
    { name: 'Other', value: 1200 },
  ];

  const tripsByStatus = [
    { name: 'Completed', value: mockTrips.filter((t) => t.status === 'Completed').length },
    { name: 'In Progress', value: mockTrips.filter((t) => t.status === 'In Progress').length },
    { name: 'Scheduled', value: mockTrips.filter((t) => t.status === 'Scheduled').length },
    { name: 'Dispatched', value: mockTrips.filter((t) => t.status === 'Dispatched').length },
    { name: 'Delayed', value: mockTrips.filter((t) => t.status === 'Delayed').length },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Fleet performance and financial insights" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Revenue" value={formatNumber(totalRevenue)} icon={<DollarSign className="h-5 w-5" />} change={12} accent="emerald" />
        <StatCard title="Total Profit" value={formatNumber(totalProfit)} icon={<TrendingUp className="h-5 w-5" />} change={8} accent="sky" />
        <StatCard title="Total Expenses" value={formatNumber(totalExpenses)} icon={<TrendingDown className="h-5 w-5" />} change={5} accent="rose" />
        <StatCard title="Completed Trips" value={String(completedTrips)} icon={<Route className="h-5 w-5" />} change={15} accent="indigo" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Profit Trend" subtitle="Revenue vs Expenses vs Profit">
          <div className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v) => formatNumber(Number(v))} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Expense Breakdown" subtitle="By category">
          <div className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {expenseByCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v) => formatNumber(Number(v))} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Fleet Utilization" subtitle="Vehicle status per day">
          <div className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={fleetUtilization}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="active" name="Active" stackId="a" fill="#0ea5e9" />
                <Bar dataKey="idle" name="Idle" stackId="a" fill="#e2e8f0" />
                <Bar dataKey="maintenance" name="Maintenance" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Trip Status Distribution" subtitle="Current trips by status">
          <div className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={tripsByStatus} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="value" name="Trips" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Fuel & Maintenance Cost Trend" subtitle="Weekly comparison">
        <div className="p-5">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={fuelTrend}>
              <defs>
                <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient>
                <linearGradient id="maintGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v) => formatNumber(Number(v))} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="fuel" name="Fuel" stroke="#f59e0b" strokeWidth={2} fill="url(#fuelGrad)" />
              <Area type="monotone" dataKey="maintenance" name="Maintenance" stroke="#6366f1" strokeWidth={2} fill="url(#maintGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
