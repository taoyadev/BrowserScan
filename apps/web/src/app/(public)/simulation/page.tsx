import Link from 'next/link';

const simulations = [
  { href: '/simulation/recaptcha', title: 'reCAPTCHA v3 Emulator', desc: 'Tune Google score outputs (0.1-0.9) to benchmark anti-bot posture.' },
  { href: '/simulation/turnstile', title: 'Cloudflare Turnstile', desc: 'Validate Turnstile response tokens inside BrowserScan lab.' },
  { href: '/simulation/behavior', title: 'Behavioral Telemetry', desc: 'Mouse trajectory entropy + dwell-time heuristics.' }
];

export default function SimulationIndexPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Simulation Lab</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Bot Detection Lab</h1>
        <p className="text-sm text-zinc-400">Use built-in sandboxes to rehearse detection signals before production rollout.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {simulations.map((sim) => (
          <Link key={sim.href} href={sim.href} className="rounded-2xl border border-zinc-800/80 bg-black/40 p-5 transition hover:-translate-y-1">
            <p className="text-sm font-semibold text-zinc-100">{sim.title}</p>
            <p className="text-xs text-zinc-500">{sim.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
