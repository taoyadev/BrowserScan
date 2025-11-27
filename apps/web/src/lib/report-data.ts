import type { ScanReport } from '@browserscan/types';
import { sampleReport } from './sample-report';

export async function getDemoReport(): Promise<ScanReport> {
  // Placeholder until the worker endpoints are available
  return sampleReport;
}
