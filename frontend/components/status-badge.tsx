import { clsx } from 'clsx';
import type { LoanStatus, Role } from '@/lib/types';

const statusStyles: Record<LoanStatus, string> = {
  lead: 'bg-slate-100 text-slate-700 border-slate-200',
  applied: 'bg-brand-50 text-brand-700 border-brand-100',
  sanctioned: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  disbursed: 'bg-amber-50 text-amber-700 border-amber-100',
  closed: 'bg-teal-50 text-teal-700 border-teal-100',
  rejected: 'bg-rose-50 text-rose-700 border-rose-100',
};

const roleStyles: Record<Role, string> = {
  borrower: 'bg-slate-100 text-slate-700 border-slate-200',
  sales: 'bg-blue-50 text-blue-700 border-blue-100',
  sanction: 'bg-violet-50 text-violet-700 border-violet-100',
  disbursement: 'bg-amber-50 text-amber-700 border-amber-100',
  collection: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  admin: 'bg-ink text-white border-ink',
};

export function StatusBadge({ status }: { status: LoanStatus }) {
  return <span className={clsx('rounded-full border px-2.5 py-1 text-xs font-bold capitalize', statusStyles[status])}>{status}</span>;
}

export function RoleBadge({ role }: { role: Role }) {
  return <span className={clsx('rounded-full border px-2.5 py-1 text-xs font-bold capitalize', roleStyles[role])}>{role}</span>;
}
