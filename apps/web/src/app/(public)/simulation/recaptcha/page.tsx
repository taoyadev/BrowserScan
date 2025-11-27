'use client';

import { useState } from 'react';

export default function RecaptchaSimPage() {
  const [score, setScore] = useState(0.3);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Simulation</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Google reCAPTCHA v3 Score</h1>
        <p className="text-sm text-zinc-400">Use the slider to emulate v3 responses and preview BrowserScan deductions.</p>
      </div>
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        <label className="text-sm text-zinc-400">Score {score.toFixed(1)}</label>
        <input
          type="range"
          min={0.1}
          max={0.9}
          step={0.1}
          value={score}
          onChange={(event) => setScore(parseFloat(event.target.value))}
          className="mt-4 w-full"
        />
        <p className="mt-3 text-xs text-zinc-500">Score &lt; 0.3 triggers bot deduction.</p>
      </div>
    </div>
  );
}
