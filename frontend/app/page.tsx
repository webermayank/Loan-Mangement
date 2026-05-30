import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  Fingerprint,
  History,
  Layers3,
  LockKeyhole,
  PieChart,
  ReceiptText,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRoundCheck,
  Users,
  WalletCards,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountUpMetrics } from '@/components/marketing/count-up-metrics';
import { FAQAccordion } from '@/components/marketing/faq-accordion';
import { HomeCalculator } from '@/components/marketing/home-calculator';

const workflowSteps = [
  { step: 'Step 1', title: 'Create Account', icon: UserRoundCheck },
  { step: 'Step 2', title: 'Complete Verification', icon: Fingerprint },
  { step: 'Step 3', title: 'Upload Documents', icon: FileCheck2 },
  { step: 'Step 4', title: 'Configure Loan', icon: WalletCards },
  { step: 'Step 5', title: 'Approval & Disbursement', icon: Send },
  { step: 'Step 6', title: 'Repayment Tracking', icon: ReceiptText },
];

const modules = [
  { title: 'Sales Operations', body: 'Track and manage borrower leads.', icon: Users, stat: 'Lead intake' },
  { title: 'Loan Sanction', body: 'Review applications and approve/reject requests.', icon: ClipboardCheck, stat: 'Credit review' },
  { title: 'Disbursement', body: 'Release approved funds and manage payouts.', icon: Send, stat: 'Payout control' },
  { title: 'Collections', body: 'Track repayments and close loans automatically.', icon: Banknote, stat: 'UTR payments' },
  { title: 'Admin Control Center', body: 'Monitor the entire lifecycle from one place.', icon: ShieldCheck, stat: 'Full visibility' },
];

