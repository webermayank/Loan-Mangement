'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { StatusBadge } from '@/components/status-badge';
import { inputClass } from '@/components/ui/field';
import { compactDate, money } from '@/lib/format';
import type { LoanApplication } from '@/lib/types';

export function OpsTable({
  applications,
  action,
}: {
  applications: LoanApplication[];
  action?: (application: LoanApplication) => React.ReactNode;
}) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return applications.filter((app) => {
      const user = typeof app.userId === 'object' ? app.userId : null;
      return [app.personalDetails?.fullName, app.personalDetails?.pan, user?.email, app.status].filter(Boolean).join(' ').toLowerCase().includes(needle);
    });
  }, [applications, query]);

  if (!applications.length) return <EmptyState title="Nothing here yet" body="This queue is clear. New applications will appear here when they reach this lifecycle stage." />;

  return (
    <div className="rounded-2xl border border-line bg-white shadow-card">
      <div className="flex items-center gap-3 border-b border-line p-4">
        <Search className="h-4 w-4 text-muted" />
        <input className={`${inputClass} border-0 bg-paper focus:ring-0`} placeholder="Filter by name, PAN, email or status" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-paper text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Applicant</th>
              <th className="px-4 py-3">PAN</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Repayment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              {action ? <th className="px-4 py-3">Action</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((app) => (
              <tr key={app._id} className="bg-white">
                <td className="px-4 py-4">
                  <p className="font-bold text-ink">{app.personalDetails?.fullName || (typeof app.userId === 'object' ? app.userId.name : '-')}</p>
                  <p className="text-xs text-muted">{typeof app.userId === 'object' ? app.userId.email : ''}</p>
                </td>
                <td className="px-4 py-4 font-semibold text-muted">{app.personalDetails?.pan || '-'}</td>
                <td className="px-4 py-4 font-semibold text-ink">{money(app.loanConfig?.amount || 0)}</td>
                <td className="px-4 py-4 font-semibold text-ink">{money(app.loanConfig?.totalRepayment || 0)}</td>
                <td className="px-4 py-4"><StatusBadge status={app.status} /></td>
                <td className="px-4 py-4 text-muted">{compactDate(app.createdAt)}</td>
                {action ? <td className="px-4 py-4">{action(app)}</td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
