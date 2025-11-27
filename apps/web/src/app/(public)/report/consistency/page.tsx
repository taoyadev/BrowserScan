import { ConsistencyMatrix } from '@/components/sections/consistency-matrix';
import { getDemoReport } from '@/lib/report-data';

export const metadata = {
  title: 'Consistency Defense — BrowserScan'
};

export default async function ConsistencyReportPage() {
  const report = await getDemoReport();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Consistency</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Timezone, Language & OS Diff</h1>
        <p className="text-sm text-zinc-400">Cross-compare system hints with IP-derived intelligence.</p>
      </div>
      <ConsistencyMatrix consistency={report.consistency} />
    </div>
  );
}
