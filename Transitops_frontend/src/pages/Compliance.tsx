import { useState, useEffect } from 'react';
import { ShieldCheck, TriangleAlert as AlertTriangle, Clock, FileCheck } from 'lucide-react';
import { PageHeader, Badge, Card, StatCard } from '../components/ui';
import { formatDate } from '../services/format';
import { driverService } from '../services/driverService';
import type { Driver, ComplianceItem } from '../types';

function generateComplianceFromDrivers(drivers: Driver[]): ComplianceItem[] {
  const items: ComplianceItem[] = [];
  const now = new Date();
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  drivers.forEach((driver) => {
    if (driver.licenseExpiry) {
      const expiryDate = new Date(driver.licenseExpiry);
      let status: ComplianceItem['status'] = 'Compliant';
      if (expiryDate < now) {
        status = 'Expired';
      } else if (expiryDate < thirtyDays) {
        status = 'Expiring Soon';
      } else if (expiryDate < ninetyDays) {
        status = 'Expiring Soon';
      }
      items.push({
        id: `C-${driver.id}-LIC`,
        driverId: driver.id,
        category: 'License',
        title: 'CDL Renewal',
        status,
        dueDate: driver.licenseExpiry,
        notes: status === 'Expired' ? 'License expired - renewal required' : `Valid through ${formatDate(driver.licenseExpiry)}`,
      });
    }
  });

  return items;
}

export default function Compliance() {
  const [compliance, setCompliance] = useState<ComplianceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function loadData() {
      try {
        const drivers = await driverService.getDrivers();
        const items = generateComplianceFromDrivers(drivers);
        setCompliance(items);
      } catch (err) {
        console.error('Failed to load compliance data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = filter === 'All' ? compliance : compliance.filter((r) => r.status === filter);

  const compliant = compliance.filter((r) => r.status === 'Compliant').length;
  const expiring = compliance.filter((r) => r.status === 'Expiring Soon').length;
  const expired = compliance.filter((r) => r.status === 'Expired').length;
  const pending = compliance.filter((r) => r.status === 'Pending Review').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Compliance" subtitle="Loading..." />
        <div className="flex items-center justify-center py-20">
          <div className="text-sm text-slate-400">Loading compliance data...</div>
        </div>
      </div>
    );
  }

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
                  <td className="px-5 py-3.5 text-slate-600">{r.driverId}</td>
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
