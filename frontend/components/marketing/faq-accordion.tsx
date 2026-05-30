'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How is eligibility determined?',
    answer: 'Eligibility is evaluated through a server-side rules engine using age, PAN format, monthly salary, and employment mode. The backend remains the source of truth.',
  },
  {
    question: 'How is interest calculated?',
    answer: 'LoanOS uses simple interest at a fixed 12% p.a. rate. Interest equals principal multiplied by rate and tenure, divided by 365 x 100.',
  },
  {
    question: 'What documents are required?',
    answer: 'Borrowers upload a salary slip in PDF, JPG, or PNG format. Files are validated for type and size before the application moves forward.',
  },
  {
    question: 'Can repayments be tracked?',
    answer: 'Yes. Collection teams can record payments with unique UTR references, track outstanding balances, and close loans automatically after full repayment.',
  },
  {
    question: 'How does role-based access work?',
    answer: 'Each operations role sees only its module, while admins can monitor the full lifecycle. Backend middleware enforces authorization for every protected API route.',
  },
];

export function FAQAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="text-center">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-600">FAQ</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight text-ink md:text-5xl">Questions, answered clearly.</h2>
      </div>
      <div className="mt-10 overflow-hidden rounded-[28px] border border-line bg-white shadow-card">
        {faqs.map((faq, index) => (
          <div key={faq.question} className="border-b border-line last:border-b-0">
            <button
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-black text-ink transition hover:bg-paper"
              onClick={() => setOpen(open === index ? -1 : index)}
              aria-expanded={open === index}
            >
              {faq.question}
              <ChevronDown className={`h-5 w-5 shrink-0 text-brand-600 transition ${open === index ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ${open === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-sm leading-7 text-muted">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
