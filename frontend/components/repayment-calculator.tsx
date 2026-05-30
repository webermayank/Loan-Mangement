'use client';

import { IndianRupee, Percent, TimerReset } from 'lucide-react';
import { calculateLoan, money } from '@/lib/format';

export function RepaymentCalculator({ amount, tenureDays }: { amount: number; tenureDays: number }) {
  const calc = calculateLoan(amount, tenureDays);
  const items = [
    { label: 'Principal', value: money(calc.amount), icon: IndianRupee },
    { label: 'Interest', value: money(calc.simpleInterest), icon: Percent },
    { label: 'Tenure', value: `${calc.tenureDays} days`, icon: TimerReset },
  ];

  return (
    <aside className="rounded-2xl border border-line bg-ink p-5 text-white shadow-soft">
      <p className="text-sm font-medium text-blue-100">Live repayment calculation</p>
      <div className="mt-3 text-3xl font-bold">{money(calc.totalRepayment)}</div>
      <p className="mt-1 text-sm text-blue-100">Total repayment at fixed 12% p.a. simple interest</p>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-xl bg-white/10 p-3">
            <span className="flex items-center gap-2 text-sm text-blue-50">
              <item.icon className="h-4 w-4" />
              {item.label}
            </span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </aside>
  );
}
