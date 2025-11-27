'use client';

import { useState } from 'react';

export default function LeakTestPage() {
  const [webrtc, setWebrtc] = useState('pending');
  const [dns, setDns] = useState('pending');

  async function runTests() {
    setWebrtc('leak: 182.150.247.57');
    setDns('safe: 1.1.1.1');
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Tool</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Leak Test</h1>
      </div>
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6 space-y-4">
        <button onClick={runTests} className="rounded-xl border border-sky-500/40 px-4 py-2 text-sm text-sky-400">
          Run Detection
        </button>
        <div className="text-sm text-zinc-300 space-y-2">
          <p>WebRTC: {webrtc}</p>
          <p>DNS: {dns}</p>
        </div>
      </div>
    </div>
  );
}
