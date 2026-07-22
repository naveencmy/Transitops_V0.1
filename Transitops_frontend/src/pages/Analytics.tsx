import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PageHeader, Card, StatCard } from '../components/ui';
import { formatNumber } from '../services/format';
import { reportService } from '../services/reportService';
import { tripService } from '../services/tripService';
import { expenseService } from '../services/expenseService';
import { TrendingUp, TrendingDown, DollarSign, Route } from 'lucide-react';
import type { Trip } from '../types';

const PIE_COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

export default function Analytics() {
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [tripStatusDist, setTripStatusDist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [revRes, tripRes, expRes, statusRes] = await Promise.allSettled([
          reportService.getRevenueExpenseTrend(),
          tripService.getTrips(),
          expenseService.getExpenses(),
          reportService.getTripStatusDistribution(),
        ]);
        if (revRes.status === 'fulfilled') setRevenueTrend(Array.isArray(revRes.value) ? revRes.value : []);
        if (tripRes.status === 'fulfilled') setTrips(tripRes.value);
        if (expRes.status === 'fulfilled') setExpenses(expRes.value);
        if (statusRes.status === 'fulfilled') setTripStatusDist(Array.isArray(statusRes.value) ? statusRes.value : []);
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

  const expenseByCategory = expenses.reduce((acc: Record<string, number>, e: any) => {
    const cat = e.category || 'Other';
    acc[cat] = (acc[cat] || 0) + (Number(e.amount) || 0);
    return acc;
  }, {} as Record<string, number>);

  const expenseChartData = Object.entries(expenseByCategory)
    .map(([name, value]) => ({ name, value }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

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
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={expenseChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v) => formatNumber(Number(v))} />
                  <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
                    {expenseChartData.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
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

      </div>
    </div>
  );
}
