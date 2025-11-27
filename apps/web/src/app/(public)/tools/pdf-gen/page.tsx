'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLiveReport } from '@/lib/use-live-report';

export default function PdfGenPage() {
  const { data: report } = useLiveReport();
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  async function generatePdf() {
    if (!report) return;

    setGenerating(true);
    try {
      const workerOrigin = process.env.NEXT_PUBLIC_WORKER_ORIGIN || '';
      const response = await fetch(`${workerOrigin}/api/scan/${report.meta.scan_id}/pdf`, {
        method: 'POST'
      });

      if (response.ok) {
        // Open the HTML report in new tab for printing
        const html = await response.text();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setGenerated(true);
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      {/* Header */}
      <div>
        <Link href="/tools" className="text-xs text-zinc-500 hover:text-zinc-400">← Back to Tools</Link>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-zinc-500">BrowserScan Tools</p>
        <h1 className="text-3xl font-semibold text-zinc-50">PDF Report Generator</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Export your browser fingerprint analysis as a professional PDF report suitable for audits and documentation.
        </p>
      </div>

      {/* Report Preview Card */}
      {report && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-950/80 to-zinc-900/40 p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-zinc-500">Current Scan Report</p>
              <p className="mt-1 font-mono text-sm text-zinc-300">#{report.meta.scan_id.slice(0, 12)}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-zinc-100">{report.score.total}</p>
              <p className={`text-sm font-medium ${
                report.score.grade.startsWith('A') ? 'text-emerald-400' :
                report.score.grade.startsWith('B') ? 'text-sky-400' :
                report.score.grade.startsWith('C') ? 'text-amber-400' : 'text-rose-400'
              }`}>
                Grade {report.score.grade}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-black/30 p-4">
              <p className="text-xs text-zinc-500">Identity</p>
              <p className="mt-1 font-mono text-xs text-zinc-300 truncate">{report.identity.ip}</p>
              <p className="text-xs text-zinc-500 truncate">{report.identity.browser}</p>
            </div>
            <div className="rounded-xl bg-black/30 p-4">
              <p className="text-xs text-zinc-500">Location</p>
              <p className="mt-1 text-sm text-zinc-300">{report.identity.location}</p>
            </div>
            <div className="rounded-xl bg-black/30 p-4">
              <p className="text-xs text-zinc-500">Timestamp</p>
              <p className="mt-1 text-sm text-zinc-300">
                {new Date(report.meta.timestamp * 1000).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={generatePdf}
              disabled={generating}
              className="flex-1 rounded-xl border border-sky-500/40 bg-sky-500/10 py-3 text-sm font-medium text-sky-400 transition hover:bg-sky-500/20 disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate PDF Report'}
            </button>
          </div>

          {generated && (
            <p className="mt-4 text-center text-sm text-emerald-400">
              Report opened in new tab. Use your browser&apos;s print function to save as PDF.
            </p>
          )}
        </motion.div>
      )}

      {/* Report Contents */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        <h3 className="text-sm font-semibold text-zinc-100">What&apos;s Included</h3>
        <ul className="mt-4 space-y-3 text-sm text-zinc-400">
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            Trust score with detailed breakdown
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            IP intelligence and geolocation data
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            Browser and device fingerprints
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            WebRTC and DNS leak detection results
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            Consistency check analysis
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            Risk assessment and recommendations
          </li>
        </ul>
      </div>
    </div>
  );
}
