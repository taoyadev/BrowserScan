import Link from 'next/link';

export const metadata = {
  title: 'Knowledge Base — BrowserScan',
  description: 'Learn about browser fingerprinting methodology, detection algorithms, and privacy practices.'
};

const topics = [
  {
    href: '/knowledge/methodology',
    title: 'Scoring Methodology',
    desc: 'Understand how the trust score is calculated with deterministic deductions based on network, fingerprint, and behavioral signals.',
    icon: '📊',
    color: 'border-emerald-500/30 hover:border-emerald-500/50',
    badge: 'Technical'
  },
  {
    href: '/knowledge/privacy',
    title: 'Privacy Whitepaper',
    desc: 'Data handling policies, retention periods, anonymization practices, and compliance commitments.',
    icon: '🔒',
    color: 'border-sky-500/30 hover:border-sky-500/50',
    badge: 'Policy'
  }
];

export default function KnowledgeIndexPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      {/* Header */}
      <div>
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-400">← Back to Dashboard</Link>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-zinc-500">BrowserScan</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Knowledge Base</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Deep-dive into the technical methodology behind browser fingerprinting and trust scoring.
          Understand how detection systems work and how we protect your privacy.
        </p>
      </div>

      {/* Topics */}
      <div className="space-y-4">
        {topics.map((topic) => (
          <Link
            key={topic.href}
            href={topic.href}
            className={`block rounded-2xl border bg-black/40 p-6 transition hover:-translate-y-1 hover:bg-black/60 ${topic.color}`}
          >
            <div className="flex items-start justify-between">
              <span className="text-2xl">{topic.icon}</span>
              <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                {topic.badge}
              </span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-zinc-100">{topic.title}</h2>
            <p className="mt-2 text-sm text-zinc-500">{topic.desc}</p>
            <div className="mt-4 flex items-center gap-1 text-xs text-zinc-600">
              <span>Read more</span>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Facts */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        <h3 className="text-sm font-semibold text-zinc-100">Quick Facts</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-zinc-900/50 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">7+</p>
            <p className="text-xs text-zinc-500">Detection Categories</p>
          </div>
          <div className="rounded-xl bg-zinc-900/50 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">100</p>
            <p className="text-xs text-zinc-500">Max Trust Score</p>
          </div>
          <div className="rounded-xl bg-zinc-900/50 p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">30d</p>
            <p className="text-xs text-zinc-500">Data Retention</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-xl border border-dashed border-zinc-800 p-4">
        <p className="text-xs text-zinc-500">
          <span className="font-medium text-zinc-400">Questions?</span> For technical inquiries about
          our methodology or privacy practices, please open an issue on our GitHub repository.
        </p>
      </div>
    </div>
  );
}
