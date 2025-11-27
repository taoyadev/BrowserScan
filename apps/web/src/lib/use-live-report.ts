'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ScanReport } from '@browserscan/types';
import { sampleReport } from './sample-report';
import { useEffect, useRef } from 'react';

const workerOrigin = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_WORKER_ORIGIN || '')
  : '';

/**
 * Fetch a specific scan by ID
 */
async function fetchScan(scanId: string): Promise<ScanReport> {
  const endpoint = workerOrigin ? `${workerOrigin}/api/scan/${scanId}` : `/api/scan/${scanId}`;
  const res = await fetch(endpoint, { cache: 'no-store' });
  if (!res.ok) throw new Error('Scan not found');
  const json = await res.json();
  return json.data as ScanReport;
}

/**
 * Fetch the latest scan (fallback)
 */
async function fetchLatestReport(): Promise<ScanReport> {
  try {
    const endpoint = workerOrigin ? `${workerOrigin}/api/scan/latest` : '/api/scan/latest';
    const res = await fetch(endpoint, { cache: 'no-store' });
    if (!res.ok) throw new Error('Scan not ready');
    const json = await res.json();
    return json.data as ScanReport;
  } catch (error) {
    console.warn('Falling back to sample report', error);
    return sampleReport;
  }
}

/**
 * Start a new scan and collect fingerprints
 */
async function performNewScan(): Promise<ScanReport> {
  // Dynamically import fingerprint module (client-side only)
  const { performScan } = await import('./fingerprint');
  const { report } = await performScan(workerOrigin);
  return report as ScanReport;
}

/**
 * Hook for live report with auto-scan on mount
 */
export function useLiveReport() {
  const queryClient = useQueryClient();
  const hasScannedRef = useRef(false);

  // Mutation for triggering new scan
  const scanMutation = useMutation({
    mutationFn: performNewScan,
    onSuccess: (data) => {
      queryClient.setQueryData(['scan-report'], data);
    },
    onError: (error) => {
      console.error('Scan failed:', error);
    }
  });

  // Query for current report
  const query = useQuery({
    queryKey: ['scan-report'],
    queryFn: fetchLatestReport,
    refetchInterval: 30_000, // Refresh every 30s
    placeholderData: sampleReport,
    staleTime: 10_000
  });

  // Auto-trigger scan on first mount
  useEffect(() => {
    if (!hasScannedRef.current && typeof window !== 'undefined') {
      hasScannedRef.current = true;
      // Small delay to allow page to render first
      const timeout = setTimeout(() => {
        scanMutation.mutate();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [scanMutation]);

  return {
    ...query,
    isScanning: scanMutation.isPending,
    scanError: scanMutation.error,
    rescan: () => scanMutation.mutate()
  };
}

/**
 * Hook to manually trigger a new scan
 */
export function useScanTrigger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: performNewScan,
    onSuccess: (data) => {
      queryClient.setQueryData(['scan-report'], data);
    }
  });
}

/**
 * Hook to fetch a specific scan by ID
 */
export function useScanById(scanId: string | null) {
  return useQuery({
    queryKey: ['scan', scanId],
    queryFn: () => scanId ? fetchScan(scanId) : Promise.reject('No scan ID'),
    enabled: !!scanId,
    placeholderData: sampleReport
  });
}
