import { NextResponse } from 'next/server';

const workerOrigin = process.env.WORKER_ORIGIN;

export async function POST() {
  if (workerOrigin) {
    try {
      const response = await fetch(`${workerOrigin}/api/scan/start`, { method: 'POST' });
      if (response.ok) {
        return NextResponse.json(await response.json());
      }
    } catch (error) {
      console.error('Worker scan start failed, falling back', error);
    }
  }

  return NextResponse.json({
    status: 'ok',
    data: {
      scan_id: crypto.randomUUID(),
      eta_seconds: 2
    }
  });
}
