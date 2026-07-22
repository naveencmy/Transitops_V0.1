import { useState, useEffect } from 'react';
import { Plus, Fuel, Receipt, TrendingDown } from 'lucide-react';
import { PageHeader, Card, Button, Input, StatCard, Modal, Badge } from '../components/ui';
import { formatNumber, formatNumber2, formatDate } from '../services/format';
import { expenseService } from '../services/expenseService';
import { vehicleService } from '../services/vehicleService';
import type { Vehicle, ExpenseCategory } from '../types';

export default function FuelExpenses() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [fuelRecords, setFuelRecords] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [tab, setTab] = useState<'expenses' | 'fuel'>('expenses');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const [formDate, setFormDate] = useState('');
  const [formCategory, setFormCategory] = useState<ExpenseCategory>('Fuel');
  const [formDescription, setFormDescription] = useState('');
  const [formVehicleId, setFormVehicleId] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    const [e, f, v] = await Promise.allSettled([
      expenseService.getExpenses(),
      expenseService.getFuelRecords(),
      vehicleService.getVehicles(),
    ]);
    if (e.status === 'fulfilled') setExpenses(e.value);
    if (f.status === 'fulfilled') setFuelRecords(f.value);
    if (v.status === 'fulfilled') setVehicles(v.value);
  };

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, []);

  const nonFuelExpenses = expenses.filter((e) => e.category !== 'Fuel');
  const filteredExpenses = categoryFilter === 'All' ? nonFuelExpenses : nonFuelExpenses.filter((e) => e.category === categoryFilter);
  const totalExpenses = nonFuelExpenses.reduce((s, e) => s + (e.amount || 0), 0);
  const totalFuelCost = expenses.filter((e) => e.category === 'Fuel').reduce((s, e) => s + (e.amount || 0), 0);
  const totalMaintenanceCost = expenses.filter((e) => e.category === 'Maintenance').reduce((s, e) => s + (e.amount || 0), 0);
  const avgFuelPerVehicle = fuelRecords.length > 0 ? fuelRecords.reduce((s, f) => s + (f.totalCost || 0), 0) / fuelRecords.length : 0;

  const vehiclePlate = (id: string | null) => vehicles.find((v) => v.id === id)?.plate ?? '—';

  const resetForm = () => {
    setFormDate('');
    setFormCategory('Fuel');
    setFormDescription('');
    setFormVehicleId('');
    setFormAmount('');
  };

  const handleCreate = async () => {
    if (!formCategory || !formAmount) return;
    setSubmitting(true);
    try {
      await expenseService.createExpense({
        category: formCategory,
        amount: Number(formAmount),
        vehicle_id: formVehicleId ? Number(formVehicleId) : null,
        description: formDescription,
      });
      resetForm();
      setAddOpen(false);
      await loadData();
    } catch (err: any) {
      console.error('Failed to create expense:', err);
      alert(err.message || 'Failed to create expense');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Fuel & Expenses" subtitle="Loading..." />
        <div className="flex items-center justify-center py-20">
          <div className="text-sm text-slate-400">Loading expenses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Fuel & Expenses" subtitle="Track fuel costs and operational expenses" actions={<Button onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Add Expense</Button>} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Expenses" value={formatNumber(totalExpenses)} icon={<Receipt className="h-5 w-5" />} change={0} accent="rose" />
        <StatCard title="Fuel Cost" value={formatNumber(totalFuelCost)} icon={<Fuel className="h-5 w-5" />} change={0} accent="amber" />
        <StatCard title="Maintenance Cost" value={formatNumber(totalMaintenanceCost)} icon={<TrendingDown className="h-5 w-5" />} change={0} accent="indigo" />
        <StatCard title="Avg Fuel / Vehicle" value={formatNumber2(avgFuelPerVehicle)} icon={<Fuel className="h-5 w-5" />} accent="sky" />
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => setTab('expenses')} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${tab === 'expenses' ? 'bg-sky-50 text-sky-700' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>Expenses</button>
        <button onClick={() => setTab('fuel')} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${tab === 'fuel' ? 'bg-sky-50 text-sky-700' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>Fuel Records</button>
      </div>

      {tab === 'expenses' && (
        <div className="flex items-center gap-2">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:outline-none">
            {['All', 'Maintenance', 'Tolls', 'Insurance', 'Salaries', 'Other'].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      )}

      {tab === 'expenses' ? (
        <Card title="Expenses" subtitle={`${filteredExpenses.length} records`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-5 py-3 font-semibold text-slate-600">Date</th>
                  <th className="px-5 py-3 font-semibold text-slate-600">Category</th>
                  <th className="px-5 py-3 font-semibold text-slate-600">Description</th>
                  <th className="px-5 py-3 font-semibold text-slate-600">Vehicle</th>
                  <th className="px-5 py-3 font-semibold text-slate-600 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 text-slate-600">{formatDate(e.date)}</td>
                    <td className="px-5 py-3.5"><Badge status={e.category} /></td>
                    <td className="px-5 py-3.5 text-slate-600">{e.description}</td>
                    <td className="px-5 py-3.5 text-slate-600">{vehiclePlate(e.vehicleId)}</td>
                    <td className="px-5 py-3.5 text-right font-medium text-slate-800">{formatNumber(e.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card title="Fuel Records" subtitle={`${fuelRecords.length} refuels`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-5 py-3 font-semibold text-slate-600">Date</th>
                  <th className="px-5 py-3 font-semibold text-slate-600">Vehicle</th>
                  <th className="px-5 py-3 font-semibold text-slate-600">Liters</th>
                  <th className="px-5 py-3 font-semibold text-slate-600">Cost / Liter</th>
                  <th className="px-5 py-3 font-semibold text-slate-600">Total Cost</th>
                  <th className="px-5 py-3 font-semibold text-slate-600">Odometer</th>
                  <th className="px-5 py-3 font-semibold text-slate-600">Station</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fuelRecords.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 text-slate-600">{formatDate(f.date)}</td>
                    <td className="px-5 py-3.5 text-slate-600">{vehiclePlate(f.vehicleId)}</td>
                    <td className="px-5 py-3.5 text-slate-600">{f.liters} L</td>
                    <td className="px-5 py-3.5 text-slate-600">{formatNumber2(f.costPerLiter)}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{formatNumber2(f.totalCost)}</td>
                    <td className="px-5 py-3.5 text-slate-600">{formatNumber(f.odometerKm)} km</td>
                    <td className="px-5 py-3.5 text-slate-600">{f.station}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={addOpen} onClose={() => { setAddOpen(false); resetForm(); }} title="Add Expense" size="lg"
        footer={<><Button variant="ghost" onClick={() => { setAddOpen(false); resetForm(); }}>Cancel</Button><Button onClick={handleCreate} disabled={submitting || !formCategory || !formAmount}>{submitting ? 'Adding...' : 'Add Expense'}</Button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date" type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
              <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as ExpenseCategory)} className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40">
                {(['Fuel', 'Maintenance', 'Tolls', 'Insurance', 'Salaries', 'Other'] as ExpenseCategory[]).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <Input label="Description" placeholder="Diesel refill - V-001" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Vehicle</label>
              <select value={formVehicleId} onChange={(e) => setFormVehicleId(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40">
                <option value="">None</option>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.plate}</option>)}
              </select>
            </div>
            <Input label="Amount" type="number" placeholder="640" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
