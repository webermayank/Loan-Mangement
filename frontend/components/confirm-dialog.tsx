'use client';

import { Button } from '@/components/ui/button';

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Confirm',
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/35 p-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-ink">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
