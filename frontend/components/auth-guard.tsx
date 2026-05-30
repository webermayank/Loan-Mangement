'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import { roleHome, useAuth } from '@/lib/auth';
import type { Role } from '@/lib/types';

export function AuthGuard({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace('/login');
    else if (!roles.includes(user.role)) router.replace(roleHome[user.role]);
  }, [loading, user, roles, router]);

  if (loading || !user || !roles.includes(user.role)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-6">
        <div className="glass-panel rounded-2xl p-8 text-center">
          <ShieldAlert className="mx-auto mb-4 h-8 w-8 text-brand-600" />
          <p className="font-semibold text-ink">Checking secure access...</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
