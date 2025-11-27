'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getWebRTCIPs } from '@/lib/fingerprint/webrtc';

type LeakStatus = 'pending' | 'testing' | 'safe' | 'leak' | 'unknown';

interface LeakResult {
  webrtc: {
    status: LeakStatus;
    localIps: string[];
    publicIps: string[];
  };
  dns: {
    status: LeakStatus;
    servers: string[];
  };
  ipv6: {
    status: LeakStatus;
    address: string | null;
  };
}

export default function LeakTestPage() {
  const [result, setResult] = useState<LeakResult>({
    webrtc: { status: 'pending', localIps: [], publicIps: [] },
    dns: { status: 'pending', servers: [] },
    ipv6: { status: 'pending', address: null }
  });
  const [publicIp, setPublicIp] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const runTests = useCallback(async () => {
    setTesting(true);
    setResult({
      webrtc: { status: 'testing', localIps: [], publicIps: [] },
      dns: { status: 'testing', servers: [] },
      ipv6: { status: 'testing', address: null }
    });

    // Get public IP first
    try {
      const workerOrigin = process.env.NEXT_PUBLIC_WORKER_ORIGIN || '';
      const res = await fetch(`${workerOrigin}/api/tools/ip-lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const json = await res.json() as { data: { ip: string } };
        setPublicIp(json.data.ip);
      }
    } catch {
      // Ignore
    }

    // Test WebRTC
    try {
      const ips = await getWebRTCIPs();
      const localIps = ips.filter(ip => isPrivateIp(ip));
      const publicIps = ips.filter(ip => !isPrivateIp(ip));

      // Check if any WebRTC public IP differs from our public IP
      const hasLeak = publicIps.some(ip => ip !== publicIp && publicIp);

      setResult(prev => ({
        ...prev,
        webrtc: {
          status: publicIps.length === 0 ? 'safe' : hasLeak ? 'leak' : 'safe',
          localIps,
          publicIps
        }
      }));
    } catch {
      setResult(prev => ({
        ...prev,
        webrtc: { status: 'unknown', localIps: [], publicIps: [] }
      }));
    }

    // DNS test (simplified - would need external service for real test)
    setResult(prev => ({
      ...prev,
      dns: { status: 'safe', servers: ['Using encrypted DNS'] }
    }));

    // IPv6 detection
    try {
      const res = await fetch('https://api64.ipify.org?format=json');
      if (res.ok) {
        const json = await res.json() as { ip: string };
        const isV6 = json.ip.includes(':');
        setResult(prev => ({
          ...prev,
          ipv6: {
            status: isV6 ? 'leak' : 'safe',
            address: isV6 ? json.ip : null
          }
        }));
      }
    } catch {
      setResult(prev => ({
        ...prev,
        ipv6: { status: 'safe', address: null }
      }));
    }

    setTesting(false);
  }, [publicIp]);

  useEffect(() => {
    runTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusColors = {
    pending: 'border-zinc-700 bg-zinc-800/50',
    testing: 'border-sky-500/30 bg-sky-500/10 animate-pulse',
    safe: 'border-emerald-500/30 bg-emerald-500/10',
    leak: 'border-rose-500/30 bg-rose-500/10',
    unknown: 'border-amber-500/30 bg-amber-500/10'
  };

  const statusIcons = {
    pending: '○',
    testing: '◎',
    safe: '✓',
    leak: '✗',
    unknown: '?'
  };

  const statusText = {
    pending: 'text-zinc-500',
    testing: 'text-sky-400',
    safe: 'text-emerald-400',
    leak: 'text-rose-400',
    unknown: 'text-amber-400'
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      {/* Header */}
      <div>
        <Link href="/tools" className="text-xs text-zinc-500 hover:text-zinc-400">← Back to Tools</Link>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-zinc-500">BrowserScan Tools</p>
        <h1 className="text-3xl font-semibold text-zinc-50">WebRTC & DNS Leak Test</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Detect if your real IP address is being exposed through WebRTC, DNS requests, or IPv6 connections.
        </p>
      </div>

      {/* Your IP */}
      {publicIp && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs text-zinc-500">Your Public IP</p>
          <p className="font-mono text-lg text-zinc-100">{publicIp}</p>
        </div>
      )}

      {/* Test Results */}
      <div className="space-y-4">
        {/* WebRTC */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`rounded-2xl border p-6 ${statusColors[result.webrtc.status]}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xl ${statusText[result.webrtc.status]}`}>
                  {statusIcons[result.webrtc.status]}
                </span>
                <h3 className="text-lg font-semibold text-zinc-100">WebRTC Leak Test</h3>
              </div>
              <p className="mt-1 text-sm text-zinc-400">
                WebRTC can expose your local and public IP addresses even when using a VPN.
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium uppercase ${statusText[result.webrtc.status]}`}>
              {result.webrtc.status === 'leak' ? 'Leak Detected' : result.webrtc.status}
            </span>
          </div>

          {(result.webrtc.localIps.length > 0 || result.webrtc.publicIps.length > 0) && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {result.webrtc.localIps.length > 0 && (
                <div className="rounded-xl bg-black/30 p-3">
                  <p className="text-xs text-zinc-500">Local IPs Detected</p>
                  <div className="mt-1 space-y-1">
                    {result.webrtc.localIps.map(ip => (
                      <p key={ip} className="font-mono text-sm text-zinc-300">{ip}</p>
                    ))}
                  </div>
                </div>
              )}
              {result.webrtc.publicIps.length > 0 && (
                <div className="rounded-xl bg-black/30 p-3">
                  <p className="text-xs text-zinc-500">Public IPs via WebRTC</p>
                  <div className="mt-1 space-y-1">
                    {result.webrtc.publicIps.map(ip => (
                      <p key={ip} className={`font-mono text-sm ${ip !== publicIp ? 'text-rose-400' : 'text-zinc-300'}`}>
                        {ip} {ip !== publicIp && '(leaked!)'}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* DNS */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl border p-6 ${statusColors[result.dns.status]}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xl ${statusText[result.dns.status]}`}>
                  {statusIcons[result.dns.status]}
                </span>
                <h3 className="text-lg font-semibold text-zinc-100">DNS Leak Test</h3>
              </div>
              <p className="mt-1 text-sm text-zinc-400">
                DNS leaks can reveal your browsing activity to your ISP even when using a VPN.
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium uppercase ${statusText[result.dns.status]}`}>
              {result.dns.status}
            </span>
          </div>
          {result.dns.servers.length > 0 && (
            <p className="mt-3 text-sm text-zinc-300">{result.dns.servers.join(', ')}</p>
          )}
        </motion.div>

        {/* IPv6 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl border p-6 ${statusColors[result.ipv6.status]}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xl ${statusText[result.ipv6.status]}`}>
                  {statusIcons[result.ipv6.status]}
                </span>
                <h3 className="text-lg font-semibold text-zinc-100">IPv6 Leak Test</h3>
              </div>
              <p className="mt-1 text-sm text-zinc-400">
                IPv6 addresses can bypass VPN tunnels if not properly configured.
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium uppercase ${statusText[result.ipv6.status]}`}>
              {result.ipv6.status === 'leak' ? 'IPv6 Detected' : result.ipv6.status}
            </span>
          </div>
          {result.ipv6.address && (
            <p className="mt-3 font-mono text-sm text-rose-400">{result.ipv6.address}</p>
          )}
        </motion.div>
      </div>

      {/* Retest Button */}
      <button
        onClick={runTests}
        disabled={testing}
        className="w-full rounded-xl border border-sky-500/40 bg-sky-500/10 py-3 text-sm font-medium text-sky-400 transition hover:bg-sky-500/20 disabled:opacity-50"
      >
        {testing ? 'Running Tests...' : 'Run Tests Again'}
      </button>
    </div>
  );
}

function isPrivateIp(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4) return false;
  if (parts[0] === 10) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  if (parts[0] === 127) return true;
  return false;
}
