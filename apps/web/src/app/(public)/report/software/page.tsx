import Link from 'next/link';
import { SoftwarePanel } from '@/components/sections/software-panel';
import { ConsistencyMatrix } from '@/components/sections/consistency-matrix';
import { getDemoReport } from '@/lib/report-data';

export const metadata = {
  title: 'Software Surface — BrowserScan',
  description: 'Deep analysis of software fingerprints including fonts, locale, language matrix, and navigator properties.'
};

export default async function SoftwareReportPage() {
  const report = await getDemoReport();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      {/* Header */}
      <div>
        <Link href="/report" className="text-xs text-zinc-500 hover:text-zinc-400">← Back to Report</Link>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-zinc-500">Software Layer</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Fonts, Locale & Navigator</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Locale configuration analysis, language preference matrix, font hash enumeration, and browser properties.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap gap-2">
        <Link href="/report/network" className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-700">Network</Link>
        <Link href="/report/hardware" className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-700">Hardware</Link>
        <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">Software</span>
        <Link href="/report/consistency" className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-700">Consistency</Link>
      </div>

      {/* Software Panel */}
      <SoftwarePanel report={report} />

      {/* Consistency Preview */}
      <ConsistencyMatrix consistency={report.consistency} />

      {/* Info Section */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        <h3 className="text-sm font-semibold text-zinc-100">Software Detection Explained</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-violet-400">Font Enumeration</p>
            <p className="mt-1 text-xs text-zinc-500">
              Installed fonts create unique signatures. Custom fonts, font variations, and rendering differences identify systems.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-amber-400">Locale Signals</p>
            <p className="mt-1 text-xs text-zinc-500">
              Timezone, language preferences, and regional settings reveal geographic location and user configuration.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-emerald-400">Navigator API</p>
            <p className="mt-1 text-xs text-zinc-500">
              Browser properties like user agent, platform, plugins, and feature flags identify browser versions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
