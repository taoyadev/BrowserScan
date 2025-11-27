'use client';

import { useState } from 'react';

export default function TurnstileSimPage() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<string | null>(null);

  async function verify() {
    // placeholder request
    const res = token ? 'ACCEPTED' : 'MISSING';
    setResult(res);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Simulation</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Cloudflare Turnstile Verification</h1>
        <p className="text-sm text-zinc-400">Provide a response token captured from Turnstile widget to validate against the Worker.</p>
      </div>
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6 space-y-4">
        <input
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="Paste cf-turnstile-response"
          className="w-full rounded-xl border border-zinc-700 bg-black/40 px-4 py-3 font-mono text-xs text-zinc-200"
        />
        <button onClick={verify} className="rounded-xl border border-emerald-500/40 px-4 py-2 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/10">
          Verify token
        </button>
        {result && <p className="text-xs text-zinc-400">Result: {result}</p>}
      </div>
    </div>
  );
}
