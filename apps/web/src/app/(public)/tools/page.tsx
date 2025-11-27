import Link from 'next/link';

const tools = [
  { href: '/tools/ip-lookup', title: 'IP Intelligence', desc: 'Aggregate ipinfo + BrowserScan heuristics.' },
  { href: '/tools/leak-test', title: 'Leak Test', desc: 'WebRTC / DNS / IPv6 leak harness.' },
  { href: '/tools/port-scan', title: 'Port Scan', desc: 'Check SSH/RDP exposure from browser vantage.' },
  { href: '/tools/pdf-gen', title: 'PDF Generator', desc: 'Produce white-paper formatted report.' },
  { href: '/tools/cookie-check', title: 'Cookie Flags', desc: 'Secure/HttpOnly/SameSite analyzer.' }
];

export default function ToolsIndexPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Professional Utilities</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Tools</h1>
        <p className="text-sm text-zinc-400">Operational helpers for analysts.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
            <p className="text-sm font-semibold text-zinc-100">{tool.title}</p>
            <p className="text-xs text-zinc-400">{tool.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
