'use client';

import useSWR from 'swr';
import { DashboardShell } from '@/components/dashboard-shell';
import { OpsTable } from '@/components/ops-table';
import { AppCard } from '@/components/app-card';
import { api } from '@/lib/api';
import type { LoanApplication } from '@/lib/types';

const fetcher = (path: string) => api<{ applications: LoanApplication[] }>(path).then((data) => data.applications);

export default function SalesPage() {
  const { data = [], isLoading } = useSWR('/ops/leads', fetcher);
  return (
    <DashboardShell roles={['sales', 'admin']}>
      <Header title="Sales leads" body="Review borrower leads and applied applications entering the funnel." count={data.length} />
      {isLoading ? <p className="text-sm text-muted">Loading leads...</p> : <OpsTable applications={data} />}
    </DashboardShell>
  );
}

function Header({ title, body, count }: { title: string; body: string; count: number }) {
  return (
    <AppCard className="mb-5">
      <p className="text-sm font-bold text-brand-600">{count} records</p>
      <h1 className="mt-1 text-3xl font-black text-ink">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
    </AppCard>
  );
}
