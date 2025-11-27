'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface IpIntelResult {
  ip: string;
  asn: string;
  org: string;
  country: string;
  country_code: string;
  region: string;
  city: string;
  timezone: string;
  is_proxy: boolean;
  is_vpn: boolean;
  is_tor: boolean;
  is_hosting: boolean;
  fraud_score: number;
  coordinates: { lat: number; lon: number } | null;
}

export default function IpLookupPage() {
  const [ip, setIp] = useState('');
  const [result, setResult] = useState<IpIntelResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup() {
    setLoading(true);
    setError(null);
    try {
      const workerOrigin = process.env.NEXT_PUBLIC_WORKER_ORIGIN || '';
      const res = await fetch(`${workerOrigin}/api/tools/ip-lookup`, {
        method: 'POST',
        body: JSON.stringify({ ip: ip || undefined }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Lookup failed');
      const json = await res.json() as { data: IpIntelResult };
      setResult(json.data);
    } catch {
      setError('Failed to lookup IP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const riskLevel = result
    ? result.fraud_score >= 70 ? 'high' : result.fraud_score >= 40 ? 'medium' : 'low'
    : null;

  const riskColors = {
    high: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      {/* Header */}
      <div>
        <Link href="/tools" className="text-xs text-zinc-500 hover:text-zinc-400">← Back to Tools</Link>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-zinc-500">BrowserScan Tools</p>
        <h1 className="text-3xl font-semibold text-zinc-50">IP Intelligence Lookup</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Query detailed information about any IP address including geolocation, ASN, proxy detection, and fraud scoring.
        </p>
      </div>

      {/* Input Section */}
      <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-950/80 to-zinc-900/40 p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && lookup()}
            placeholder="Enter IP address (leave empty for your IP)"
            className="flex-1 rounded-xl border border-zinc-700 bg-black/40 px-4 py-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
          />
          <button
            onClick={lookup}
            disabled={loading}
            className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-3 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50"
          >
            {loading ? 'Looking up...' : 'Lookup IP'}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Risk Score Card */}
          <div className={`rounded-2xl border p-6 ${riskColors[riskLevel!]}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide opacity-70">Fraud Risk Score</p>
                <p className="text-4xl font-bold">{result.fraud_score}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium capitalize">{riskLevel} Risk</p>
                <div className="mt-2 flex gap-2">
                  {result.is_proxy && <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">Proxy</span>}
                  {result.is_vpn && <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">VPN</span>}
                  {result.is_tor && <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">Tor</span>}
                  {result.is_hosting && <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">Hosting</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Location */}
            <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-5">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Location</p>
              <div className="mt-3 space-y-2">
                <Row label="IP Address" value={result.ip} mono />
                <Row label="Country" value={`${result.country} (${result.country_code})`} />
                <Row label="Region" value={result.region || 'N/A'} />
                <Row label="City" value={result.city || 'N/A'} />
                <Row label="Timezone" value={result.timezone || 'N/A'} />
                {result.coordinates && (
                  <Row label="Coordinates" value={`${result.coordinates.lat}, ${result.coordinates.lon}`} mono />
                )}
              </div>
            </div>

            {/* Network */}
            <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-5">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Network</p>
              <div className="mt-3 space-y-2">
                <Row label="ASN" value={result.asn} mono />
                <Row label="Organization" value={result.org || 'N/A'} />
                <Row label="Proxy Detected" value={result.is_proxy ? 'Yes' : 'No'} status={!result.is_proxy} />
                <Row label="VPN Detected" value={result.is_vpn ? 'Yes' : 'No'} status={!result.is_vpn} />
                <Row label="Tor Exit Node" value={result.is_tor ? 'Yes' : 'No'} status={!result.is_tor} />
                <Row label="Hosting/DC" value={result.is_hosting ? 'Yes' : 'No'} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-10 text-center">
          <p className="text-zinc-500">Enter an IP address above to get started</p>
          <p className="mt-1 text-xs text-zinc-600">Leave empty to lookup your current IP</p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, mono, status }: { label: string; value: string; mono?: boolean; status?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-500">{label}</span>
      <span className={`${mono ? 'font-mono' : ''} ${status !== undefined ? (status ? 'text-emerald-400' : 'text-rose-400') : 'text-zinc-200'}`}>
        {value}
      </span>
    </div>
  );
}
