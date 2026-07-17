import { useState, useEffect } from 'react';
import { Search, Truck, Fuel, Gauge, Plus } from 'lucide-react';
import { PageHeader, Card, Badge, Button, Input, StatCard, Modal } from '../components/ui';
import { formatNumber } from '../services/format';
import { vehicleService } from '../services/vehicleService';
import { driverService } from '../services/driverService';
import type { Vehicle, Driver } from '../types';

export default function Fleet() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Vehicle | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [v, d] = await Promise.all([
          vehicleService.getVehicles(),
          driverService.getDrivers(),
        ]);
        setVehicles(v);
        setDrivers(d);
      } catch (err) {
        console.error('Failed to load vehicles:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const driverName = (id: string | null) => drivers.find((d) => d.id === id)?.name ?? 'Unassigned';

  const filtered = vehicles.filter((v) => {
    const matchesQuery = v.plate.toLowerCase().includes(query.toLowerCase()) || v.model.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'All' || v.status === filter;
    return matchesQuery && matchesFilter;
  });

  const active = vehicles.filter((v) => v.status === 'Active').length;
  const maintenance = vehicles.filter((v) => v.status === 'Maintenance').length;
  const idle = vehicles.filter((v) => v.status === 'Idle').length;
  const avgFuel = vehicles.length > 0 ? Math.round(vehicles.reduce((s, v) => s + v.fuelLevel, 0) / vehicles.length) : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Fleet" subtitle="Loading..." />
        <div className="flex items-center justify-center py-20">
          <div className="text-sm text-slate-400">Loading fleet data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Fleet" subtitle={`${vehicles.length} vehicles registered`} actions={<Button onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Add Vehicle</Button>} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Active" value={String(active)} icon={<Truck className="h-5 w-5" />} accent="emerald" />
        <StatCard title="In Maintenance" value={String(maintenance)} icon={<Truck className="h-5 w-5" />} accent="amber" />
        <StatCard title="Idle" value={String(idle)} icon={<Truck className="h-5 w-5" />} accent="sky" />
        <StatCard title="Avg Fuel Level" value={`${avgFuel}%`} icon={<Fuel className="h-5 w-5" />} accent="indigo" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by plate or model..." className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 focus:outline-none">
          {['All', 'Active', 'Maintenance', 'Idle', 'Retired'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-5 py-3 font-semibold text-slate-600">Plate</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Model</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Type</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Status</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Capacity</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Fuel</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Odometer</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Driver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((v) => (
                <tr key={v.id} onClick={() => setSelected(v)} className="cursor-pointer hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{v.plate}</td>
                  <td className="px-5 py-3.5 text-slate-600">{v.model}</td>
                  <td className="px-5 py-3.5 text-slate-600">{v.type}</td>
                  <td className="px-5 py-3.5"><Badge status={v.status} /></td>
                  <td className="px-5 py-3.5 text-slate-600">{formatNumber(v.capacityKg)} kg</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${v.fuelLevel > 50 ? 'bg-emerald-500' : v.fuelLevel > 25 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${v.fuelLevel}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{v.fuelLevel}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{formatNumber(v.odometerKm)} km</td>
                  <td className="px-5 py-3.5 text-slate-600">{driverName(v.driverId)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Vehicle Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Truck className="h-7 w-7" /></div>
              <div>
                <p className="text-lg font-semibold text-slate-900">{selected.plate}</p>
                <p className="text-sm text-slate-500">{selected.model}</p>
              </div>
              <div className="ml-auto"><Badge status={selected.status} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Truck className="h-4 w-4" />, label: 'Type', value: selected.type },
                { icon: <Gauge className="h-4 w-4" />, label: 'Capacity', value: `${formatNumber(selected.capacityKg)} kg (${(selected.capacityKg / 1000).toFixed(1)}t)` },
                { icon: <Fuel className="h-4 w-4" />, label: 'Fuel Level', value: `${selected.fuelLevel}%` },
                { icon: <Gauge className="h-4 w-4" />, label: 'Odometer', value: `${formatNumber(selected.odometerKm)} km` },
                { icon: <Gauge className="h-4 w-4" />, label: 'Next Maintenance', value: `${formatNumber(selected.nextMaintenanceKm)} km` },
                { icon: <Truck className="h-4 w-4" />, label: 'Driver', value: driverName(selected.driverId) },
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

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Vehicle" size="lg"
        footer={<><Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={() => setAddOpen(false)}>Add Vehicle</Button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Plate Number" placeholder="TX-7790" />
            <Input label="Model" placeholder="Freightliner Cascadia" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Type</label>
              <select className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40">
                {['Truck', 'Van', 'Trailer', 'Bus', 'Refrigerated'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <Input label="Capacity (kg)" type="number" placeholder="12000" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
