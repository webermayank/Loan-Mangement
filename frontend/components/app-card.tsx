import { clsx } from 'clsx';

export function AppCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={clsx('rounded-2xl border border-line bg-white p-5 shadow-card', className)}>{children}</section>;
}
