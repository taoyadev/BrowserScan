import Link from 'next/link';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/report', label: 'Deep Report' },
  { href: '/simulation', label: 'Simulation Lab' },
  { href: '/tools', label: 'Tools' },
  { href: '/knowledge/methodology', label: 'Methodology' }
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-widest text-zinc-200">
          <span className="font-mono text-emerald-400">BrowserScan.org</span>
          <span className="hidden text-xs text-zinc-500 sm:inline">权威体检中心</span>
        </Link>
        <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.3em] text-zinc-500 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={cn('transition-colors hover:text-zinc-200')}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/tools/pdf-gen"
            className="rounded-full border border-emerald-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 shadow-glowSafe transition hover:bg-emerald-500/10"
          >
            Export PDF
          </Link>
          <a
            href="https://github.com/BrowserScanOrg"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 transition hover:text-zinc-100"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
