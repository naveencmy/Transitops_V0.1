import { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Clock, Package, Send, Ban, TriangleAlert as AlertTriangle } from 'lucide-react';
import { PageHeader, Button, Badge, Card, Modal, Input } from '../components/ui';
import { formatNumber } from '../services/format';
import { tripService } from '../services/tripService';
import { vehicleService } from '../services/vehicleService';
import { driverService } from '../services/driverService';
import type { Trip, Vehicle, Driver, TripStatus } from '../types';

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Trip | null>(null);

  const loadTrips = async () => {
    const [t, v, d] = await Promise.allSettled([
      tripService.getTrips(),
      vehicleService.getVehicles(),
      driverService.getDrivers(),
    ]);
    if (t.status === 'fulfilled') setTrips(t.value);
    if (v.status === 'fulfilled') setVehicles(v.value);
    if (d.status === 'fulfilled') setDrivers(d.value);
  };

  useEffect(() => {
    loadTrips().finally(() => setLoading(false));
  }, []);

  const filtered = trips.filter((t) => {
    const matchesQuery = (t.origin || '').toLowerCase().includes(query.toLowerCase()) || (t.destination || '').toLowerCase().includes(query.toLowerCase()) || (t.id || '').toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'All' || t.status === filter;
    return matchesQuery && matchesFilter;
  });

  const driverName = (id: string) => drivers.find((d) => d.id === id)?.name ?? '—';
  const vehiclePlate = (id: string) => vehicles.find((v) => v.id === id)?.plate ?? '—';

  const updateTripStatus = async (id: string, action: 'dispatch' | 'complete' | 'cancel') => {
    try {
      if (action === 'dispatch') {
        await tripService.dispatchTrip(id);
        setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'Dispatched' as TripStatus } : t)));
        setSelected((prev) => (prev?.id === id ? { ...prev, status: 'Dispatched' as TripStatus } : prev));
      } else if (action === 'complete') {
        const trip = trips.find((t) => t.id === id);
        await tripService.completeTrip(id, {
          actual_distance_km: trip?.distanceKm || 0,
          fuel_consumed_liters: 50,
          final_odometer_km: 0,
        });
        setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'Completed' as TripStatus } : t)));
        setSelected((prev) => (prev?.id === id ? { ...prev, status: 'Completed' as TripStatus } : prev));
      } else if (action === 'cancel') {
        await tripService.cancelTrip(id);
        setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'Cancelled' as TripStatus } : t)));
        setSelected((prev) => (prev?.id === id ? { ...prev, status: 'Cancelled' as TripStatus } : prev));
      }
    } catch (err) {
      console.error('Failed to update trip:', err);
    }
  };

  const canDispatch = (t: Trip) => t.status === 'Scheduled' || t.status === 'Delayed';
  const canCancel = (t: Trip) => t.status !== 'Completed' && t.status !== 'Cancelled';

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Trips" subtitle="Loading..." />
        <div className="flex items-center justify-center py-20">
          <div className="text-sm text-slate-400">Loading trips...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Trips" subtitle={`${trips.length} total trips · ${trips.filter((t) => t.status === 'In Progress' || t.status === 'Dispatched').length} active`} actions={<Button onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Schedule Trip</Button>} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by route or trip ID..." className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 focus:outline-none">
          {['All', 'Scheduled', 'Dispatched', 'In Progress', 'Completed', 'Delayed', 'Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-5 py-3 font-semibold text-slate-600">Trip</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Route</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Driver</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Vehicle</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Departure</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Status</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Revenue</th>
                <th className="px-5 py-3 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{t.tripCode}</td>
                  <td className="px-5 py-3.5 text-slate-600">
                    <div className="flex items-center gap-1.5"><span>{t.origin}</span><span className="text-slate-300">→</span><span>{t.destination}</span></div>
                    <span className="text-xs text-slate-400">{t.distanceKm} km · {t.weightTons}t</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{driverName(t.driverId)}</td>
                  <td className="px-5 py-3.5 text-slate-600">{vehiclePlate(t.vehicleId)}</td>
                  <td className="px-5 py-3.5 text-slate-600">{t.departureTime}</td>
                  <td className="px-5 py-3.5"><Badge status={t.status} /></td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">{formatNumber(t.revenue)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1.5">
                      {canDispatch(t) && (
                        <button onClick={() => updateTripStatus(t.id, 'dispatch')} className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100"><Send className="h-3.5 w-3.5" /> Dispatch</button>
                      )}
                      {canCancel(t) && (
                        <button onClick={() => updateTripStatus(t.id, 'cancel')} className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100"><Ban className="h-3.5 w-3.5" /> Cancel</button>
                      )}
                      <button onClick={() => setSelected(t)} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ScheduleTripModal open={addOpen} onClose={() => setAddOpen(false)} vehicles={vehicles} drivers={drivers} onCreated={loadTrips} />

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Trip Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-lg font-semibold text-slate-900">{selected.tripCode}</p><p className="text-sm text-slate-500">{selected.origin} → {selected.destination}</p></div>
              <Badge status={selected.status} />
            </div>
            {selected.status === 'In Progress' && (
              <div>
                <div className="flex items-center justify-between text-xs"><span className="text-slate-400">Progress</span><span className="font-medium text-slate-600">{selected.progress}%</span></div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${selected.progress}%` }} /></div>
              </div>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { icon: <MapPin className="h-4 w-4" />, label: 'Distance', value: `${selected.distanceKm} km` },
                { icon: <Clock className="h-4 w-4" />, label: 'Departure', value: selected.departureTime },
                { icon: <Clock className="h-4 w-4" />, label: 'Arrival', value: selected.arrivalTime },
                { icon: <Package className="h-4 w-4" />, label: 'Cargo', value: `${selected.cargo} (${selected.weightTons}t)` },
                { icon: <MapPin className="h-4 w-4" />, label: 'Revenue', value: formatNumber(selected.revenue) },
                { icon: <MapPin className="h-4 w-4" />, label: 'Vehicle', value: vehiclePlate(selected.vehicleId) },
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"><span className="text-slate-400">{d.icon}</span><div><p className="text-xs text-slate-400">{d.label}</p><p className="text-sm font-medium text-slate-800">{d.value}</p></div></div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              <Button size="sm" onClick={() => updateTripStatus(selected.id, 'complete')}>Mark Completed</Button>
              {canDispatch(selected) && <Button size="sm" variant="secondary" onClick={() => updateTripStatus(selected.id, 'dispatch')}><Send className="h-3.5 w-3.5" /> Dispatch</Button>}
              {canCancel(selected) && <Button size="sm" variant="danger" onClick={() => updateTripStatus(selected.id, 'cancel')}><Ban className="h-3.5 w-3.5" /> Cancel</Button>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function ScheduleTripModal({ open, onClose, vehicles, drivers, onCreated }: { open: boolean; onClose: () => void; vehicles: Vehicle[]; drivers: Driver[]; onCreated: () => void }) {
  const [formOrigin, setFormOrigin] = useState('');
  const [formDestination, setFormDestination] = useState('');
  const [formDriverId, setFormDriverId] = useState('');
  const [formVehicleId, setFormVehicleId] = useState('');
  const [formWeight, setFormWeight] = useState('');
  const [formCargo, setFormCargo] = useState('');
  const [formRevenue, setFormRevenue] = useState('');
  const [formDistance, setFormDistance] = useState('');
  const [weightError, setWeightError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedVehicle = vehicles.find((v) => v.id === formVehicleId);
  const vehicleCapacityTons = selectedVehicle ? selectedVehicle.capacityKg / 1000 : 0;
  const weightNum = parseFloat(formWeight);
  const isWeightValid = !isNaN(weightNum) && weightNum > 0 && weightNum <= vehicleCapacityTons;
  const canSchedule = formOrigin && formDestination && formDriverId && formVehicleId && isWeightValid;

  const resetForm = () => {
    setFormOrigin('');
    setFormDestination('');
    setFormDriverId('');
    setFormVehicleId('');
    setFormWeight('');
    setFormCargo('');
    setFormRevenue('');
    setFormDistance('');
    setWeightError('');
  };

  const handleWeightChange = (value: string) => {
    setFormWeight(value);
    const num = parseFloat(value);
    if (value && !isNaN(num) && selectedVehicle && num > vehicleCapacityTons) {
      setWeightError('Goods weight exceeds the selected vehicle capacity.');
    } else {
      setWeightError('');
    }
  };

  const handleCreate = async () => {
    if (!canSchedule) return;
    setSubmitting(true);
    try {
      await tripService.createTrip({
        source: formOrigin,
        destination: formDestination,
        driver_id: Number(formDriverId),
        vehicle_id: Number(formVehicleId),
        cargo_weight_kg: Number(formWeight) * 1000,
        cargo_description: formCargo,
        revenue: formRevenue ? Number(formRevenue) : undefined,
        planned_distance_km: formDistance ? Number(formDistance) : undefined,
      } as any);
      resetForm();
      onClose();
      await onCreated();
    } catch (err: any) {
      console.error('Failed to create trip:', err);
      alert(err.message || 'Failed to create trip');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={() => { onClose(); resetForm(); }} title="Schedule New Trip" size="lg"
      footer={<><Button variant="ghost" onClick={() => { onClose(); resetForm(); }}>Cancel</Button><Button onClick={handleCreate} disabled={submitting || !canSchedule}>{submitting ? 'Scheduling...' : 'Schedule'}</Button></>}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Origin" placeholder="Houston, TX" value={formOrigin} onChange={(e) => setFormOrigin(e.target.value)} />
          <Input label="Destination" placeholder="New Orleans, LA" value={formDestination} onChange={(e) => setFormDestination(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Driver</label>
            <select value={formDriverId} onChange={(e) => setFormDriverId(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40">
              <option value="">Select a driver...</option>
              {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Vehicle</label>
            <select value={formVehicleId} onChange={(e) => { setFormVehicleId(e.target.value); setWeightError(''); setFormWeight(''); }} className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40">
              <option value="">Select a vehicle...</option>
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.plate} — {v.model} ({(v.capacityKg / 1000).toFixed(1)}t cap)</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Goods Weight (tons){selectedVehicle && <span className="ml-2 text-xs text-slate-400">Max capacity: {vehicleCapacityTons.toFixed(1)} tons</span>}</label>
          <Input type="number" placeholder="e.g. 10" value={formWeight} onChange={(e) => handleWeightChange(e.target.value)} />
          {weightError && <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700"><AlertTriangle className="h-3.5 w-3.5" />{weightError}</div>}
          {selectedVehicle && isWeightValid && <div className="mt-2 text-xs text-emerald-600">Weight is within vehicle capacity.</div>}
        </div>
        <Input label="Cargo Description" placeholder="Industrial Machinery" value={formCargo} onChange={(e) => setFormCargo(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Revenue" type="number" placeholder="4200" value={formRevenue} onChange={(e) => setFormRevenue(e.target.value)} />
          <Input label="Distance (km)" type="number" placeholder="568" value={formDistance} onChange={(e) => setFormDistance(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}
