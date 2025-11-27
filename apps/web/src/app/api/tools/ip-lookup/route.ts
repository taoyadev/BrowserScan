import { NextResponse } from 'next/server';

export const runtime = 'edge';

const workerOrigin = process.env.WORKER_ORIGIN;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<{ ip: string }>;
  const ip = body.ip ?? '8.8.8.8';

  if (workerOrigin) {
    try {
      const response = await fetch(`${workerOrigin}/api/tools/ip-lookup`, {
        method: 'POST',
        body: JSON.stringify({ ip }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        return NextResponse.json(await response.json());
      }
    } catch (error) {
      console.error('Worker ip lookup failed, using fallback', error);
    }
  }

  return NextResponse.json({
    status: 'ok',
    data: {
      ip,
      country: 'US',
      asn: 'AS13335 Cloudflare',
      fraud_score: ip.startsWith('64.') ? 85 : 12
    }
  });
}
