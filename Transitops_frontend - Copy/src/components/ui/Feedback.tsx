import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        {label && <p className="text-sm">{label}</p>}
      </div>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{message}</div>
    </div>
  );
}

export function EmptyState({ title, hint, icon }: { title: string; hint?: string; icon?: ReactNode }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-2 text-slate-400">
      {icon && <div className="text-slate-300">{icon}</div>}
      <p className="text-sm font-medium text-slate-500">{title}</p>
      {hint && <p className="text-xs">{hint}</p>}
    </div>
  );
}
