'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const tools = [
  {
    href: '/tools/ip-lookup',
    title: 'IP Intelligence',
    desc: 'Lookup any IP address for geolocation, ASN, proxy detection, and fraud scoring.',
    icon: '🌐',
    color: 'emerald'
  },
  {
    href: '/tools/leak-test',
    title: 'WebRTC & DNS Leak Test',
    desc: 'Detect if your real IP is exposed through WebRTC or DNS requests.',
    icon: '🔍',
    color: 'rose'
  },
  {
    href: '/tools/port-scan',
    title: 'Port Scanner',
    desc: 'Check common ports (SSH, HTTP, HTTPS, RDP) for exposure status.',
    icon: '🔌',
    color: 'amber'
  },
  {
    href: '/tools/pdf-gen',
    title: 'PDF Report Generator',
    desc: 'Export your browser fingerprint scan as a professional PDF report.',
    icon: '📄',
    color: 'sky'
  },
  {
    href: '/tools/cookie-check',
    title: 'Cookie Analyzer',
    desc: 'Inspect browser cookies and analyze security flags (Secure, HttpOnly, SameSite).',
    icon: '🍪',
    color: 'violet'
  }
];

const colorMap: Record<string, string> = {
  emerald: 'border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-emerald-500/10',
  rose: 'border-rose-500/30 hover:border-rose-500/60 hover:shadow-rose-500/10',
  amber: 'border-amber-500/30 hover:border-amber-500/60 hover:shadow-amber-500/10',
  sky: 'border-sky-500/30 hover:border-sky-500/60 hover:shadow-sky-500/10',
  violet: 'border-violet-500/30 hover:border-violet-500/60 hover:shadow-violet-500/10'
};

export default function ToolsIndexPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">BrowserScan</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Security Tools</h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
          Professional utilities for security analysts, penetration testers, and privacy-conscious users.
          All tools run client-side or through our secure API.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={tool.href}
              className={`block rounded-2xl border bg-gradient-to-br from-zinc-950/80 to-zinc-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${colorMap[tool.color]}`}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">{tool.icon}</span>
                <div className="flex-1">
                  <p className="text-base font-semibold text-zinc-100">{tool.title}</p>
                  <p className="mt-1 text-sm text-zinc-400 leading-relaxed">{tool.desc}</p>
                </div>
                <span className="text-zinc-600">→</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4">
        <p className="text-xs text-zinc-500">
          <span className="text-emerald-400">●</span> All tools are free to use.
          Results are not stored unless you explicitly export them.
        </p>
      </div>
    </div>
  );
}
