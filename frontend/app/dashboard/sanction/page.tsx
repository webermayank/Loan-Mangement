'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Check, X } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { OpsTable } from '@/components/ops-table';
import { AppCard } from '@/components/app-card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import type { LoanApplication } from '@/lib/types';
import { useToast } from '@/components/ui/toast';

const fetcher = (path: string) => api<{ applications: LoanApplication[] }>(path).then((data) => data.applications);

export default function SanctionPage() {
  const { data = [], mutate, isLoading } = useSWR('/ops/sanction', fetcher);
  const [busy, setBusy] = useState<string | null>(null);
  const { showToast } = useToast();

  async function decide(id: string, action: 'approve' | 'reject') {
    setBusy(id + action);
    try {
      await api(`/ops/sanction/${id}`, { method: 'PATCH', body: JSON.stringify({ action, reason: 'Rejected by sanction team' }) });
      showToast(action === 'approve' ? 'Loan sanctioned' : 'Loan rejected');
      mutate();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Action failed', 'error');
    } finally {
      setBusy(null);
    }
  }

  return (
    <DashboardShell roles={['sanction', 'admin']}>
      <Header title="Sanction queue" body="Approve or reject applications that have completed borrower submission." count={data.length} />
      {isLoading ? <p className="text-sm text-muted">Loading queue...</p> : (
        <OpsTable
          applications={data}
          action={(app) => (
            <div className="flex gap-2">
              <Button className="h-9 px-3" disabled={busy !== null} onClick={() => decide(app._id, 'approve')}><Check className="h-4 w-4" /></Button>
              <Button className="h-9 px-3" variant="danger" disabled={busy !== null} onClick={() => decide(app._id, 'reject')}><X className="h-4 w-4" /></Button>
            </div>
          )}
        />
      )}
    </DashboardShell>
  );
}

function Header({ title, body, count }: { title: string; body: string; count: number }) {
  return <AppCard className="mb-5"><p className="text-sm font-bold text-brand-600">{count} records</p><h1 className="mt-1 text-3xl font-black text-ink">{title}</h1><p className="mt-2 text-sm leading-6 text-muted">{body}</p></AppCard>;
}
