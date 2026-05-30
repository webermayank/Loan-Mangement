'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApplyShell } from '@/components/apply-shell';
import { AppCard } from '@/components/app-card';
import { RepaymentCalculator } from '@/components/repayment-calculator';
import { Button } from '@/components/ui/button';
import { Field, inputClass } from '@/components/ui/field';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/toast';

export default function LoanPage() {
  const [amount, setAmount] = useState(150000);
  const [tenureDays, setTenureDays] = useState(90);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  async function save() {
    setBusy(true);
    try {
      await api('/borrower/loan-config', {
        method: 'POST',
        body: JSON.stringify({ amount: Number(amount), tenureDays: Number(tenureDays) }),
      });
      showToast('Loan configuration saved');
      router.push('/apply/review');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not save loan details', 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ApplyShell active={2}>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.72fr]">
        <AppCard>
          <h1 className="text-2xl font-black text-ink">Loan configuration</h1>
          <p className="mt-2 text-sm leading-6 text-muted">Choose amount and tenure. Interest is fixed at 12% p.a.</p>
          <div className="mt-7 grid gap-6">
            <Field label="Amount">
              <input className="w-full accent-brand-600" type="range" min={50000} max={500000} step={10000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
              <input className={inputClass} type="number" min={50000} max={500000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </Field>
            <Field label="Tenure days">
              <input className="w-full accent-brand-600" type="range" min={30} max={365} step={5} value={tenureDays} onChange={(e) => setTenureDays(Number(e.target.value))} />
              <input className={inputClass} type="number" min={30} max={365} value={tenureDays} onChange={(e) => setTenureDays(Number(e.target.value))} />
            </Field>
            <Button disabled={busy} onClick={save}>Save and review</Button>
          </div>
        </AppCard>
        <RepaymentCalculator amount={amount} tenureDays={tenureDays} />
      </div>
    </ApplyShell>
  );
}
