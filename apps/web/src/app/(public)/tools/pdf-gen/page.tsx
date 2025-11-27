'use client';

import jsPDF from 'jspdf';
import { sampleReport } from '@/lib/sample-report';

export default function PdfGenPage() {
  function generatePdf() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('BrowserScan Authority Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Scan ID: ${sampleReport.meta.scan_id}`, 14, 30);
    doc.text(`Score: ${sampleReport.score.total} (${sampleReport.score.grade})`, 14, 40);
    doc.save('browserscan-report.pdf');
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Tool</p>
        <h1 className="text-3xl font-semibold text-zinc-50">PDF Generator</h1>
        <p className="text-sm text-zinc-400">Render a white-paper formatted report for audits.</p>
      </div>
      <button onClick={generatePdf} className="rounded-xl border border-emerald-500/40 px-4 py-2 text-sm text-emerald-400">Generate PDF</button>
    </div>
  );
}
