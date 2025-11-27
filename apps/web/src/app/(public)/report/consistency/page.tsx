import Link from 'next/link';
import { ConsistencyMatrix } from '@/components/sections/consistency-matrix';
import { getDemoReport } from '@/lib/report-data';

export const metadata = {
  title: 'Consistency Analysis — BrowserScan',
  description: 'Cross-reference timezone, language, and OS signals with IP-derived geolocation intelligence.'
};

export default async function ConsistencyReportPage() {
  const report = await getDemoReport();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      {/* Header */}
      <div>
        <Link href="/report" className="text-xs text-zinc-500 hover:text-zinc-400">← Back to Report</Link>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-zinc-500">Consistency Layer</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Timezone, Language & OS Diff</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Cross-compare system configuration hints with IP-derived intelligence to detect spoofing attempts.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap gap-2">
        <Link href="/report/network" className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-700">Network</Link>
        <Link href="/report/hardware" className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-700">Hardware</Link>
        <Link href="/report/software" className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-700">Software</Link>
        <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">Consistency</span>
      </div>

      {/* Consistency Matrix */}
      <ConsistencyMatrix consistency={report.consistency} />

      {/* Detection Rules */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        <h3 className="text-sm font-semibold text-zinc-100">Consistency Checks</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3">
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">Pass</span>
            <div>
              <p className="text-sm text-zinc-200">Timezone Match</p>
              <p className="text-xs text-zinc-500">Browser timezone aligns with IP geolocation expected timezone.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">Warn</span>
            <div>
              <p className="text-sm text-zinc-200">Language Mismatch</p>
              <p className="text-xs text-zinc-500">Preferred language differs from IP country&apos;s primary language.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-xs text-rose-400">Fail</span>
            <div>
              <p className="text-sm text-zinc-200">System Clock Anomaly</p>
              <p className="text-xs text-zinc-500">System time significantly deviates from expected time for claimed timezone.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        <h3 className="text-sm font-semibold text-zinc-100">Why Consistency Matters</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-amber-400">Spoofing Detection</p>
            <p className="mt-1 text-xs text-zinc-500">
              Users attempting to mask their location often forget to align all signals. A VPN to Germany with US timezone screams &quot;fake&quot;.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-rose-400">Bot Identification</p>
            <p className="mt-1 text-xs text-zinc-500">
              Automated tools rarely configure all locale properties correctly. Default or inconsistent values indicate non-human visitors.
            </p>
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className="rounded-xl border border-dashed border-zinc-800 p-4">
        <p className="text-xs text-zinc-500">
          <span className="font-medium text-zinc-400">Pro Tip:</span> Legitimate privacy tools like VPNs should be configured
          to match the exit node&apos;s locale settings to avoid detection. Time zone, language, and system locale should all align.
        </p>
      </div>
    </div>
  );
}
