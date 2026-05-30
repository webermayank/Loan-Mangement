'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Field, inputClass } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      showToast('Account created');
      router.push('/apply/personal');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Registration failed', 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-6 py-10">
      <form onSubmit={onSubmit} className="glass-panel w-full max-w-md rounded-3xl p-6">
        <Link href="/" className="text-lg font-black text-ink">LoanOS</Link>
        <h1 className="mt-8 text-3xl font-black text-ink">Create borrower account</h1>
        <p className="mt-2 text-sm leading-6 text-muted">Sign up, complete eligibility, upload documents, and submit your loan.</p>
        <div className="mt-6 grid gap-4">
          <Field label="Full name"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Email"><input className={inputClass} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Password"><input className={inputClass} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
          <Button disabled={busy} className="w-full"><UserPlus className="h-4 w-4" /> Create and continue</Button>
        </div>
        <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link className="font-bold text-brand-700" href="/login">Login</Link></p>
      </form>
    </main>
  );
}
