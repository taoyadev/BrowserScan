import Link from 'next/link';

export const metadata = {
  title: 'Privacy Whitepaper — BrowserScan',
  description: 'Data handling policies, retention periods, anonymization practices, and compliance commitments.'
};

const retentionPolicies = [
  { data: 'Scan Metadata', period: '30 days', storage: 'Cloudflare D1', encrypted: true },
  { data: 'IP Addresses', period: '30 days', storage: 'Hashed with rotating salt', encrypted: true },
  { data: 'PDF Reports', period: '7 days', storage: 'Cloudflare R2', encrypted: true },
  { data: 'WebRTC/DNS Data', period: '30 days', storage: 'Trimmed before archival', encrypted: true },
  { data: 'Simulation Logs', period: '24 hours', storage: 'In-memory only', encrypted: false }
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      {/* Header */}
      <div>
        <Link href="/knowledge" className="text-xs text-zinc-500 hover:text-zinc-400">← Back to Knowledge</Link>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-zinc-500">Policy Document</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Privacy Whitepaper</h1>
        <p className="mt-2 text-sm text-zinc-400">
          How BrowserScan handles your data with transparency, security, and respect for your privacy.
        </p>
      </div>

      {/* Core Principles */}
      <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-950/80 to-zinc-900/40 p-6">
        <h2 className="text-sm font-semibold text-zinc-100">Core Privacy Principles</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <span className="text-emerald-400 text-lg">✓</span>
            <div>
              <p className="text-sm text-zinc-200">Minimal Collection</p>
              <p className="text-xs text-zinc-500">We only collect data necessary for fingerprint analysis.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-emerald-400 text-lg">✓</span>
            <div>
              <p className="text-sm text-zinc-200">No Third-Party Trackers</p>
              <p className="text-xs text-zinc-500">Zero external analytics, ads, or tracking pixels embedded.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-emerald-400 text-lg">✓</span>
            <div>
              <p className="text-sm text-zinc-200">Auto-Deletion</p>
              <p className="text-xs text-zinc-500">All data automatically purged according to retention schedule.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Retention Table */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 overflow-hidden">
        <div className="border-b border-zinc-800 p-4">
          <h2 className="text-sm font-semibold text-zinc-100">Data Retention Schedule</h2>
          <p className="text-xs text-zinc-500 mt-1">
            All data is automatically deleted when the retention period expires.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Data Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Retention</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Storage</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-zinc-400">Encrypted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {retentionPolicies.map((policy) => (
                <tr key={policy.data} className="hover:bg-zinc-900/30">
                  <td className="px-4 py-3 text-sm text-zinc-200">{policy.data}</td>
                  <td className="px-4 py-3 text-sm text-amber-400 font-mono">{policy.period}</td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{policy.storage}</td>
                  <td className="px-4 py-3 text-center">
                    {policy.encrypted ? (
                      <span className="text-emerald-400">✓</span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Handling */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        <h2 className="text-sm font-semibold text-zinc-100">How We Handle Your Data</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs text-sky-400">1</div>
            <div>
              <p className="text-sm text-zinc-200">IP Address Anonymization</p>
              <p className="text-xs text-zinc-500">
                IP addresses are hashed using rotating salts before storage. The original IP is never stored in plain text.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs text-sky-400">2</div>
            <div>
              <p className="text-sm text-zinc-200">WebRTC/DNS Data Trimming</p>
              <p className="text-xs text-zinc-500">
                Leak detection data is sanitized and trimmed before archival. Only detection results are stored, not raw data.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs text-sky-400">3</div>
            <div>
              <p className="text-sm text-zinc-200">Fingerprint Hashing</p>
              <p className="text-xs text-zinc-500">
                Canvas, WebGL, and audio fingerprints are stored as cryptographic hashes, not raw images or data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
          <h3 className="text-sm font-semibold text-zinc-100">Security Measures</h3>
          <ul className="mt-4 space-y-2 text-xs text-zinc-400">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Turnstile tokens verified server-side only
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              All data encrypted at rest and in transit
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Cloudflare edge security and DDoS protection
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              No cookies for tracking purposes
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
          <h3 className="text-sm font-semibold text-zinc-100">What We Don&apos;t Do</h3>
          <ul className="mt-4 space-y-2 text-xs text-zinc-400">
            <li className="flex items-center gap-2">
              <span className="text-rose-400">✗</span>
              Sell or share data with third parties
            </li>
            <li className="flex items-center gap-2">
              <span className="text-rose-400">✗</span>
              Use external analytics or tracking
            </li>
            <li className="flex items-center gap-2">
              <span className="text-rose-400">✗</span>
              Create advertising profiles
            </li>
            <li className="flex items-center gap-2">
              <span className="text-rose-400">✗</span>
              Store data longer than necessary
            </li>
          </ul>
        </div>
      </div>

      {/* Infrastructure */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        <h2 className="text-sm font-semibold text-zinc-100">Infrastructure</h2>
        <p className="mt-2 text-xs text-zinc-500">
          BrowserScan runs entirely on Cloudflare&apos;s global edge network.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-zinc-900/50 p-4 text-center">
            <p className="text-sm font-semibold text-zinc-200">Cloudflare Workers</p>
            <p className="text-xs text-zinc-500">Serverless compute</p>
          </div>
          <div className="rounded-xl bg-zinc-900/50 p-4 text-center">
            <p className="text-sm font-semibold text-zinc-200">Cloudflare D1</p>
            <p className="text-xs text-zinc-500">SQLite database</p>
          </div>
          <div className="rounded-xl bg-zinc-900/50 p-4 text-center">
            <p className="text-sm font-semibold text-zinc-200">Cloudflare R2</p>
            <p className="text-xs text-zinc-500">Object storage</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-xl border border-dashed border-zinc-800 p-4">
        <p className="text-xs text-zinc-500">
          <span className="font-medium text-zinc-400">Data Requests:</span> For data deletion requests
          or questions about your data, please contact us through our GitHub repository. We respond
          to all legitimate requests within 30 days.
        </p>
      </div>
    </div>
  );
}
