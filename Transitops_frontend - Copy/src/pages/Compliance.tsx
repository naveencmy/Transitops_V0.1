import { useState } from 'react';
import { ShieldCheck, TriangleAlert as AlertTriangle, Clock, FileCheck } from 'lucide-react';
import { mockCompliance, mockDrivers } from '../data/mockData';
import { PageHeader, Badge, Card, StatCard } from '../components/ui';
import { formatDate } from '../services/format';

export default function Compliance() {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? mockCompliance : mockCompliance.filter((r) => r.status === filter);
  const driverName = (id: string) => mockDrivers.find((d) => d.id === id)?.name ?? '—';

  const compliant = mockCompliance.filter((r) => r.status === 'Compliant').length;
  const expiring = mockCompliance.filter((r) => r.status === 'Expiring Soon').length;
  const expired = mockCompliance.filter((r) => r.status === 'Expired').length;
  const pending = mockCompliance.filter((r) => r.status === 'Pending Review').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Compliance" subtitle="Driver compliance and safety records" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Compliant" value={String(compliant)} icon={<FileCheck className="h-5 w-5" />} accent="emerald" />
        <StatCard title="Expiring Soon" value={String(expiring)} icon={<Clock className="h-5 w-5" />} accent="amber" />
        <StatCard title="Expired" value={String(expired)} icon={<AlertTriangle className="h-5 w-5" />} accent="rose" />
        <StatCard title="Pending Review" value={String(pending)} icon={<ShieldCheck className="h-5 w-5" />} accent="sky" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Compliant', 'Expiring Soon', 'Expired', 'Pending Review'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${filter === s ? 'bg-sky-50 text-sky-700' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>{s}</button>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-5 py-3 font-semibold text-slate-600">ID</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Driver</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Category</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Title</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Due Date</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Status</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{r.id}</td>
                  <td className="px-5 py-3.5 text-slate-600">{driverName(r.driverId)}</td>
                  <td className="px-5 py-3.5 text-slate-600">{r.category}</td>
                  <td className="px-5 py-3.5 text-slate-600">{r.title}</td>
                  <td className="px-5 py-3.5 text-slate-600">{formatDate(r.dueDate)}</td>
                  <td className="px-5 py-3.5"><Badge status={r.status} /></td>
                  <td className="px-5 py-3.5 text-slate-500">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
