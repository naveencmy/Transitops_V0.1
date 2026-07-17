import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change?: number;
  changeLabel?: string;
  accent?: string;
}

export default function StatCard({ title, value, icon, change, changeLabel, accent = 'sky' }: StatCardProps) {
  const positive = (change ?? 0) >= 0;
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md hover:shadow-slate-200/60">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg bg-${accent}-50 text-${accent}-600`}>
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-4 flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-slate-400">{changeLabel ?? 'vs last month'}</span>
        </div>
      )}
    </div>
  );
}
