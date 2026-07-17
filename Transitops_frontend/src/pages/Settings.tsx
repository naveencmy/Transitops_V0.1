import { useState, useEffect } from 'react';
import { User, Bell, Shield, Building2, Save, Users as UsersIcon, Plus, Pencil, Trash2, X } from 'lucide-react';
import { PageHeader, Card, Button, Input, Badge } from '../components/ui';
import { authService, userService } from '../services/authService';
import { ALL_ROLES } from '../config/permissions';
import type { AppUser, Role } from '../types';

type Tab = 'profile' | 'company' | 'notifications' | 'security' | 'users';

const tabs: { id: Tab; label: string; icon: typeof User; adminOnly?: boolean }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'users', label: 'Users & Roles', icon: UsersIcon, adminOnly: true },
];

export default function Settings() {
  const user = authService.getCurrentUser();
  const isAdmin = user?.role === 'Admin';
  const [tab, setTab] = useState<Tab>('profile');
  const visibleTabs = tabs.filter((t) => !t.adminOnly || isAdmin);

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <nav className="space-y-1">
          {visibleTabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${tab === t.id ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-100'}`}>
              <t.icon className="h-4 w-4" />{t.label}
            </button>
          ))}
        </nav>
        <div className="lg:col-span-3">
          {tab === 'profile' && <ProfileTab name={user?.name} email={user?.email} role={user?.role} />}
          {tab === 'company' && <CompanyTab />}
          {tab === 'notifications' && <NotificationsTab />}
          {tab === 'security' && <SecurityTab />}
          {tab === 'users' && isAdmin && <UsersTab />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ name, email, role }: { name?: string; email?: string; role?: string }) {
  return (
    <Card title="Profile Information">
      <div className="space-y-5 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-600 text-xl font-semibold text-white">{name?.charAt(0) ?? 'A'}</div>
          <div><Button variant="outline" size="sm">Change Photo</Button><p className="mt-1.5 text-xs text-slate-400">JPG, PNG or GIF. Max 2MB.</p></div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Full Name" defaultValue={name ?? 'Alex Morgan'} />
          <Input label="Email" type="email" defaultValue={email ?? 'admin@fleetco.com'} />
          <Input label="Phone" defaultValue="+1 713-555-0100" />
          <Input label="Role" defaultValue={role ?? 'Fleet Administrator'} disabled />
        </div>
        <div className="flex justify-end"><Button><Save className="h-4 w-4" /> Save Changes</Button></div>
      </div>
    </Card>
  );
}

function CompanyTab() {
  return (
    <Card title="Company Details">
      <div className="space-y-5 p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Company Name" defaultValue="FleetCo Logistics" />
          <Input label="Industry" defaultValue="Transportation" />
          <Input label="Website" defaultValue="https://fleetco.com" />
          <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Currency</label><select className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40"><option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option></select></div>
          <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Timezone</label><select className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40"><option>America/Chicago (CST)</option><option>America/New_York (EST)</option><option>America/Los_Angeles (PST)</option></select></div>
          <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Units</label><select className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40"><option>Metric (km, kg, L)</option><option>Imperial (mi, lb, gal)</option></select></div>
        </div>
        <div className="flex justify-end"><Button><Save className="h-4 w-4" /> Save Company</Button></div>
      </div>
    </Card>
  );
}

function NotificationsTab() {
  return (
    <Card title="Notification Preferences">
      <div className="divide-y divide-slate-100">
        {[
          { title: 'Trip updates', desc: 'Get notified when trips start, complete, or are delayed', on: true },
          { title: 'Maintenance alerts', desc: 'Receive alerts for scheduled and overdue maintenance', on: true },
          { title: 'Fuel threshold', desc: 'Alert when vehicle fuel drops below 25%', on: true },
          { title: 'Weekly reports', desc: 'Email summary of fleet performance every Monday', on: false },
          { title: 'Driver status changes', desc: 'Notify when drivers go on or off duty', on: false },
        ].map((n) => (
          <div key={n.title} className="flex items-center justify-between p-5">
            <div><p className="text-sm font-medium text-slate-800">{n.title}</p><p className="text-xs text-slate-500">{n.desc}</p></div>
            <Toggle defaultOn={n.on} />
          </div>
        ))}
      </div>
    </Card>
  );
}

