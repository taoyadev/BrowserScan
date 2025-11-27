import Link from 'next/link';

export const metadata = {
  title: 'Scoring Methodology — BrowserScan',
  description: 'Technical documentation of the BrowserScan trust score algorithm and detection coverage.'
};

const rules = [
  { check: 'IP Risk', condition: 'fraud_score > 75 or proxy detected', deduction: 20, category: 'Network' },
  { check: 'WebRTC Leak', condition: 'candidate IP differs from remote', deduction: 25, category: 'Leak' },
  { check: 'DNS Leak', condition: 'DNS resolver location mismatch', deduction: 15, category: 'Leak' },
  { check: 'Timezone', condition: 'IP timezone mismatches system', deduction: 15, category: 'Consistency' },
  { check: 'OS Consistency', condition: 'UA OS ≠ TCP/WebGL OS', deduction: 15, category: 'Consistency' },
  { check: 'Language', condition: 'IP country not in Accept-Language', deduction: 5, category: 'Consistency' },
  { check: 'Open Ports', condition: 'Critical ports (22/3389) exposed', deduction: 10, category: 'Network' },
  { check: 'Bot Check', condition: 'webdriver/headless markers', deduction: 30, category: 'Automation' },
  { check: 'Canvas Anomaly', condition: 'Spoofed or blocked canvas', deduction: 10, category: 'Fingerprint' },
  { check: 'WebGL Mismatch', condition: 'GPU vendor inconsistent', deduction: 10, category: 'Fingerprint' }
];

const categoryColors: Record<string, string> = {
  Network: 'bg-emerald-500/10 text-emerald-400',
  Leak: 'bg-rose-500/10 text-rose-400',
  Consistency: 'bg-amber-500/10 text-amber-400',
  Automation: 'bg-violet-500/10 text-violet-400',
  Fingerprint: 'bg-sky-500/10 text-sky-400'
};

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      {/* Header */}
      <div>
        <Link href="/knowledge" className="text-xs text-zinc-500 hover:text-zinc-400">← Back to Knowledge</Link>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-zinc-500">Technical Documentation</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Scoring Methodology</h1>
        <p className="mt-2 text-sm text-zinc-400">
          The BrowserScan Trust Score begins at 100 and applies deterministic deductions based on
          layered telemetry across network, fingerprint, and behavioral signals.
        </p>
      </div>

      {/* Score Overview */}
      <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-950/80 to-zinc-900/40 p-6">
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">100</p>
            <p className="text-xs text-zinc-500">Starting Score</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-sky-400">A+</p>
            <p className="text-xs text-zinc-500">90-100 Grade</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-400">C</p>
            <p className="text-xs text-zinc-500">50-69 Grade</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-rose-400">F</p>
            <p className="text-xs text-zinc-500">&lt;50 Grade</p>
          </div>
        </div>
      </div>

      {/* Detection Rules Table */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 overflow-hidden">
        <div className="border-b border-zinc-800 p-4">
          <h2 className="text-sm font-semibold text-zinc-100">Deduction Rules</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Each rule is evaluated independently. Multiple violations stack.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Check</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Condition</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {rules.map((rule) => (
                <tr key={rule.check} className="hover:bg-zinc-900/30">
                  <td className="px-4 py-3 text-sm text-zinc-200">{rule.check}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${categoryColors[rule.category]}`}>
                      {rule.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500 font-mono">{rule.condition}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-rose-400">-{rule.deduction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Flow */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        <h2 className="text-sm font-semibold text-zinc-100">Data Flow Architecture</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-zinc-900/50 p-4">
            <p className="text-xs font-medium text-emerald-400">1. Edge Enrichment</p>
            <p className="mt-2 text-xs text-zinc-500">
              Cloudflare Worker enriches requests with cf data (ASN, country, city, TLS fingerprint).
            </p>
          </div>
          <div className="rounded-xl bg-zinc-900/50 p-4">
            <p className="text-xs font-medium text-sky-400">2. Client Collection</p>
            <p className="mt-2 text-xs text-zinc-500">
              Browser uploads fingerprint payload (Canvas, WebGL, Audio, Fonts, WebRTC).
            </p>
          </div>
          <div className="rounded-xl bg-zinc-900/50 p-4">
            <p className="text-xs font-medium text-violet-400">3. Processing</p>
            <p className="mt-2 text-xs text-zinc-500">
              Worker persists to D1 database and emits PDF job to R2 storage.
            </p>
          </div>
          <div className="rounded-xl bg-zinc-900/50 p-4">
            <p className="text-xs font-medium text-amber-400">4. Delivery</p>
            <p className="mt-2 text-xs text-zinc-500">
              Frontend consumes JSON schema for real-time dashboard updates.
            </p>
          </div>
        </div>
      </div>

      {/* Grade Scale */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        <h2 className="text-sm font-semibold text-zinc-100">Grade Scale</h2>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-8 text-sm font-bold text-emerald-400">A+</span>
            <div className="flex-1 h-2 rounded-full bg-zinc-800">
              <div className="h-full w-full rounded-full bg-emerald-500"></div>
            </div>
            <span className="text-xs text-zinc-500">95-100 — Excellent</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 text-sm font-bold text-emerald-400">A</span>
            <div className="flex-1 h-2 rounded-full bg-zinc-800">
              <div className="h-full w-[90%] rounded-full bg-emerald-500"></div>
            </div>
            <span className="text-xs text-zinc-500">90-94 — Great</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 text-sm font-bold text-sky-400">B</span>
            <div className="flex-1 h-2 rounded-full bg-zinc-800">
              <div className="h-full w-[80%] rounded-full bg-sky-500"></div>
            </div>
            <span className="text-xs text-zinc-500">70-89 — Good</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 text-sm font-bold text-amber-400">C</span>
            <div className="flex-1 h-2 rounded-full bg-zinc-800">
              <div className="h-full w-[60%] rounded-full bg-amber-500"></div>
            </div>
            <span className="text-xs text-zinc-500">50-69 — Fair</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 text-sm font-bold text-rose-400">F</span>
            <div className="flex-1 h-2 rounded-full bg-zinc-800">
              <div className="h-full w-[40%] rounded-full bg-rose-500"></div>
            </div>
            <span className="text-xs text-zinc-500">&lt;50 — Poor</span>
          </div>
        </div>
      </div>

      {/* Technical Notes */}
      <div className="rounded-xl border border-dashed border-zinc-800 p-4">
        <p className="text-xs text-zinc-500">
          <span className="font-medium text-zinc-400">Note:</span> The scoring algorithm is deterministic
          and reproducible. The same browser configuration will always produce the same score.
          Updates to the algorithm are versioned and documented.
        </p>
      </div>
    </div>
  );
}
