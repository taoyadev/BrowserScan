import { HardwarePanel } from '@/components/sections/hardware-panel';
import { LeakPanels } from '@/components/sections/leak-panels';
import { getDemoReport } from '@/lib/report-data';

export const metadata = {
  title: 'Hardware Intelligence — BrowserScan'
};

export default async function HardwareReportPage() {
  const report = await getDemoReport();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Hardware Layer</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Canvas, WebGL & Sensor Fingerprints</h1>
        <p className="text-sm text-zinc-400">Unmasked GPU vendors, canvas signatures, and environment concurrency.</p>
      </div>
      <HardwarePanel report={report} />
      <LeakPanels report={report} />
    </div>
  );
}
