'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ApplyShell } from '@/components/apply-shell';
import { AppCard } from '@/components/app-card';
import { Button } from '@/components/ui/button';
import { Field, inputClass } from '@/components/ui/field';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/toast';

export default function PersonalPage() {
  const [form, setForm] = useState({
    fullName: '',
    pan: '',
    dob: '',
    monthlySalary: 45000,
    employmentMode: 'salaried',
  });
  const [bre, setBre] = useState<{ eligible: boolean; reasons: string[] } | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const data = await api<{ breResult: { eligible: boolean; reasons: string[] } }>('/borrower/personal-details', {
        method: 'POST',
        body: JSON.stringify({ ...form, monthlySalary: Number(form.monthlySalary), pan: form.pan.toUpperCase() }),
      });
      setBre(data.breResult);
      if (data.breResult.eligible) {
        showToast('Eligibility verified');
        router.push('/apply/documents');
      } else {
        showToast('BRE rejected this profile', 'error');
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not save details', 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ApplyShell active={0}>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.78fr]">
        <AppCard>
          <h1 className="text-2xl font-black text-ink">Personal details</h1>
          <p className="mt-2 text-sm leading-6 text-muted">These details run through the server-side Business Rule Engine.</p>
          <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Full name"><input required className={inputClass} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></Field>
            <Field label="PAN"><input required className={inputClass} value={form.pan} maxLength={10} onChange={(e) => setForm({ ...form, pan: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" /></Field>
            <Field label="Date of birth"><input required className={inputClass} type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} /></Field>
            <Field label="Monthly salary"><input required className={inputClass} type="number" value={form.monthlySalary} onChange={(e) => setForm({ ...form, monthlySalary: Number(e.target.value) })} /></Field>
            <Field label="Employment mode">
              <select className={inputClass} value={form.employmentMode} onChange={(e) => setForm({ ...form, employmentMode: e.target.value })}>
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </Field>
            <div className="flex items-end"><Button disabled={busy} className="w-full">Run eligibility</Button></div>
          </form>
        </AppCard>
        <AppCard>
          <h2 className="text-lg font-black text-ink">BRE rules</h2>
          <div className="mt-4 grid gap-3 text-sm font-medium text-muted">
            {['Age between 23 and 50', 'Salary at least INR 25,000/month', 'Valid PAN format', 'Applicant is not unemployed'].map((rule) => (
              <div key={rule} className="rounded-xl border border-line bg-paper p-3">{rule}</div>
            ))}
          </div>
          {bre ? (
            <div className={`mt-5 rounded-xl border p-4 ${bre.eligible ? 'border-emerald-100 bg-emerald-50' : 'border-rose-100 bg-rose-50'}`}>
              <div className="flex items-center gap-2 font-bold text-ink">
                {bre.eligible ? <CheckCircle2 className="h-5 w-5 text-mint" /> : <XCircle className="h-5 w-5 text-rose" />}
                {bre.eligible ? 'Eligible' : 'Not eligible'}
              </div>
              {bre.reasons.length ? <ul className="mt-3 grid gap-2 text-sm text-muted">{bre.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul> : null}
            </div>
          ) : null}
        </AppCard>
      </div>
    </ApplyShell>
  );
}
