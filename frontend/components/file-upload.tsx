'use client';

import { UploadCloud } from 'lucide-react';

export function FileUpload({ file, onChange }: { file: File | null; onChange: (file: File | null) => void }) {
  return (
    <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-brand-100 bg-brand-50/70 px-6 py-8 text-center transition hover:border-brand-500 hover:bg-brand-50">
      <UploadCloud className="mb-3 h-9 w-9 text-brand-600" />
      <span className="text-sm font-bold text-ink">{file ? file.name : 'Upload salary slip'}</span>
      <span className="mt-1 text-xs font-medium text-muted">PDF, JPG or PNG up to 5 MB</span>
      <input
        className="sr-only"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        onChange={(event) => onChange(event.target.files?.[0] || null)}
      />
    </label>
  );
}
