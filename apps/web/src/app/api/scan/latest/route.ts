import { NextResponse } from 'next/server';
import { sampleReport } from '@/lib/sample-report';

const workerOrigin = process.env.WORKER_ORIGIN;

export async function GET() {
  if (workerOrigin) {
    try {
      const response = await fetch(`${workerOrigin}/api/scan/latest`);
      if (response.ok) {
        return NextResponse.json(await response.json());
      }
    } catch (error) {
      console.error('Worker fetch failed, serving sample', error);
    }
  }

  return NextResponse.json({ status: 'ok', data: sampleReport });
}
