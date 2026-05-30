'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApplyShell } from '@/components/apply-shell';
import { AppCard } from '@/components/app-card';
import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/toast';

export default function DocumentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  async function upload() {
    if (!file) return showToast('Choose a salary slip first', 'error');
    if (file.size > 5 * 1024 * 1024) return showToast('File must be under 5 MB', 'error');
    const formData = new FormData();
    formData.append('salarySlip', file);
    setBusy(true);
    try {
      await api('/borrower/salary-slip', { method: 'POST', body: formData });
      showToast('Salary slip uploaded');
      router.push('/apply/loan');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Upload failed', 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ApplyShell active={1}>
      <AppCard className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-black text-ink">Salary slip</h1>
        <p className="mt-2 text-sm leading-6 text-muted">Upload one recent salary slip. The backend validates type and size again.</p>
        <div className="mt-6"><FileUpload file={file} onChange={setFile} /></div>
        <div className="mt-6 flex justify-end"><Button disabled={busy} onClick={upload}>Save document</Button></div>
      </AppCard>
    </ApplyShell>
  );
}
