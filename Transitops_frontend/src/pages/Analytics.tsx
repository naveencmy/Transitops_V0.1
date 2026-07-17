import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PageHeader, Card, StatCard } from '../components/ui';
import { formatNumber } from '../services/format';
import { reportService } from '../services/reportService';
import { tripService } from '../services/tripService';
import { TrendingUp, TrendingDown, DollarSign, Route } from 'lucide-react';
import type { Trip } from '../types';

export default function Analytics() {
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [operationalCost, setOperationalCost] = useState<any[]>([]);
  const [tripStatusDist, setTripStatusDist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [revRes, tripRes, costRes, statusRes] = await Promise.all([
          reportService.getRevenueExpenseTrend().catch(() => ({ data: [] })),
          tripService.getTrips(),
          reportService.getOperationalCost().catch(() => ({ data: [] })),
          reportService.getTripStatusDistribution().catch(() => ({ data: [] })),
        ]);
        setRevenueTrend(revRes.data || []);
        setTrips(tripRes);
        setOperationalCost(costRes.data || []);
        setTripStatusDist(statusRes.data || []);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalRevenue = revenueTrend.reduce((s, m) => s + (Number(m.revenue) || 0), 0);
  const totalExpenses = revenueTrend.reduce((s, m) => s + (Number(m.expenses) || 0), 0);
  const totalProfit = totalRevenue - totalExpenses;
  const completedTrips = trips.filter((t) => t.status === 'Completed').length;

  const expenseByCategory = operationalCost.reduce((acc: Record<string, number>, v: any) => {
    acc['Fuel'] = (acc['Fuel'] || 0) + (Number(v.fuel_cost) || 0);
    acc['Maintenance'] = (acc['Maintenance'] || 0) + (Number(v.maintenance_cost) || 0);
    return acc;
  }, {} as Record<string, number>);

  const expenseChartData = Object.entries(expenseByCategory)
    .map(([name, value]) => ({ name, value }))
    .filter((d) => d.value > 0);

  const PIE_COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

  const tripsByStatus = tripStatusDist.map((t: any) => ({
    name: t.status,
    value: Number(t.count),
  })).filter((d) => d.value > 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics" subtitle="Loading..." />
        <div className="flex items-center justify-center py-20">
          <div className="text-sm text-slate-400">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Fleet performance and financial insights" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Revenue" value={formatNumber(totalRevenue)} icon={<DollarSign className="h-5 w-5" />} change={0} accent="emerald" />
        <StatCard title="Total Profit" value={formatNumber(totalProfit)} icon={<TrendingUp className="h-5 w-5" />} change={0} accent="sky" />
        <StatCard title="Total Expenses" value={formatNumber(totalExpenses)} icon={<TrendingDown className="h-5 w-5" />} change={0} accent="rose" />
        <StatCard title="Completed Trips" value={String(completedTrips)} icon={<Route className="h-5 w-5" />} change={0} accent="indigo" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Revenue vs Expenses" subtitle="Revenue vs Expenses by month">
          <div className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v) => formatNumber(Number(v))} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Expense Breakdown" subtitle="By category">
          <div className="p-5">
            {expenseChartData.length > 0 ? (
              <div className="flex items-center justify-center py-10 text-sm text-slate-400">
                Expense breakdown data available
              </div>
            ) : (
              <div className="flex items-center justify-center py-10 text-sm text-slate-400">
                No expense data available
              </div>
            )}
          </div>
        </Card>

        <Card title="Trip Status Distribution" subtitle="Current trips by status">
          <div className="p-5">
            {tripsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={tripsByStatus} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                  <Bar dataKey="value" name="Trips" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center py-10 text-sm text-slate-400">
                No trip data available
              </div>
            )}
          </div>
        </Card>

        <Card title="Operational Cost" subtitle="Cost breakdown by vehicle">
          <div className="p-5">
            {operationalCost.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-2 font-semibold text-slate-600">Vehicle</th>
                      <th className="pb-2 font-semibold text-slate-600 text-right">Fuel Cost</th>
                      <th className="pb-2 font-semibold text-slate-600 text-right">Maint. Cost</th>
                      <th className="pb-2 font-semibold text-slate-600 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {operationalCost.slice(0, 5).map((v: any) => (
                      <tr key={v.id}>
                        <td className="py-2 text-slate-700">{v.registration_number || v.vehicle_name}</td>
                        <td className="py-2 text-right text-slate-600">{formatNumber(Number(v.fuel_cost) || 0)}</td>
                        <td className="py-2 text-right text-slate-600">{formatNumber(Number(v.maintenance_cost) || 0)}</td>
                        <td className="py-2 text-right font-medium text-slate-800">{formatNumber(Number(v.total_revenue) || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center py-10 text-sm text-slate-400">
                No operational cost data available
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
