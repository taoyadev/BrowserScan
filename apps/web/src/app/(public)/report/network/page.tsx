import Link from 'next/link';
import { NetworkProtocols } from '@/components/sections/network-protocols';
import { RiskBoard } from '@/components/sections/risk-board';
import { LeakPanels } from '@/components/sections/leak-panels';
import { getDemoReport } from '@/lib/report-data';

export const metadata = {
  title: 'Network Intelligence — BrowserScan',
  description: 'Deep analysis of network layer fingerprints including ASN, JA3/JA4, TLS protocols, and leak telemetry.'
};

export default async function NetworkReportPage() {
  const report = await getDemoReport();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      {/* Header */}
      <div>
        <Link href="/report" className="text-xs text-zinc-500 hover:text-zinc-400">← Back to Report</Link>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-zinc-500">Network Layer</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Packet & TLS Intelligence</h1>
        <p className="mt-2 text-sm text-zinc-400">
          ASN analysis, JA3/JA4 fingerprints, protocol stacks, and leak telemetry captured at the network edge.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">Network</span>
        <Link href="/report/hardware" className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-700">Hardware</Link>
        <Link href="/report/software" className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-700">Software</Link>
        <Link href="/report/consistency" className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-700">Consistency</Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <NetworkProtocols report={report} />
        <RiskBoard report={report} className="col-span-1 md:col-span-2" />
      </div>

      {/* Leak Panels */}
      <LeakPanels report={report} />

      {/* Info Section */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        <h3 className="text-sm font-semibold text-zinc-100">Network Detection Explained</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-emerald-400">ASN Intelligence</p>
            <p className="mt-1 text-xs text-zinc-500">
              Autonomous System Numbers reveal your ISP or hosting provider. Datacenter ASNs are flagged as suspicious.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-sky-400">TLS Fingerprinting</p>
            <p className="mt-1 text-xs text-zinc-500">
              JA3/JA4 hashes capture unique TLS handshake patterns that identify browser and automation tools.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-amber-400">Leak Detection</p>
            <p className="mt-1 text-xs text-zinc-500">
              WebRTC, DNS, and IPv6 leaks can expose your real IP even when using VPN or proxy services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
