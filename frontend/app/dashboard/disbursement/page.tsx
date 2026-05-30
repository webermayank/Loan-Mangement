'use client';

import useSWR from 'swr';
import { Send } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { OpsTable } from '@/components/ops-table';
import { AppCard } from '@/components/app-card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import type { LoanApplication } from '@/lib/types';
import { useToast } from '@/components/ui/toast';

const fetcher = (path: string) => api<{ applications: LoanApplication[] }>(path).then((data) => data.applications);

export default function DisbursementPage() {
  const { data = [], mutate, isLoading } = useSWR('/ops/disbursement', fetcher);
  const { showToast } = useToast();

  async function disburse(id: string) {
    try {
      await api(`/ops/disbursement/${id}/disburse`, { method: 'PATCH' });
      showToast('Loan marked disbursed');
      mutate();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Disbursement failed', 'error');
    }
  }

  return (
    <DashboardShell roles={['disbursement', 'admin']}>
      <Header title="Disbursement" body="Move sanctioned loans into the collection-ready disbursed state." count={data.length} />
      {isLoading ? <p className="text-sm text-muted">Loading queue...</p> : (
        <OpsTable applications={data} action={(app) => <Button className="h-9 px-3" onClick={() => disburse(app._id)}><Send className="h-4 w-4" /> Disburse</Button>} />
      )}
    </DashboardShell>
  );
}

function Header({ title, body, count }: { title: string; body: string; count: number }) {
  return <AppCard className="mb-5"><p className="text-sm font-bold text-brand-600">{count} records</p><h1 className="mt-1 text-3xl font-black text-ink">{title}</h1><p className="mt-2 text-sm leading-6 text-muted">{body}</p></AppCard>;
}
