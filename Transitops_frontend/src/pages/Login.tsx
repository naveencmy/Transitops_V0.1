import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Truck as TruckIcon } from 'lucide-react';
import { authService } from '../services/authService';
import { Button, Input } from '../components/ui';
import type { Role } from '../types';

const demoAccounts: { role: Role; email: string; label: string; password: string }[] = [
  { role: 'Admin', email: 'admin@fleetco.com', label: 'Admin', password: 'admin123' },
  { role: 'Fleet Manager', email: 'fleet@fleetco.com', label: 'Fleet Manager', password: 'fleet123' },
  { role: 'Dispatcher', email: 'dispatch@fleetco.com', label: 'Dispatcher', password: 'dispatch123' },
  { role: 'Safety Officer', email: 'safety@fleetco.com', label: 'Safety Officer', password: 'safety123' },
  { role: 'Financial Analyst', email: 'finance@fleetco.com', label: 'Financial Analyst', password: 'finance123' },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@fleetco.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<Role>('Admin');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const pickAccount = (acc: typeof demoAccounts[number]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setActiveRole(acc.role);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Website Name only — no welcome text, taglines, or descriptions */}
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-600 text-white">
              <TruckIcon className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Transport Management System</h1>
          </div>

          {/* Role-Based Demo Accounts — directly below the title, above the form */}
          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Role-Based Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => pickAccount(acc)}
                  className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition ${
                    activeRole === acc.role
                      ? 'border-sky-300 bg-sky-50 text-sky-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">Password: {demoAccounts.find(a => a.role === activeRole)?.password}</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
            <Input
              label="Password"
              type="password"
              icon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">{error}</div>
            )}

            <Button type="submit" size="lg" loading={loading} className="w-full">
              Sign in
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
