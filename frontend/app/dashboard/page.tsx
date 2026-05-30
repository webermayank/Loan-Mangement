'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { roleHome, useAuth } from '@/lib/auth';

export default function DashboardIndex() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace(roleHome[user.role]);
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  return null;
}
