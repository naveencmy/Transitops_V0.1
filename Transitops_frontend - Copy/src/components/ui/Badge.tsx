interface StatusConfig {
  [key: string]: { bg: string; text: string; dot: string };
}

const config: StatusConfig = {
  Active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Available: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Idle: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  Maintenance: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
  Offline: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  'On Trip': { bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500' },
  'Off Duty': { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  'On Leave': { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500' },
  Scheduled: { bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500' },
  'In Progress': { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  Completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Cancelled: { bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400' },
  Delayed: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  Overdue: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
  Dispatched: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  Compliant: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Expiring Soon': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  Expired: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
  'Pending Review': { bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500' },
};

export default function Badge({ status }: { status: string }) {
  const c = config[status] ?? { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}
