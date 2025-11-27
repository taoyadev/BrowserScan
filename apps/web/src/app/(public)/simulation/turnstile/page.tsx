'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

type VerifyResult = {
  success: boolean;
  message: string;
  details?: string;
};

export default function TurnstileSimPage() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [verifying, setVerifying] = useState(false);

  async function verify() {
    setVerifying(true);
    setResult(null);

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!token.trim()) {
      setResult({
        success: false,
        message: 'Token Missing',
        details: 'No Turnstile response token provided. Make sure to capture the token from the widget.'
      });
    } else if (token.length < 20) {
      setResult({
        success: false,
        message: 'Invalid Token',
        details: 'Token appears malformed. Valid tokens are typically 200+ characters.'
      });
    } else if (token.startsWith('0.')) {
      setResult({
        success: false,
        message: 'Challenge Failed',
        details: 'This token indicates the challenge was not completed successfully.'
      });
    } else {
      setResult({
        success: true,
        message: 'Token Accepted',
        details: 'Token format is valid. In production, verify with Cloudflare API.'
      });
    }

    setVerifying(false);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      {/* Header */}
      <div>
        <Link href="/simulation" className="text-xs text-zinc-500 hover:text-zinc-400">← Back to Simulations</Link>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-zinc-500">BrowserScan Simulation</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Cloudflare Turnstile Verification</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Test and validate Turnstile response tokens in a sandbox environment. Understand the token format
          and verification flow without connecting to Cloudflare&apos;s servers.
        </p>
      </div>

      {/* Verification Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-950/80 to-zinc-900/40 p-6"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-300">Turnstile Response Token</label>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste cf-turnstile-response token here..."
              rows={4}
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-black/40 px-4 py-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-orange-500/50 focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={verify}
              disabled={verifying}
              className="flex-1 rounded-xl border border-orange-500/40 bg-orange-500/10 py-3 text-sm font-medium text-orange-400 transition hover:bg-orange-500/20 disabled:opacity-50"
            >
              {verifying ? 'Verifying...' : 'Verify Token'}
            </button>
            <button
              onClick={() => { setToken(''); setResult(null); }}
              className="rounded-xl border border-zinc-700 bg-black/40 px-4 py-3 text-sm text-zinc-400 transition hover:border-zinc-600"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 rounded-xl border p-4 ${
              result.success
                ? 'border-emerald-500/30 bg-emerald-500/10'
                : 'border-rose-500/30 bg-rose-500/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`text-lg ${result.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                {result.success ? '✓' : '✗'}
              </span>
              <p className={`font-semibold ${result.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                {result.message}
              </p>
            </div>
            {result.details && (
              <p className="mt-2 text-sm text-zinc-400">{result.details}</p>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Token Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-5">
          <h3 className="text-sm font-semibold text-zinc-100">How to Get Token</h3>
          <ol className="mt-3 space-y-2 text-xs text-zinc-400">
            <li className="flex gap-2">
              <span className="text-orange-400 font-mono">1.</span>
              <span>Embed Turnstile widget on your page</span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-400 font-mono">2.</span>
              <span>Complete the invisible challenge</span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-400 font-mono">3.</span>
              <span>Token appears in hidden input field</span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-400 font-mono">4.</span>
              <span>Copy from cf-turnstile-response</span>
            </li>
          </ol>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-5">
          <h3 className="text-sm font-semibold text-zinc-100">Token Properties</h3>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">Format</span>
              <span className="text-zinc-300">Base64-encoded JWT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Typical Length</span>
              <span className="text-zinc-300">200-300 characters</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Expiration</span>
              <span className="text-zinc-300">300 seconds (5 min)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Single Use</span>
              <span className="text-emerald-400">Yes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Server-side Verification */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        <h3 className="text-sm font-semibold text-zinc-100">Server-Side Verification</h3>
        <p className="mt-2 text-xs text-zinc-500">
          In production, always verify tokens server-side using Cloudflare&apos;s siteverify API:
        </p>
        <pre className="mt-3 rounded-xl bg-zinc-900/80 p-4 font-mono text-xs text-zinc-300 overflow-x-auto">
{`POST https://challenges.cloudflare.com/turnstile/v0/siteverify
Content-Type: application/json

{
  "secret": "YOUR_SECRET_KEY",
  "response": "TOKEN_FROM_CLIENT",
  "remoteip": "USER_IP" // optional
}`}
        </pre>
      </div>
    </div>
  );
}
