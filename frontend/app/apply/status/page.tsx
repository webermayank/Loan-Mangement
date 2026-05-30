'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { CheckCircle2 } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';
import { AppCard } from '@/components/app-card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badge';
import { api } from '@/lib/api';
import { compactDate, money } from '@/lib/format';
import type { LoanApplication, LoanStatus } from '@/lib/types';

const fetcher = (path: string) => api<{ application: LoanApplication | null }>(path).then((data) => data.application);
const order: LoanStatus[] = ['lead', 'applied', 'sanctioned', 'disbursed', 'closed'];

export default function StatusPage() {
  const { data: application, isLoading } = useSWR('/borrower/application', fetcher);
  const activeIndex = application ? order.indexOf(application.status) : -1;

  return (
    <AuthGuard roles={['borrower']}>
      <main className="min-h-screen px-6 py-6">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8 flex items-center justify-between">
            <Link href="/" className="text-lg font-black text-ink">LoanOS</Link>
            <Link href="/apply/personal"><Button variant="secondary">New application</Button></Link>
          </header>
          <AppCard>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-ink">Application status</h1>
                <p className="mt-2 text-sm text-muted">Track your loan through the operations lifecycle.</p>
              </div>
              {application ? <StatusBadge status={application.status} /> : null}
            </div>
            {isLoading ? <p className="mt-8 text-sm text-muted">Loading status...</p> : null}
            {!application && !isLoading ? (
              <div className="mt-8 rounded-2xl border border-line bg-paper p-6 text-center">
                <p className="font-bold text-ink">No active application yet</p>
                <p className="mt-2 text-sm text-muted">Start the guided flow to create your loan request.</p>
                <Link className="mt-5 inline-flex" href="/apply/personal"><Button>Start application</Button></Link>
              </div>
            ) : null}
            {application ? (
              <>
                <div className="mt-8 grid gap-3 sm:grid-cols-5">
                  {order.map((status, index) => (
                    <div key={status} className="rounded-xl border border-line bg-paper p-4">
                      <CheckCircle2 className={`mb-3 h-5 w-5 ${index <= activeIndex ? 'text-mint' : 'text-slate-300'}`} />
                      <p className="text-sm font-bold capitalize text-ink">{status}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <Metric label="Applied on" value={compactDate(application.createdAt)} />
                  <Metric label="Loan amount" value={money(application.loanConfig?.amount || 0)} />
                  <Metric label="Repayment" value={money(application.loanConfig?.totalRepayment || 0)} />
                </div>
                {application.rejectionReason ? <p className="mt-5 rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose">{application.rejectionReason}</p> : null}
              </>
            ) : null}
          </AppCard>
        </div>
      </main>
    </AuthGuard>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className="mt-1 font-black text-ink">{value}</p>
    </div>
  );
}
