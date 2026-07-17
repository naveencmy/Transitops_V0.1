/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'bg-sky-50', 'text-sky-600', 'bg-sky-100', 'text-sky-700', 'ring-sky-300',
    'bg-emerald-50', 'text-emerald-600', 'bg-emerald-100', 'text-emerald-700', 'ring-emerald-300',
    'bg-amber-50', 'text-amber-600', 'bg-amber-100', 'text-amber-700', 'ring-amber-300',
    'bg-rose-50', 'text-rose-600', 'bg-rose-100', 'text-rose-700', 'ring-rose-300',
    'bg-indigo-50', 'text-indigo-600', 'bg-indigo-100', 'text-indigo-700', 'ring-indigo-300',
    'bg-slate-50', 'text-slate-600', 'bg-slate-100', 'text-slate-700', 'ring-slate-300',
  ],
  theme: { extend: {} },
  plugins: [],
};
