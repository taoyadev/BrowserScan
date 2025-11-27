import { SoftwarePanel } from '@/components/sections/software-panel';
import { ConsistencyMatrix } from '@/components/sections/consistency-matrix';
import { getDemoReport } from '@/lib/report-data';

export const metadata = {
  title: 'Software Surface — BrowserScan'
};

export default async function SoftwareReportPage() {
  const report = await getDemoReport();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Software Layer</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Fonts, Locale & Navigator</h1>
        <p className="text-sm text-zinc-400">Locale hints, language matrix, and font hash analysis.</p>
      </div>
      <SoftwarePanel report={report} />
      <ConsistencyMatrix consistency={report.consistency} />
    </div>
  );
}
