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
          onClick={handleExportPdf}
          disabled={!scanId}
          className="flex w-full items-center justify-between rounded-xl border border-white/5 px-4 py-3 text-sm text-zinc-200 transition hover:border-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Export PDF
          <span className="text-emerald-400">→</span>
        </button>

        {/* Share Link */}
        <button
          onClick={handleShare}
          disabled={!scanId}
          className="flex w-full items-center justify-between rounded-xl border border-white/5 px-4 py-3 text-sm text-zinc-200 transition hover:border-sky-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Share Link
          <span className="text-sky-400">→</span>
        </button>

        {/* Re-Scan */}
        <button
          onClick={handleRescan}
          disabled={isScanning}
          className="flex w-full items-center justify-between rounded-xl border border-white/5 px-4 py-3 text-sm text-zinc-200 transition hover:border-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isScanning ? 'Scanning...' : 'Re-Scan'}
          <span className="text-amber-400">{isScanning ? '⟳' : '→'}</span>
        </button>

        {/* Link to Tools */}
        <Link
          href="/tools"
          className="flex w-full items-center justify-between rounded-xl border border-white/5 px-4 py-3 text-sm text-zinc-200 transition hover:border-zinc-500/40"
        >
          More Tools
          <span className="text-zinc-400">→</span>
        </Link>
      </div>
    </Card>
  );
}
