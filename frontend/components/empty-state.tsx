import { Inbox } from 'lucide-react';

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-10 text-center shadow-card">
      <Inbox className="mx-auto mb-3 h-10 w-10 text-brand-500" />
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{body}</p>
    </div>
  );
}
