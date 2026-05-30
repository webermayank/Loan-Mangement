'use client';

import { useEffect, useState } from 'react';

const metrics = [
  { prefix: '₹', value: 12.4, suffix: ' Cr', label: 'Loans Processed', decimals: 1 },
  { value: 2500, suffix: '+', label: 'Applications Reviewed' },
  { value: 98.6, suffix: '%', label: 'System Accuracy', decimals: 1 },
  { value: 24, suffix: ' Hour', label: 'Average Approval Time' },
];

export function CountUpMetrics() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 80;
    const timer = window.setInterval(() => {
      frame += 1;
      setProgress(Math.min(frame / totalFrames, 1));
      if (frame >= totalFrames) window.clearInterval(timer);
    }, 18);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = metric.value * eased;
        const display =
          metric.decimals !== undefined
            ? value.toFixed(metric.decimals)
            : Math.round(value).toLocaleString('en-IN');

        return (
          <div
            key={metric.label}
            className="group rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft"
          >
            <p className="text-4xl font-black tracking-tight text-ink">
              {metric.prefix}
              {display}
              {metric.suffix}
            </p>
            <p className="mt-2 text-sm font-bold text-muted">{metric.label}</p>
          </div>
        );
      })}
    </section>
  );
}