const features = [
  { title: 'Server-Side Eligibility Engine', body: 'Centralized BRE rules keep eligibility decisions consistent across every channel.', icon: Layers3 },
  { title: 'Role-Based Security', body: 'Borrower and operations access are separated with frontend guards and backend middleware.', icon: LockKeyhole },
  { title: 'Document Management', body: 'Validated salary-slip upload supports PDF, JPG, and PNG files with clear status feedback.', icon: FileCheck2 },
  { title: 'Real-Time Loan Tracking', body: 'Borrowers and teams can follow applications from lead to closure with live status chips.', icon: Activity },
  { title: 'Automated Repayment Monitoring', body: 'Collections can record payments and automatically close loans when repayment is complete.', icon: BadgeCheck },
  { title: 'Audit Logs & Activity History', body: 'Lifecycle actions and operational notes create a reviewable trail for teams.', icon: History },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <nav className="sticky top-0 z-30 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-ink text-white shadow-card">
              <BarChart3 className="h-5 w-5" />
            </span>
            LoanOS
          </Link>
          <div className="hidden items-center gap-7 text-sm font-bold text-muted md:flex">
            <a href="#calculator" className="transition hover:text-ink">Calculator</a>
            <a href="#workflow" className="transition hover:text-ink">Workflow</a>
            <a href="#modules" className="transition hover:text-ink">Modules</a>
            <a href="#dashboard" className="transition hover:text-ink">Dashboard</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login"><Button variant="ghost">Login</Button></Link>
            <Link href="/register"><Button>Get Started</Button></Link>
          </div>
        </div>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:pb-24 lg:pt-24">
        <div className="absolute left-1/2 top-4 -z-10 h-[36rem] w-[54rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-100 via-white to-emerald-50 blur-3xl" />
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/90 px-4 py-2 text-sm font-black text-brand-700 shadow-card">
            <Sparkles className="h-4 w-4" />
            Modern lending infrastructure for fast-moving teams
          </div>
          <h1 className="max-w-5xl text-5xl font-black leading-[1.01] tracking-tight text-ink md:text-7xl">
            Premium loan workflows from application to closure.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted md:text-xl md:leading-9">
            LoanOS unifies borrower onboarding, eligibility checks, document collection, approvals, disbursements, and repayments in one refined digital lending platform.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/register"><Button className="h-12 px-5">Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="/login"><Button className="h-12 px-5" variant="secondary">View Dashboard</Button></Link>
          </div>
          <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
            {['Secure by role', '12% fixed rate', 'Real-time lifecycle'].map((label) => (
              <div key={label} className="flex items-center gap-2 text-sm font-bold text-muted">
                <CheckCircle2 className="h-4 w-4 text-mint" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <HeroDashboard />
      </section>

      <CountUpMetrics />
      <HomeCalculator />
      <HowItWorks />
      <PlatformModules />
      <FeatureGrid />
      <DashboardPreview />
      <FAQAccordion />
      <CtaFooter />
    </main>
  );
}

function HeroDashboard() {
  return (
    <div className="glass-panel rounded-[34px] p-3 transition duration-500 hover:-translate-y-1 hover:shadow-soft md:p-4">
      <div className="rounded-[28px] bg-white p-5 md:p-6">
        <div className="flex items-center justify-between border-b border-line pb-5">
          <div>
            <p className="text-sm font-black text-brand-600">Today</p>
            <h2 className="text-2xl font-black text-ink">Loan Pipeline</h2>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Healthy</span>
        </div>
        <div className="mt-5 grid gap-3">
          {[
            ['Applied', '36 loans', '76%', 'bg-brand-600'],
            ['Sanctioned', '24 loans', '58%', 'bg-emerald-500'],
            ['Disbursed', '18 loans', '43%', 'bg-amber'],
          ].map(([label, count, width, color]) => (
            <div key={label} className="rounded-2xl border border-line bg-paper p-4 transition hover:bg-white hover:shadow-card">
              <div className="flex items-center justify-between">
                <span className="font-black text-ink">{label}</span>
                <span className="text-sm font-bold text-muted">{count}</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white">
                <div className={`h-2 rounded-full ${color}`} style={{ width }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-ink p-4 text-white">
            <p className="text-xs font-bold text-blue-100">Approval SLA</p>
            <p className="mt-2 text-3xl font-black">24h</p>
          </div>
          <div className="rounded-2xl border border-line p-4">
            <p className="text-xs font-bold text-muted">Collections</p>
            <p className="mt-2 text-3xl font-black text-ink">92%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-600">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-black tracking-tight text-ink md:text-6xl">{title}</h2>
      <p className="mt-5 text-lg leading-8 text-muted">{body}</p>
    </div>
  );
}

function HowItWorks() {
  return (
    <section id="workflow" className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeading
        eyebrow="How it works"
        title="A clear path from borrower intent to repayment."
        body="Every step is designed to reduce friction for borrowers while giving operations teams the control they need."
      />
      <div className="relative grid gap-4 lg:grid-cols-6">
        <div className="absolute left-10 right-10 top-12 hidden h-px bg-gradient-to-r from-transparent via-brand-100 to-transparent lg:block" />
        {workflowSteps.map((item) => (
          <div key={item.title} className="group relative rounded-[26px] border border-line bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
              <item.icon className="h-6 w-6" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-muted">{item.step}</p>
            <h3 className="mt-2 text-lg font-black text-ink">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

function PlatformModules() {
  return (
    <section id="modules" className="bg-white/60 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Platform modules"
          title="Operations teams see exactly what they need."
          body="A role-aware command center keeps lending work organized from lead intake to collections."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {modules.map((module) => (
            <div key={module.title} className="group rounded-[28px] border border-line bg-white p-5 shadow-card transition duration-300 hover:-translate-y-2 hover:border-brand-100 hover:shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-paper text-brand-700 transition group-hover:bg-ink group-hover:text-white">
                <module.icon className="h-5 w-5" />
              </div>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-brand-600">{module.stat}</p>
              <h3 className="mt-2 text-xl font-black text-ink">{module.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{module.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeading
        eyebrow="Core capabilities"
        title="Built for secure, measurable lending operations."
        body="Elegant borrower experiences are paired with structured controls for the teams behind the lifecycle."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-[28px] border border-line bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
            <feature.icon className="h-7 w-7 text-brand-600" />
            <h3 className="mt-5 text-xl font-black text-ink">{feature.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{feature.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardPreview() {
  const activity = [
    ['Aarav Mehta', 'Application moved to sanction', '2 min ago'],
    ['Nisha Rao', 'Salary slip verified', '8 min ago'],
    ['Karan Shah', 'Payment recorded with UTR', '21 min ago'],
    ['Priya Nair', 'Loan closed automatically', '44 min ago'],
  ];

  return (
    <section id="dashboard" className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeading
        eyebrow="Dashboard preview"
        title="A command center that looks as calm as it feels."
        body="Monitor loan pipeline health, status distribution, approval funnel, and recent activity from one enterprise-grade surface."
      />
      <div className="rounded-[34px] border border-white/80 bg-white/85 p-4 shadow-soft backdrop-blur md:p-6">
        <div className="rounded-[28px] border border-line bg-paper p-4 md:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[24px] bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-brand-600">Loan Pipeline</p>
                  <h3 className="mt-1 text-2xl font-black text-ink">₹4.8 Cr active book</h3>
                </div>
                <TrendingUp className="h-6 w-6 text-mint" />
              </div>
              <div className="mt-6 grid gap-3">
                {[
                  ['Lead', '92', '82%'],
                  ['Applied', '54', '61%'],
                  ['Sanctioned', '31', '44%'],
                  ['Disbursed', '19', '28%'],
                ].map(([label, value, width]) => (
                  <div key={label}>
                    <div className="mb-2 flex justify-between text-sm font-bold">
                      <span className="text-muted">{label}</span>
                      <span className="text-ink">{value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-paper">
                      <div className="h-2 rounded-full bg-brand-600" style={{ width }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[24px] bg-white p-5 shadow-card">
                <p className="text-sm font-black text-brand-600">Status Distribution</p>
                <div className="mt-5 flex items-center gap-5">
                  <div className="grid h-28 w-28 place-items-center rounded-full bg-[conic-gradient(#2563EB_0_48%,#10B981_48%_74%,#F59E0B_74%_90%,#E5EAF2_90%)]">
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-white text-sm font-black text-ink">156</div>
                  </div>
                  <div className="grid gap-2 text-sm font-bold text-muted">
                    <span>Applied 48%</span>
                    <span>Sanctioned 26%</span>
                    <span>Disbursed 16%</span>
                  </div>
                </div>
              </div>
              <div className="rounded-[24px] bg-ink p-5 text-white shadow-card">
                <p className="text-sm font-bold text-blue-100">Approval Funnel</p>
                <p className="mt-2 text-3xl font-black">71.4%</p>
                <p className="mt-1 text-sm text-blue-100">Qualified applications approved this week</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[24px] bg-white p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-black text-ink">Recent Activity Feed</h3>
              <PieChart className="h-5 w-5 text-brand-600" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {activity.map(([name, action, time]) => (
                <div key={name} className="rounded-2xl border border-line bg-paper p-4">
                  <p className="font-black text-ink">{name}</p>
                  <p className="mt-1 text-sm text-muted">{action}</p>
                  <p className="mt-3 text-xs font-bold text-brand-600">{time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaFooter() {
  return (
    <footer className="px-6 pb-8 pt-10">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-ink p-8 text-white shadow-soft md:p-14">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-100">Ready to launch</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
              Manage lending operations from application to closure.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              Streamline borrower onboarding, approvals, disbursements, and collections in one unified platform.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/register"><Button className="bg-white text-ink hover:bg-blue-50">Get Started</Button></Link>
            <Link href="/login"><Button className="border-white/20 bg-white/10 text-white hover:bg-white/15" variant="secondary">View Dashboard</Button></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
