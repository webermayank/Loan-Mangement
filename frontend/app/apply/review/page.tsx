'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { ApplyShell } from '@/components/apply-shell';
import { AppCard } from '@/components/app-card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badge';
import { api } from '@/lib/api';
import { money } from '@/lib/format';
import type { LoanApplication } from '@/lib/types';
import { useToast } from '@/components/ui/toast';

const fetcher = (path: string) => api<{ application: LoanApplication | null }>(path).then((data) => data.application);

export default function ReviewPage() {
  const { data: application, isLoading } = useSWR('/borrower/application', fetcher);
  const { showToast } = useToast();
  const router = useRouter();

  async function submit() {
    try {
      await api('/borrower/apply', { method: 'POST' });
      showToast('Application submitted');
      router.push('/apply/status');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not submit application', 'error');
    }
  }

  return (
    <ApplyShell active={3}>
      <AppCard className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-ink">Review application</h1>
            <p className="mt-2 text-sm text-muted">Confirm the details before submitting to operations.</p>
          </div>
          {application ? <StatusBadge status={application.status} /> : null}
        </div>
        {isLoading ? <p className="mt-8 text-sm text-muted">Loading application...</p> : null}
        {application ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Summary label="Applicant" value={application.personalDetails?.fullName} />
            <Summary label="PAN" value={application.personalDetails?.pan} />
            <Summary label="Salary" value={money(application.personalDetails?.monthlySalary || 0)} />
            <Summary label="Employment" value={application.personalDetails?.employmentMode} />
            <Summary label="Amount" value={money(application.loanConfig?.amount || 0)} />
            <Summary label="Total repayment" value={money(application.loanConfig?.totalRepayment || 0)} />
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted">No application found. <Link className="font-bold text-brand-700" href="/apply/personal">Start again</Link></p>
        )}
        <div className="mt-7 flex justify-end">
          <Button disabled={!application?.loanConfig} onClick={submit}>Submit application</Button>
        </div>
      </AppCard>
    </ApplyShell>
  );
}

function Summary({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="rounded-xl border border-line bg-paper p-4">
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className="mt-1 font-bold capitalize text-ink">{value || '-'}</p>
    </div>
  );
}
