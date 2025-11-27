import { NetworkProtocols } from '@/components/sections/network-protocols';
import { RiskBoard } from '@/components/sections/risk-board';
import { LeakPanels } from '@/components/sections/leak-panels';
import { getDemoReport } from '@/lib/report-data';

export const metadata = {
  title: 'Network Intelligence — BrowserScan'
};

export default async function NetworkReportPage() {
  const report = await getDemoReport();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Network Layer</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Packet & TLS Intelligence</h1>
        <p className="text-sm text-zinc-400">ASN, JA3/JA4, protocol stacks, and leak telemetry captured at the edge.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <NetworkProtocols report={report} />
        <RiskBoard report={report} className="col-span-2" />
      </div>
      <LeakPanels report={report} />
    </div>
  );
}
