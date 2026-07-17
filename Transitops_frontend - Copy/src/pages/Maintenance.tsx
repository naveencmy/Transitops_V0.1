import { useState } from 'react';
import { Plus, Wrench, Calendar, User as UserIcon, TriangleAlert as AlertTriangle, Play, CircleCheck as CheckCircle } from 'lucide-react';
import { mockMaintenance, mockVehicles } from '../data/mockData';
import { PageHeader, Button, Badge, StatCard, Modal, Input } from '../components/ui';
import { formatNumber, formatDate } from '../services/format';
import type { MaintenanceRecord, MaintenanceStatus } from '../types';

export default function Maintenance() {
  const [records, setRecords] = useState<MaintenanceRecord[]>(mockMaintenance);
  const [filter, setFilter] = useState('All');
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<MaintenanceRecord | null>(null);

  const filtered = filter === 'All' ? records : records.filter((r) => r.status === filter);
  const vehiclePlate = (id: string) => mockVehicles.find((v) => v.id === id)?.plate ?? '—';

  const scheduled = records.filter((r) => r.status === 'Scheduled').length;
  const inProgress = records.filter((r) => r.status === 'In Progress').length;
  const overdue = records.filter((r) => r.status === 'Overdue').length;
  const totalCost = records.reduce((s, r) => s + r.cost, 0);

  const updateStatus = (id: string, status: MaintenanceStatus) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status, completedDate: status === 'Completed' ? new Date().toISOString().split('T')[0] : r.completedDate } : r)));
    setSelected((prev) => (prev?.id === id ? { ...prev, status, completedDate: status === 'Completed' ? new Date().toISOString().split('T')[0] : prev.completedDate } : prev));
  };

  const statusButtons: { status: MaintenanceStatus; label: string; icon: typeof Play; color: string }[] = [
    { status: 'In Progress', label: 'In Progress', icon: Play, color: 'amber' },
    { status: 'Completed', label: 'Completed', icon: CheckCircle, color: 'emerald' },
    { status: 'Overdue', label: 'Overdue', icon: AlertTriangle, color: 'rose' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Maintenance" subtitle="Track and schedule vehicle maintenance" actions={<Button onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Log Maintenance</Button>} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Scheduled" value={String(scheduled)} icon={<Calendar className="h-5 w-5" />} accent="sky" />
        <StatCard title="In Progress" value={String(inProgress)} icon={<Wrench className="h-5 w-5" />} accent="amber" />
        <StatCard title="Overdue" value={String(overdue)} icon={<AlertTriangle className="h-5 w-5" />} accent="rose" />
        <StatCard title="Total Cost" value={formatNumber(totalCost)} icon={<Wrench className="h-5 w-5" />} accent="emerald" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Scheduled', 'In Progress', 'Completed', 'Overdue'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${filter === s ? 'bg-sky-50 text-sky-700' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>{s}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((r) => (
          <button key={r.id} onClick={() => setSelected(r)} className="group rounded-xl border border-slate-200 bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/60">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><Wrench className="h-5 w-5" /></div>
                <div><p className="font-semibold text-slate-900">{r.type}</p><p className="text-xs text-slate-500">{vehiclePlate(r.vehicleId)} · {r.id}</p></div>
              </div>
              <Badge status={r.status} />
            </div>
            <p className="mt-3 text-sm text-slate-600">{r.notes}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500"><Calendar className="h-3.5 w-3.5" /> Scheduled: {formatDate(r.scheduledDate)}</div>
              <div className="flex items-center gap-1.5 text-slate-500"><UserIcon className="h-3.5 w-3.5" /> {r.mechanic}</div>
              {r.completedDate && <div className="flex items-center gap-1.5 text-slate-500"><Calendar className="h-3.5 w-3.5" /> Completed: {formatDate(r.completedDate)}</div>}
              <div className="flex items-center gap-1.5 font-medium text-slate-700">Cost: {formatNumber(r.cost)}</div>
            </div>
          </button>
        ))}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Log Maintenance" size="lg"
        footer={<><Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={() => setAddOpen(false)}>Save Record</Button></>}>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Vehicle</label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40">
              {mockVehicles.map((v) => <option key={v.id} value={v.id}>{v.plate} — {v.model}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Type</label>
              <select className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40">
                {['Oil Change', 'Tire Rotation', 'Brake Service', 'Engine Repair', 'Inspection', 'General'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <Input label="Scheduled Date" type="date" />
          </div>
          <div className="grid grid-cols-2 gap-3"><Input label="Mechanic" placeholder="e.g. Erik Lund" /><Input label="Cost" type="number" placeholder="220" /></div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Notes</label>
            <textarea rows={3} placeholder="Describe the maintenance work..." className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40" />
          </div>
        </div>
      </Modal>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Maintenance Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Wrench className="h-6 w-6" /></div>
                <div><p className="text-lg font-semibold text-slate-900">{selected.type}</p><p className="text-sm text-slate-500">{vehiclePlate(selected.vehicleId)} · {selected.id}</p></div>
              </div>
              <Badge status={selected.status} />
            </div>
            <p className="text-sm text-slate-600">{selected.notes}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { icon: <Calendar className="h-4 w-4" />, label: 'Scheduled Date', value: formatDate(selected.scheduledDate) },
                { icon: <UserIcon className="h-4 w-4" />, label: 'Mechanic', value: selected.mechanic },
                { icon: <Wrench className="h-4 w-4" />, label: 'Cost', value: formatNumber(selected.cost) },
                ...(selected.completedDate ? [{ icon: <Calendar className="h-4 w-4" />, label: 'Completed Date', value: formatDate(selected.completedDate) }] : []),
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"><span className="text-slate-400">{d.icon}</span><div><p className="text-xs text-slate-400">{d.label}</p><p className="text-sm font-medium text-slate-800">{d.value}</p></div></div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-4">
              <p className="mb-2 text-sm font-medium text-slate-700">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {statusButtons.map((btn) => (
                  <button key={btn.status} onClick={() => updateStatus(selected.id, btn.status)} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${selected.status === btn.status ? `bg-${btn.color}-100 text-${btn.color}-700 ring-1 ring-${btn.color}-300` : `bg-${btn.color}-50 text-${btn.color}-600 hover:bg-${btn.color}-100`}`}>
                    <btn.icon className="h-3.5 w-3.5" />{btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
