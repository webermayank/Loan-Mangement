'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Plus } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { OpsTable } from '@/components/ops-table';
import { AppCard } from '@/components/app-card';
import { Button } from '@/components/ui/button';
import { Field, inputClass } from '@/components/ui/field';
import { api } from '@/lib/api';
import { money } from '@/lib/format';
import type { LoanApplication } from '@/lib/types';
import { useToast } from '@/components/ui/toast';

const fetcher = (path: string) => api<{ applications: LoanApplication[] }>(path).then((data) => data.applications);

export default function CollectionPage() {
  const { data = [], mutate, isLoading } = useSWR('/ops/collection', fetcher);
  const [selected, setSelected] = useState<LoanApplication | null>(null);

  return (
    <DashboardShell roles={['collection', 'admin']}>
      <Header title="Collection" body="Record payments with unique UTR and close loans when repayment is complete." count={data.length} />
      {isLoading ? <p className="text-sm text-muted">Loading collection queue...</p> : (
        <OpsTable applications={data} action={(app) => <Button className="h-9 px-3" disabled={app.status === 'closed'} onClick={() => setSelected(app)}><Plus className="h-4 w-4" /> Payment</Button>} />
      )}
      <PaymentPanel application={selected} onClose={() => setSelected(null)} onSaved={() => { setSelected(null); mutate(); }} />
    </DashboardShell>
  );
}

function PaymentPanel({ application, onClose, onSaved }: { application: LoanApplication | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ utr: '', amount: '', date: new Date().toISOString().slice(0, 10) });
  const { showToast } = useToast();
  if (!application) return null;
  const paid = application.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const due = Math.max((application.loanConfig?.totalRepayment || 0) - paid, 0);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    try {
      await api(`/ops/collection/${application!._id}/payment`, {
        method: 'POST',
        body: JSON.stringify({ utr: form.utr, amount: Number(form.amount), date: form.date }),
      });
      showToast('Payment recorded');
      onSaved();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Payment failed', 'error');
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/35 p-4">
      <form onSubmit={save} className="w-full max-w-lg rounded-2xl border border-line bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black text-ink">Record payment</h2>
        <p className="mt-2 text-sm text-muted">Outstanding amount: <strong className="text-ink">{money(due)}</strong></p>
        <div className="mt-5 grid gap-4">
          <Field label="UTR"><input required className={inputClass} value={form.utr} onChange={(e) => setForm({ ...form, utr: e.target.value })} /></Field>
          <Field label="Amount"><input required className={inputClass} type="number" min={1} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></Field>
          <Field label="Date"><input required className={inputClass} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save payment</Button>
        </div>
      </form>
    </div>
  );
}

function Header({ title, body, count }: { title: string; body: string; count: number }) {
  return <AppCard className="mb-5"><p className="text-sm font-bold text-brand-600">{count} records</p><h1 className="mt-1 text-3xl font-black text-ink">{title}</h1><p className="mt-2 text-sm leading-6 text-muted">{body}</p></AppCard>;
}
