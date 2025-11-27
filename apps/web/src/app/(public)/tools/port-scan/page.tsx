'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PortResult {
  port: number;
  service: string;
  status: 'open' | 'closed' | 'filtered' | 'pending';
  risk: 'high' | 'medium' | 'low' | 'none';
}

const TARGET_PORTS: PortResult[] = [
  { port: 21, service: 'FTP', status: 'pending', risk: 'high' },
  { port: 22, service: 'SSH', status: 'pending', risk: 'medium' },
  { port: 23, service: 'Telnet', status: 'pending', risk: 'high' },
  { port: 80, service: 'HTTP', status: 'pending', risk: 'low' },
  { port: 443, service: 'HTTPS', status: 'pending', risk: 'none' },
  { port: 3306, service: 'MySQL', status: 'pending', risk: 'high' },
  { port: 3389, service: 'RDP', status: 'pending', risk: 'high' },
  { port: 5432, service: 'PostgreSQL', status: 'pending', risk: 'high' },
  { port: 8080, service: 'HTTP-Alt', status: 'pending', risk: 'low' },
  { port: 8443, service: 'HTTPS-Alt', status: 'pending', risk: 'low' }
];

export default function PortScanPage() {
  const [results, setResults] = useState<PortResult[]>(TARGET_PORTS);
  const [scanning, setScanning] = useState(false);
  const [targetIp, setTargetIp] = useState('');

  async function scan() {
    setScanning(true);

    // Simulate progressive scanning
    for (let i = 0; i < results.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setResults(prev => prev.map((p, idx) => {
        if (idx === i) {
          // Simulate random results
          const statuses: ('open' | 'closed' | 'filtered')[] = ['open', 'closed', 'closed', 'closed', 'filtered'];
          return { ...p, status: statuses[Math.floor(Math.random() * statuses.length)] };
        }
        return p;
      }));
    }

    setScanning(false);
  }

  const statusColors = {
    open: 'text-rose-400 bg-rose-500/10',
    closed: 'text-emerald-400 bg-emerald-500/10',
    filtered: 'text-amber-400 bg-amber-500/10',
    pending: 'text-zinc-500 bg-zinc-800/50'
  };

  const riskColors = {
    high: 'text-rose-400',
    medium: 'text-amber-400',
    low: 'text-sky-400',
    none: 'text-zinc-500'
  };

  const openPorts = results.filter(p => p.status === 'open');

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      {/* Header */}
      <div>
        <Link href="/tools" className="text-xs text-zinc-500 hover:text-zinc-400">← Back to Tools</Link>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-zinc-500">BrowserScan Tools</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Port Scanner</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Check common service ports for exposure status. Identifies potentially risky open ports on your network.
        </p>
      </div>

      {/* Input Section */}
      <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-950/80 to-zinc-900/40 p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            value={targetIp}
            onChange={(e) => setTargetIp(e.target.value)}
            placeholder="Target IP (leave empty for your IP)"
            className="flex-1 rounded-xl border border-zinc-700 bg-black/40 px-4 py-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none"
          />
          <button
            onClick={scan}
            disabled={scanning}
            className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-6 py-3 text-sm font-medium text-amber-400 transition hover:bg-amber-500/20 disabled:opacity-50"
          >
            {scanning ? 'Scanning...' : 'Start Scan'}
          </button>
        </div>
        <p className="mt-3 text-xs text-zinc-600">
          Note: Browser-based port scanning has limitations. For accurate results, use dedicated tools like nmap.
        </p>
      </div>

      {/* Summary */}
      {openPorts.length > 0 && !scanning && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4"
        >
          <p className="text-sm text-rose-400">
            <span className="font-semibold">{openPorts.length} open port(s)</span> detected.
            {openPorts.some(p => p.risk === 'high') && ' Some may pose security risks.'}
          </p>
        </motion.div>
      )}

      {/* Port Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {results.map((port, index) => (
          <motion.div
            key={port.port}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center justify-between rounded-xl border border-zinc-800/80 bg-black/40 px-5 py-4 ${
              scanning && port.status === 'pending' ? 'animate-pulse' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="font-mono text-lg font-semibold text-zinc-100">{port.port}</p>
                <p className="text-xs text-zinc-500">{port.service}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {port.status !== 'pending' && port.status !== 'closed' && (
                <span className={`text-xs ${riskColors[port.risk]}`}>
                  {port.risk !== 'none' && `${port.risk} risk`}
                </span>
              )}
              <span className={`rounded-full px-3 py-1 text-xs font-medium uppercase ${statusColors[port.status]}`}>
                {port.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
        <span><span className="inline-block h-2 w-2 rounded-full bg-rose-500"></span> Open - Service accessible</span>
        <span><span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span> Closed - No service</span>
        <span><span className="inline-block h-2 w-2 rounded-full bg-amber-500"></span> Filtered - Firewall blocked</span>
      </div>
    </div>
  );
}
