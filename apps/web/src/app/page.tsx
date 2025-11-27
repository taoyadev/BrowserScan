"use client";

import { PageShell } from '@/components/layout/page-shell';
import { ActionPanel } from '@/components/sections/action-panel';
import { ConsistencyMatrix } from '@/components/sections/consistency-matrix';
import { HardwarePanel } from '@/components/sections/hardware-panel';
import { HealthRing } from '@/components/sections/health-ring';
import { IdentityPanel } from '@/components/sections/identity-panel';
import { LeakPanels } from '@/components/sections/leak-panels';
import { NetworkProtocols } from '@/components/sections/network-protocols';
import { RiskBoard } from '@/components/sections/risk-board';
import { ScanConsole } from '@/components/sections/scan-console';
import { ScoreSummary } from '@/components/sections/score-summary';
import { SoftwarePanel } from '@/components/sections/software-panel';
import { useLiveReport } from '@/lib/use-live-report';

export default function HomePage() {
  const { data, isScanning, rescan } = useLiveReport();
  const report = data!;

  return (
    <PageShell
      title="Authority Health Ring"
      subtitle={
        isScanning
          ? "Analyzing your browser fingerprint..."
          : `Scan ID ${report.meta.scan_id.slice(0, 8)} • Updated ${new Date(report.meta.timestamp * 1000).toLocaleString()}`
      }
      actions={<ScanConsole isScanning={isScanning} />}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {/* Health Ring - Hero Card */}
        <div className="col-span-1 md:col-span-2 row-span-2 rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-950/80 to-zinc-900/60 backdrop-blur-sm p-6">
          <HealthRing
            score={report.score.total}
            grade={report.score.grade}
            verdict={report.score.verdict}
            isLoading={isScanning}
          />
        </div>

        {/* Identity Card */}
        <IdentityPanel identity={report.identity} />

        {/* Risk Board */}
        <RiskBoard report={report} className="col-span-1 md:col-span-2" />

        {/* Score Summary */}
        <ScoreSummary score={report.score} />

        {/* Network Protocols */}
        <NetworkProtocols report={report} />

        {/* Action Panel */}
        <ActionPanel
          scanId={report.meta.scan_id}
          onRescan={rescan}
          isScanning={isScanning}
        />

        {/* Leak Panels */}
        <div className="col-span-1 md:col-span-2">
          <LeakPanels report={report} />
        </div>

        {/* Consistency Matrix */}
        <ConsistencyMatrix consistency={report.consistency} />

        {/* Hardware Panel */}
        <HardwarePanel report={report} />

        {/* Software Panel */}
        <SoftwarePanel report={report} />
      </div>
    </PageShell>
  );
}
