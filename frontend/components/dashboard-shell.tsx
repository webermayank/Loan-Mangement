'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Banknote, ClipboardCheck, LogOut, Send, Shield, Users } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';
import { RoleBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import type { Role } from '@/lib/types';

const items = [
  { href: '/dashboard/sales', label: 'Sales', role: 'sales', icon: Users },
  { href: '/dashboard/sanction', label: 'Sanction', role: 'sanction', icon: ClipboardCheck },
  { href: '/dashboard/disbursement', label: 'Disbursement', role: 'disbursement', icon: Send },
  { href: '/dashboard/collection', label: 'Collection', role: 'collection', icon: Banknote },
  { href: '/dashboard/admin', label: 'Admin', role: 'admin', icon: Shield },
] as const;

export function DashboardShell({ children, roles }: { children: React.ReactNode; roles: Role[] }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const visibleItems = items.filter((item) => user?.role === 'admin' || item.role === user?.role);

  return (
    <AuthGuard roles={roles}>
      <main className="min-h-screen bg-paper">
        <div className="mx-auto flex max-w-7xl gap-6 px-4 py-4 lg:px-6">
          <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 rounded-3xl border border-line bg-white p-4 shadow-card lg:block">
            <Link href="/" className="flex items-center gap-2 text-lg font-black text-ink">
              <BarChart3 className="h-5 w-5 text-brand-600" />
              LoanOS
            </Link>
            <div className="mt-8 grid gap-2">
              {visibleItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${
                    pathname === item.href ? 'bg-brand-50 text-brand-700' : 'text-muted hover:bg-paper hover:text-ink'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-line bg-paper p-4">
              <p className="text-sm font-bold text-ink">{user?.name}</p>
              {user ? <div className="mt-2"><RoleBadge role={user.role} /></div> : null}
              <Button variant="ghost" className="mt-3 w-full justify-start" onClick={logout}><LogOut className="h-4 w-4" /> Logout</Button>
            </div>
          </aside>
          <section className="min-w-0 flex-1">
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-line bg-white p-3 shadow-card lg:hidden">
              <Link href="/" className="font-black text-ink">LoanOS</Link>
              {user ? <RoleBadge role={user.role} /> : null}
            </div>
            {children}
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}
