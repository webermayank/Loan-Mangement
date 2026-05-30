import { clsx } from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white shadow-card hover:bg-brand-700',
  secondary: 'border border-line bg-white text-ink hover:bg-brand-50',
  ghost: 'text-muted hover:bg-brand-50 hover:text-brand-700',
  danger: 'bg-rose text-white shadow-card hover:brightness-95',
};

export function Button({
  className,
  variant = 'primary',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={clsx(
        'inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
