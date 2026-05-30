import { clsx } from 'clsx';

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-ink">{label}</span>
      {children}
      {error ? <span className="block text-xs font-medium text-rose">{error}</span> : null}
    </label>
  );
}

export const inputClass = clsx(
  'h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition',
  'placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100'
);