function SecurityTab() {
  return (
    <Card title="Security">
      <div className="space-y-5 p-5">
        <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
          <div><p className="text-sm font-medium text-slate-800">Two-Factor Authentication</p><p className="text-xs text-slate-500">Add an extra layer of security to your account</p></div>
          <Badge status="Active" />
        </div>
        <Input label="Current Password" type="password" placeholder="••••••••" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Input label="New Password" type="password" placeholder="••••••••" /><Input label="Confirm Password" type="password" placeholder="••••••••" /></div>
        <div className="flex justify-end"><Button><Shield className="h-4 w-4" /> Update Password</Button></div>
      </div>
    </Card>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<Role>('Dispatcher');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<Role>('Dispatcher');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const loadedUsers = await userService.getUsers();
      setUsers(loadedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const openEdit = (u: AppUser) => { setEditing(u); setEditName(u.name); setEditRole(u.role); };
  const saveEdit = async () => { if (!editing) return; await userService.updateUserName(editing.id, editName); await userService.updateUserRole(editing.id, editRole); await loadUsers(); setEditing(null); };
  const confirmDelete = async () => { if (!deleteId) return; await userService.deleteUser(deleteId); await loadUsers(); setDeleteId(null); };
  const handleAdd = async () => { if (!newName || !newEmail) return; await userService.addUser(newName, newEmail, newRole); await loadUsers(); setNewName(''); setNewEmail(''); setNewRole('Dispatcher'); setAddOpen(false); };

  if (users.length === 0) {
    return <div className="p-6 text-center text-slate-500">Loading users...</div>;
  }

  return (
    <Card title="User & Role Management" action={<Button size="sm" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Add User</Button>}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-slate-100 bg-slate-50/60">
            <th className="px-5 py-3 font-semibold text-slate-600">Name</th>
            <th className="px-5 py-3 font-semibold text-slate-600">Email</th>
            <th className="px-5 py-3 font-semibold text-slate-600">Role</th>
            <th className="px-5 py-3 font-semibold text-slate-600 text-right">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/70">
                <td className="px-5 py-3.5 font-medium text-slate-800">{u.name}</td>
                <td className="px-5 py-3.5 text-slate-600">{u.email}</td>
                <td className="px-5 py-3.5"><span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">{u.role}</span></td>
                <td className="px-5 py-3.5"><div className="flex justify-end gap-1.5">
                  <button onClick={() => openEdit(u)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-sky-600"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteId(u.id)} className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative z-10 w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold text-slate-900">Edit User</h3><button onClick={() => setEditing(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
            <div className="space-y-4">
              <Input label="Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
              <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Role</label><select value={editRole} onChange={(e) => setEditRole(e.target.value as Role)} className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40">{ALL_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
            </div>
            <div className="mt-6 flex justify-end gap-2"><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={saveEdit}><Save className="h-4 w-4" /> Save Changes</Button></div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete User?</h3>
            <p className="mt-2 text-sm text-slate-500">This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-2"><Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button><Button variant="danger" onClick={confirmDelete}><Trash2 className="h-4 w-4" /> Delete</Button></div>
          </div>
        </div>
      )}

      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setAddOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold text-slate-900">Add New User</h3><button onClick={() => setAddOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
            <div className="space-y-4">
              <Input label="Full Name" placeholder="e.g. John Doe" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <Input label="Email" type="email" placeholder="john@fleetco.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Role</label><select value={newRole} onChange={(e) => setNewRole(e.target.value as Role)} className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40">{ALL_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
            </div>
            <div className="mt-6 flex justify-end gap-2"><Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={handleAdd}><Plus className="h-4 w-4" /> Add User</Button></div>
          </div>
        </div>
      )}
    </Card>
  );
}

function Toggle({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return <button onClick={() => setOn((o) => !o)} className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-sky-600' : 'bg-slate-300'}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} /></button>;
}
