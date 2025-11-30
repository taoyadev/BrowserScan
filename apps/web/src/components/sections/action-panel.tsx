'use client';

import Link from 'next/link';
import { Card, CardTitle } from '@/components/ui/card';

interface ActionPanelProps {
  scanId?: string;
  onRescan?: () => void;
  isScanning?: boolean;
}

export function ActionPanel({ scanId, onRescan, isScanning }: ActionPanelProps) {
  const handleRescan = () => {
    if (onRescan && !isScanning) {
      onRescan();
    }
  };

  const handleExportPdf = async () => {
    if (!scanId) return;

    // Open PDF report in new tab
    window.open(`/api/scan/${scanId}/pdf`, '_blank');
  };

  const handleShare = async () => {
    if (!scanId) return;

    const shareUrl = `${window.location.origin}/report?id=${scanId}`;

    // Try native share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BrowserScan Report',
          text: 'Check out my browser fingerprint analysis',
          url: shareUrl
        });
        return;
      } catch {
        // Fall back to clipboard
      }
    }

    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } catch {
      // Manual fallback
      prompt('Copy this link:', shareUrl);
    }
  };

  return (
    <Card className="col-span-1">
      <CardTitle>Actions</CardTitle>
      <div className="mt-4 space-y-3">
        {/* Export PDF */}
        <button
          type="button"
          onClick={handleExportPdf}
          disabled={!scanId}
          className="flex w-full items-center justify-between rounded-xl border border-white/5 px-4 py-3 text-sm text-zinc-200 transition hover:border-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        >
          Export PDF
          <span className="text-emerald-400" aria-hidden="true">→</span>
        </button>

        {/* Share Link */}
        <button
          type="button"
          onClick={handleShare}
          disabled={!scanId}
          className="flex w-full items-center justify-between rounded-xl border border-white/5 px-4 py-3 text-sm text-zinc-200 transition hover:border-sky-500/40 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        >
          Share Link
          <span className="text-sky-400" aria-hidden="true">→</span>
        </button>

        {/* Re-Scan */}
        <button
          type="button"
          onClick={handleRescan}
          disabled={isScanning}
          className="flex w-full items-center justify-between rounded-xl border border-white/5 px-4 py-3 text-sm text-zinc-200 transition hover:border-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        >
          {isScanning ? 'Scanning...' : 'Re-Scan'}
          <span className="text-amber-400" aria-hidden="true">{isScanning ? '⟳' : '→'}</span>
        </button>

        {/* Link to Tools */}
        <Link
          href="/tools"
          className="flex w-full items-center justify-between rounded-xl border border-white/5 px-4 py-3 text-sm text-zinc-200 transition hover:border-zinc-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        >
          More Tools
          <span className="text-zinc-400" aria-hidden="true">→</span>
        </Link>
      </div>
    </Card>
  );
}
