import { Check } from 'lucide-react';

export function Stepper({ steps, active }: { steps: string[]; active: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {steps.map((step, index) => {
        const complete = index < active;
        const current = index === active;
        return (
          <div key={step} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                complete || current ? 'bg-brand-600 text-white' : 'bg-slate-100 text-muted'
              }`}
            >
              {complete ? <Check className="h-4 w-4" /> : index + 1}
            </span>
            <span className="text-sm font-semibold text-ink">{step}</span>
          </div>
        );
      })}
    </div>
  );
}
