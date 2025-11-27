import Link from 'next/link';

const topics = [
  { href: '/knowledge/methodology', title: 'Methodology', desc: 'Scoring algorithm & detection coverage.' },
  { href: '/knowledge/privacy', title: 'Privacy Whitepaper', desc: 'Data handling + retention policies.' }
];

export default function KnowledgeIndexPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Knowledge</p>
        <h1 className="text-3xl font-semibold text-zinc-50">BrowserScan Methodology</h1>
      </div>
      <div className="space-y-4">
        {topics.map((topic) => (
          <Link key={topic.href} href={topic.href} className="block rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
            <h2 className="text-lg font-semibold text-zinc-100">{topic.title}</h2>
            <p className="text-sm text-zinc-400">{topic.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
