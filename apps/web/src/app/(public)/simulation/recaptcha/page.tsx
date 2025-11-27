'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function RecaptchaSimPage() {
  const [score, setScore] = useState(0.7);

  const getScoreColor = (s: number) => {
    if (s >= 0.7) return 'text-emerald-400';
    if (s >= 0.4) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBg = (s: number) => {
    if (s >= 0.7) return 'bg-emerald-500';
    if (s >= 0.4) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getVerdict = (s: number) => {
    if (s >= 0.7) return { label: 'Human', desc: 'High confidence human interaction detected' };
    if (s >= 0.4) return { label: 'Suspicious', desc: 'Mixed signals - may require additional verification' };
    return { label: 'Bot', desc: 'Strong indicators of automated behavior' };
  };

  const verdict = getVerdict(score);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      {/* Header */}
      <div>
        <Link href="/simulation" className="text-xs text-zinc-500 hover:text-zinc-400">← Back to Simulations</Link>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-zinc-500">BrowserScan Simulation</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Google reCAPTCHA v3 Score</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Emulate reCAPTCHA v3 score outputs to understand how Google&apos;s invisible CAPTCHA evaluates visitors.
          Scores range from 0.0 (bot) to 1.0 (human).
        </p>
      </div>

      {/* Score Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-950/80 to-zinc-900/40 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500">Simulated Score</p>
            <p className={`text-5xl font-bold ${getScoreColor(score)}`}>{score.toFixed(1)}</p>
          </div>
          <div className="text-right">
            <p className={`text-lg font-semibold ${getScoreColor(score)}`}>{verdict.label}</p>
            <p className="text-xs text-zinc-500 max-w-[200px]">{verdict.desc}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 h-3 rounded-full bg-zinc-800 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${getScoreBg(score)}`}
            initial={{ width: 0 }}
            animate={{ width: `${score * 100}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>

        {/* Scale Labels */}
        <div className="mt-2 flex justify-between text-xs text-zinc-600">
          <span>0.0 (Bot)</span>
          <span>0.5</span>
          <span>1.0 (Human)</span>
        </div>
      </motion.div>

      {/* Slider Control */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        <label className="text-sm font-medium text-zinc-300">Adjust Score</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={score}
          onChange={(e) => setScore(parseFloat(e.target.value))}
          className="mt-4 w-full h-2 rounded-full bg-zinc-700 appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
        />
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[0.1, 0.5, 0.9].map((preset) => (
            <button
              key={preset}
              onClick={() => setScore(preset)}
              className={`rounded-lg border py-2 text-sm font-medium transition ${
                score === preset
                  ? 'border-sky-500/50 bg-sky-500/10 text-sky-400'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              {preset.toFixed(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Score Interpretation */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        <h3 className="text-sm font-semibold text-zinc-100">Score Interpretation Guide</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-500 mt-1"></span>
            <div>
              <p className="text-sm text-zinc-200">0.7 - 1.0: Human</p>
              <p className="text-xs text-zinc-500">High confidence legitimate user. Allow access without friction.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="h-3 w-3 rounded-full bg-amber-500 mt-1"></span>
            <div>
              <p className="text-sm text-zinc-200">0.4 - 0.6: Suspicious</p>
              <p className="text-xs text-zinc-500">Mixed signals detected. Consider additional verification or monitoring.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="h-3 w-3 rounded-full bg-rose-500 mt-1"></span>
            <div>
              <p className="text-sm text-zinc-200">0.0 - 0.3: Bot</p>
              <p className="text-xs text-zinc-500">Strong automated behavior indicators. Block or challenge aggressively.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Notes */}
      <div className="rounded-xl border border-dashed border-zinc-800 p-4">
        <p className="text-xs text-zinc-500">
          <span className="font-medium text-zinc-400">Note:</span> Real reCAPTCHA v3 scores are generated by Google&apos;s ML models
          analyzing hundreds of signals including mouse movements, typing patterns, browser fingerprint, and historical behavior.
          This simulation is for educational purposes only.
        </p>
      </div>
    </div>
  );
}
