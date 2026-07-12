import { useState } from 'react';
import { Search, User as UserIcon, Phone, Mail, Star, Plus } from 'lucide-react';
import { mockDrivers, mockVehicles } from '../data/mockData';
import { PageHeader, Badge, Button, Input, StatCard, Modal } from '../components/ui';
import { formatDate } from '../services/format';
import type { Driver } from '../types';

export default function Drivers() {
  const [drivers] = useState<Driver[]>(mockDrivers);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Driver | null>(null);

  const vehiclePlate = (id: string | null) => mockVehicles.find((v) => v.id === id)?.plate ?? 'None';

  const filtered = drivers.filter((d) => {
    const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase()) || d.email.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'All' || d.status === filter;
    return matchesQuery && matchesFilter;
  });

  const onDuty = drivers.filter((d) => d.status === 'On Duty').length;
  const offDuty = drivers.filter((d) => d.status === 'Off Duty').length;
  const onLeave = drivers.filter((d) => d.status === 'On Leave').length;
  const avgRating = (drivers.reduce((s, d) => s + d.rating, 0) / drivers.length).toFixed(1);

  return (
    <div className="space-y-6">
      <PageHeader title="Drivers" subtitle={`${drivers.length} drivers in the system`} actions={<Button onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Add Driver</Button>} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="On Duty" value={String(onDuty)} icon={<UserIcon className="h-5 w-5" />} accent="emerald" />
        <StatCard title="Off Duty" value={String(offDuty)} icon={<UserIcon className="h-5 w-5" />} accent="sky" />
        <StatCard title="On Leave" value={String(onLeave)} icon={<UserIcon className="h-5 w-5" />} accent="amber" />
        <StatCard title="Avg Rating" value={avgRating} icon={<Star className="h-5 w-5" />} accent="indigo" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email..." className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 focus:outline-none">
          {['All', 'On Duty', 'Off Duty', 'On Leave', 'Suspended'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((d) => (
          <button key={d.id} onClick={() => setSelected(d)} className="group rounded-xl border border-slate-200 bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/60">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-lg font-semibold text-sky-700">{d.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-slate-900">{d.name}</p>
                  <p className="text-xs text-slate-500">{d.licenseNumber}</p>
                </div>
              </div>
              <Badge status={d.status} />
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-slate-500">
              <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {d.phone}</p>
              <p className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {d.email}</p>
              <p className="flex items-center gap-1.5"><UserIcon className="h-3.5 w-3.5" /> Assigned: {vehiclePlate(d.assignedVehicleId)}</p>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium text-slate-600">{d.rating}</span>
                <span className="text-xs text-slate-400">· {d.totalTrips} trips</span>
              </div>
              <span className="text-xs text-slate-400">License: {formatDate(d.licenseExpiry)}</span>
            </div>
          </button>
        ))}
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Driver Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-xl font-semibold text-sky-700">{selected.name.charAt(0)}</div>
              <div>
                <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                <p className="text-sm text-slate-500">{selected.email}</p>
              </div>
              <div className="ml-auto"><Badge status={selected.status} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Phone className="h-4 w-4" />, label: 'Phone', value: selected.phone },
                { icon: <Mail className="h-4 w-4" />, label: 'Email', value: selected.email },
                { icon: <UserIcon className="h-4 w-4" />, label: 'License #', value: selected.licenseNumber },
                { icon: <UserIcon className="h-4 w-4" />, label: 'License Expiry', value: formatDate(selected.licenseExpiry) },
                { icon: <Star className="h-4 w-4" />, label: 'Rating', value: `${selected.rating} / 5.0` },
                { icon: <UserIcon className="h-4 w-4" />, label: 'Total Trips', value: String(selected.totalTrips) },
                { icon: <UserIcon className="h-4 w-4" />, label: 'Assigned Vehicle', value: vehiclePlate(selected.assignedVehicleId) },
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                  <span className="text-slate-400">{d.icon}</span>
                  <div>
                    <p className="text-xs text-slate-400">{d.label}</p>
                    <p className="text-sm font-medium text-slate-800">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Driver" size="lg"
        footer={<><Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={() => setAddOpen(false)}>Add Driver</Button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Full Name" placeholder="John Doe" />
            <Input label="Phone" placeholder="+1 713-555-0100" />
          </div>
          <Input label="Email" type="email" placeholder="john@fleetco.com" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="License Number" placeholder="CDL-A-99299" />
            <Input label="License Expiry" type="date" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
