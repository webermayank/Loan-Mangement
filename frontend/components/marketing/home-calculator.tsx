'use client';

import { useMemo, useState } from 'react';
import { Banknote, CalendarDays, IndianRupee, Percent } from 'lucide-react';
import { money } from '@/lib/format';

export function HomeCalculator() {
  const [amount, setAmount] = useState(240000);
  const [tenure, setTenure] = useState(120);
  const [interestRate, setInterestRate] = useState(12);
  const calc = useMemo(() => {
    const simpleInterest = (amount * interestRate * tenure) / (365 * 100);
    return {
      amount,
      tenureDays: tenure,
      interestRate,
      simpleInterest: Number(simpleInterest.toFixed(2)),
      totalRepayment: Number((amount + simpleInterest).toFixed(2)),
    };
  }, [amount, tenure, interestRate]);
  const daily = calc.totalRepayment / tenure;

  return (
    <section id="calculator" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-600">Interactive calculator</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight text-ink md:text-6xl">Model repayment before a loan moves forward.</h2>
        <p className="mt-5 text-lg leading-8 text-muted">
          Configure lending terms with a live 12% p.a. simple-interest calculation that mirrors the platform logic.
        </p>
      </div>

      <div className="grid gap-6 rounded-[34px] border border-white/80 bg-white/80 p-4 shadow-soft backdrop-blur md:p-6 lg:grid-cols-[1fr_0.82fr]">
        <div className="rounded-[28px] border border-line bg-white p-6 md:p-8">
          <div className="grid gap-8">
            <SliderControl
              icon={<IndianRupee className="h-5 w-5" />}
              label="Loan Amount"
              value={amount}
              display={money(amount)}
              min={50000}
              max={500000}
              step={10000}
              onChange={setAmount}
            />
            <SliderControl
              icon={<CalendarDays className="h-5 w-5" />}
              label="Tenure"
              value={tenure}
              display={`${tenure} days`}
              min={30}
              max={365}
              step={5}
              onChange={setTenure}
            />
            <SliderControl
              icon={<Percent className="h-5 w-5" />}
              label="Interest Rate"
              value={interestRate}
              display={`${interestRate.toFixed(1)}% p.a.`}
              min={8}
              max={24}
              step={0.5}
              onChange={setInterestRate}
            />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] bg-ink p-6 text-white md:p-8">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
          <p className="relative text-sm font-bold text-blue-100">Live repayment panel</p>
          <p className="relative mt-4 text-5xl font-black tracking-tight">{money(calc.totalRepayment)}</p>
          <p className="relative mt-2 text-sm text-blue-100">
            Total repayment due over {tenure} days at {interestRate.toFixed(1)}% p.a.
          </p>

          <div className="relative mt-8 grid gap-3">
            <PanelMetric label="Principal" value={money(calc.amount)} />
            <PanelMetric label="Interest rate" value={`${calc.interestRate.toFixed(1)}% p.a.`} />
            <PanelMetric label="Interest" value={money(calc.simpleInterest)} />
            <PanelMetric label="Daily estimate" value={money(daily)} />
          </div>

          <div className="relative mt-8 rounded-2xl border border-white/10 bg-white/10 p-5">
            <div className="flex items-center gap-3">
              <Banknote className="h-5 w-5 text-blue-100" />
              <p className="text-sm font-semibold text-blue-100">Built for transparent borrower communication and operations review.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SliderControl({
  icon,
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="flex items-center gap-3 text-sm font-black text-ink">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">{icon}</span>
          {label}
        </span>
        <strong className="text-2xl text-ink">{display}</strong>
      </div>
      <input
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-brand-600 to-emerald-400 accent-brand-600"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="mt-3 flex justify-between text-xs font-bold text-muted">
        <span>{label === 'Tenure' ? `${min} days` : money(min)}</span>
        <span>{label === 'Tenure' ? `${max} days` : money(max)}</span>
      </div>
    </div>
  );
}

function PanelMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/10 p-4">
      <span className="text-sm font-semibold text-blue-100">{label}</span>
      <strong className="text-lg">{value}</strong>
    </div>
  );
}
