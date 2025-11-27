'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const simulations = [
  {
    href: '/simulation/recaptcha',
    title: 'reCAPTCHA v3 Emulator',
    desc: 'Tune Google score outputs (0.1-0.9) to benchmark anti-bot posture and understand scoring thresholds.',
    icon: '🤖',
    color: 'border-sky-500/30 hover:border-sky-500/50',
    badge: 'Interactive'
  },
  {
    href: '/simulation/turnstile',
    title: 'Cloudflare Turnstile',
    desc: 'Validate Turnstile response tokens and test CAPTCHA bypass detection in a safe sandbox.',
    icon: '🛡️',
    color: 'border-orange-500/30 hover:border-orange-500/50',
    badge: 'Token Verify'
  },
  {
    href: '/simulation/behavior',
    title: 'Behavioral Telemetry',
    desc: 'Mouse trajectory entropy analysis, dwell-time heuristics, and bot pattern detection.',
    icon: '🖱️',
    color: 'border-emerald-500/30 hover:border-emerald-500/50',
    badge: 'Real-time'
  }
];

export default function SimulationIndexPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      {/* Header */}
      <div>
        <Link href="/tools" className="text-xs text-zinc-500 hover:text-zinc-400">← Back to Tools</Link>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-zinc-500">BrowserScan Lab</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Bot Detection Simulation</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Test and rehearse detection signals in a safe sandbox environment before production deployment.
          Understand how anti-bot systems evaluate browser behavior.
        </p>
      </div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"
      >
        <p className="text-sm text-amber-400">
          <span className="font-semibold">Lab Environment</span> — These simulations run locally in your browser.
          No data is sent to external servers. Use these tools to understand how detection systems work.
        </p>
      </motion.div>

      {/* Simulation Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {simulations.map((sim, index) => (
          <motion.div
            key={sim.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={sim.href}
              className={`block rounded-2xl border bg-black/40 p-5 transition hover:-translate-y-1 hover:bg-black/60 ${sim.color}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{sim.icon}</span>
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                  {sim.badge}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold text-zinc-100">{sim.title}</p>
              <p className="mt-1 text-xs text-zinc-500">{sim.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* How It Works */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        <h3 className="text-sm font-semibold text-zinc-100">How Detection Works</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs font-medium text-sky-400">1. Signal Collection</p>
            <p className="text-xs text-zinc-500">
              Systems collect browser fingerprints, behavior patterns, and network characteristics.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-amber-400">2. Score Calculation</p>
            <p className="text-xs text-zinc-500">
              Machine learning models analyze signals to generate trust/risk scores.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-emerald-400">3. Decision Making</p>
            <p className="text-xs text-zinc-500">
              Based on scores, systems allow, challenge, or block the visitor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
