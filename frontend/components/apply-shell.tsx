import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';
import { Stepper } from '@/components/stepper';

const steps = ['Personal', 'Documents', 'Loan', 'Review'];

export function ApplyShell({ active, children }: { active: number; children: React.ReactNode }) {
  return (
    <AuthGuard roles={['borrower']}>
      <main className="min-h-screen px-6 py-6">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="text-lg font-black text-ink">LoanOS</Link>
            <nav className="flex items-center gap-2 text-sm font-bold text-muted">
              <Link className="rounded-lg px-3 py-2 hover:bg-white hover:text-brand-700" href="/apply/status">Status</Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-white hover:text-brand-700" href="/login"><LogOut className="h-4 w-4" /></Link>
            </nav>
          </header>
          <Stepper steps={steps} active={active} />
          <div className="mt-6">{children}</div>
        </div>
      </main>
    </AuthGuard>
  );
}
