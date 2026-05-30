'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

type Toast = { id: number; message: string; type: 'success' | 'error' };

const ToastContext = createContext<{ showToast: (message: string, type?: Toast['type']) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const value = useMemo(
    () => ({
      showToast: (message: string, type: Toast['type'] = 'success') => {
        const id = Date.now();
        setToasts((current) => [...current, { id, message, type }]);
        window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3200);
      },
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 grid gap-3">
        {toasts.map((toast) => {
          const Icon = toast.type === 'success' ? CheckCircle2 : XCircle;
          return (
            <div key={toast.id} className="glass-panel flex min-w-72 items-center gap-3 rounded-xl px-4 py-3">
              <Icon className={toast.type === 'success' ? 'h-5 w-5 text-mint' : 'h-5 w-5 text-rose'} />
              <p className="text-sm font-semibold text-ink">{toast.message}</p>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast must be used inside ToastProvider');
  return value;
}
