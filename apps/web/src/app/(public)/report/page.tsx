import Link from 'next/link';

export const metadata = {
  title: 'Deep Report — BrowserScan',
  description: 'Comprehensive browser fingerprint analysis with network, hardware, software, and consistency intelligence.'
};

const reportSections = [
  {
    href: '/report/network',
    title: 'Network Intelligence',
    desc: 'ASN analysis, JA3/JA4 fingerprints, TLS protocol stacks, and leak telemetry from edge detection.',
    icon: '🌐',
    color: 'border-emerald-500/30 hover:border-emerald-500/50'
  },
  {
    href: '/report/hardware',
    title: 'Hardware Fingerprints',
    desc: 'Canvas signatures, WebGL renderer analysis, GPU vendor detection, and sensor data collection.',
    icon: '🖥️',
    color: 'border-sky-500/30 hover:border-sky-500/50'
  },
  {
    href: '/report/software',
    title: 'Software Surface',
    desc: 'Font enumeration, locale configuration, language matrix, and navigator properties analysis.',
    icon: '📦',
    color: 'border-violet-500/30 hover:border-violet-500/50'
  },
  {
    href: '/report/consistency',
    title: 'Consistency Analysis',
    desc: 'Cross-reference timezone, language, and OS signals with IP-derived geolocation intelligence.',
    icon: '🔍',
    color: 'border-amber-500/30 hover:border-amber-500/50'
  }
];

export default function ReportIndexPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      {/* Header */}
      <div>
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-400">← Back to Dashboard</Link>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-zinc-500">BrowserScan Analysis</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Deep Detection Report</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Navigate through forensic evidence layers supporting your browser trust score.
          Each section reveals different detection signals used in fingerprint analysis.
        </p>
      </div>

      {/* Section Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {reportSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className={`block rounded-2xl border bg-black/40 p-6 transition hover:-translate-y-1 hover:bg-black/60 ${section.color}`}
          >
            <div className="flex items-start justify-between">
              <span className="text-2xl">{section.icon}</span>
              <svg className="h-5 w-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-zinc-100">{section.title}</h3>
            <p className="mt-2 text-sm text-zinc-500">{section.desc}</p>
          </Link>
        ))}
      </div>

      {/* Analysis Overview */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        <h3 className="text-sm font-semibold text-zinc-100">What We Analyze</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-medium text-emerald-400">Active Signals</p>
            <ul className="space-y-1 text-xs text-zinc-500">
              <li>Canvas & WebGL rendering</li>
              <li>Audio context fingerprinting</li>
              <li>Font enumeration</li>
              <li>WebRTC leak detection</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-sky-400">Passive Signals</p>
            <ul className="space-y-1 text-xs text-zinc-500">
              <li>TLS/JA3 fingerprinting</li>
              <li>HTTP header analysis</li>
              <li>IP geolocation</li>
              <li>DNS resolver detection</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="rounded-xl border border-dashed border-zinc-800 p-4">
        <p className="text-xs text-zinc-500">
          <span className="font-medium text-zinc-400">Tip:</span> Start with Network Intelligence to understand
          how your connection appears to detection systems, then explore hardware and software fingerprints.
        </p>
      </div>
    </div>
  );
}
