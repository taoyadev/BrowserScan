import Link from 'next/link';
import { HardwarePanel } from '@/components/sections/hardware-panel';
import { LeakPanels } from '@/components/sections/leak-panels';
import { getDemoReport } from '@/lib/report-data';

export const metadata = {
  title: 'Hardware Intelligence — BrowserScan',
  description: 'Deep analysis of hardware fingerprints including Canvas, WebGL, GPU vendors, and sensor data.'
};

export default async function HardwareReportPage() {
  const report = await getDemoReport();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      {/* Header */}
      <div>
        <Link href="/report" className="text-xs text-zinc-500 hover:text-zinc-400">← Back to Report</Link>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-zinc-500">Hardware Layer</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Canvas, WebGL & Sensor Fingerprints</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Unmasked GPU vendors, canvas signatures, audio fingerprints, and environment concurrency metrics.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap gap-2">
        <Link href="/report/network" className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-700">Network</Link>
        <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-400">Hardware</span>
        <Link href="/report/software" className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-700">Software</Link>
        <Link href="/report/consistency" className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-700">Consistency</Link>
      </div>

      {/* Hardware Panel */}
      <HardwarePanel report={report} />

      {/* Leak Panels */}
      <LeakPanels report={report} />

      {/* Info Section */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        <h3 className="text-sm font-semibold text-zinc-100">Hardware Detection Explained</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-sky-400">Canvas Fingerprint</p>
            <p className="mt-1 text-xs text-zinc-500">
              Rendering text and graphics produces unique pixel patterns based on GPU, drivers, and OS configuration.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-violet-400">WebGL Renderer</p>
            <p className="mt-1 text-xs text-zinc-500">
              GPU vendor and model strings exposed through WebGL debugging extensions identify specific hardware.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-emerald-400">Audio Context</p>
            <p className="mt-1 text-xs text-zinc-500">
              Audio processing characteristics create unique signatures based on audio hardware and software stack.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
