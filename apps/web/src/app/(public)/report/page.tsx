import Link from 'next/link';

export const metadata = {
  title: 'BrowserScan Deep Report'
};

export default function ReportIndexPage() {
  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Deep Dive</p>
      <h1 className="text-3xl font-semibold text-zinc-50">Deep Detection Report</h1>
      <p className="text-sm text-zinc-400">
        Navigate to Network, Hardware, Software, or Consistency sections for forensic evidence supporting the BrowserScan authority score.
      </p>
      <Link href="/report/network" className="inline-flex items-center gap-2 text-emerald-400">
        Go to Network intelligence →
      </Link>
    </div>
  );
}
