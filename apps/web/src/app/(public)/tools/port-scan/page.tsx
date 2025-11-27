'use client';

import { useState } from 'react';

const TARGET_PORTS = [22, 80, 443, 3389, 8080];

type PortStatus = Record<number, 'open' | 'filtered' | 'closed'>;

export default function PortScanPage() {
  const [status, setStatus] = useState<PortStatus>({});

  async function scan() {
    const simulated: PortStatus = {
      22: 'open',
      80: 'open',
      443: 'open',
      3389: 'closed',
      8080: 'filtered'
    };
    setStatus(simulated);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Tool</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Port Scan</h1>
      </div>
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6 space-y-4">
        <button onClick={scan} className="rounded-xl border border-amber-500/40 px-4 py-2 text-sm text-amber-400">
          Start Scan
        </button>
        <div className="grid gap-2">
          {TARGET_PORTS.map((port) => (
            <div key={port} className="flex items-center justify-between rounded-xl border border-white/5 px-4 py-2 text-sm text-zinc-300">
              <span>Port {port}</span>
              <span className="font-mono text-xs">{status[port] ?? 'pending'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
