'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { roleHome, useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Field, inputClass } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';

const demoAccounts = [
  ['Borrower', 'borrower@lms.com'],
  ['Sales', 'sales@lms.com'],
  ['Sanction', 'sanction@lms.com'],
  ['Disbursement', 'disburse@lms.com'],
  ['Collection', 'collection@lms.com'],
  ['Admin', 'admin@lms.com'],
];

export default function LoginPage() {
  const [email, setEmail] = useState('borrower@lms.com');
  const [password, setPassword] = useState('Password@123');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const user = await login(email, password);
      showToast(`Welcome, ${user.name}`);
      router.push(roleHome[user.role]);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Login failed', 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-6 py-10">
      <form onSubmit={onSubmit} className="glass-panel w-full max-w-md rounded-3xl p-6">
        <Link href="/" className="text-lg font-black text-ink">LoanOS</Link>
        <h1 className="mt-8 text-3xl font-black text-ink">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-muted">Use seeded accounts to review every role quickly.</p>
        <div className="mt-6 grid gap-4">
          <Field label="Email"><input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Field label="Password"><input className={inputClass} type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
          <Button disabled={busy} className="w-full"><LogIn className="h-4 w-4" /> Login</Button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2">
          {demoAccounts.map(([label, value]) => (
            <button
              type="button"
              key={value}
              onClick={() => setEmail(value)}
              className="rounded-lg border border-line bg-white px-3 py-2 text-left text-xs font-bold text-muted transition hover:border-brand-100 hover:bg-brand-50 hover:text-brand-700"
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted">New borrower? <Link className="font-bold text-brand-700" href="/register">Create account</Link></p>
      </form>
    </main>
  );
}
