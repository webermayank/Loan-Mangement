'use client';

import useSWR from 'swr';
import { DashboardShell } from '@/components/dashboard-shell';
import { OpsTable } from '@/components/ops-table';
import { AppCard } from '@/components/app-card';
import { RoleBadge } from '@/components/status-badge';
import { api } from '@/lib/api';
import type { LoanApplication, User } from '@/lib/types';

const appFetcher = (path: string) => api<{ applications: LoanApplication[] }>(path).then((data) => data.applications);
const userFetcher = (path: string) => api<{ users: User[] }>(path).then((data) => data.users);

export default function AdminPage() {
  const { data: applications = [], isLoading: appsLoading } = useSWR('/ops/admin/applications', appFetcher);
  const { data: users = [] } = useSWR('/ops/admin/users', userFetcher);

  return (
    <DashboardShell roles={['admin']}>
      <AppCard className="mb-5">
        <p className="text-sm font-bold text-brand-600">Full control view</p>
        <h1 className="mt-1 text-3xl font-black text-ink">Admin dashboard</h1>
        <p className="mt-2 text-sm leading-6 text-muted">Monitor every module, user, and loan state from one place.</p>
      </AppCard>
      <div className="mb-5 grid gap-4 md:grid-cols-4">
        {['lead', 'applied', 'sanctioned', 'disbursed'].map((status) => (
          <AppCard key={status}>
            <p className="text-xs font-bold uppercase text-muted">{status}</p>
            <p className="mt-2 text-3xl font-black text-ink">{applications.filter((app) => app.status === status).length}</p>
          </AppCard>
        ))}
      </div>
      {appsLoading ? <p className="text-sm text-muted">Loading applications...</p> : <OpsTable applications={applications} />}
      <AppCard className="mt-5">
        <h2 className="text-xl font-black text-ink">Seeded users</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {users.map((user) => (
            <div key={user._id || user.id} className="flex items-center justify-between rounded-xl border border-line bg-paper p-4">
              <div>
                <p className="font-bold text-ink">{user.name}</p>
                <p className="text-sm text-muted">{user.email}</p>
              </div>
              <RoleBadge role={user.role} />
            </div>
          ))}
        </div>
      </AppCard>
    </DashboardShell>
  );
}
