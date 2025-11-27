'use client';

import { useEffect, useState } from 'react';

interface CookieInsight {
  name: string;
  attributes: string;
}

function parseCookies(): CookieInsight[] {
  if (typeof document === 'undefined') return [];
  return document.cookie.split(';').filter(Boolean).map((raw) => {
    const [name, ...rest] = raw.split('=');
    return { name: name.trim(), attributes: rest.join('=').trim() };
  });
}

export default function CookieCheckPage() {
  const [rows, setRows] = useState<CookieInsight[]>([]);

  useEffect(() => {
    setRows(parseCookies());
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Tool</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Cookie Flags</h1>
      </div>
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        {rows.length === 0 ? (
          <p className="text-sm text-zinc-500">No cookies detected.</p>
        ) : (
          <div className="space-y-2">
            {rows.map((row) => (
              <div key={row.name} className="rounded-xl border border-white/5 px-4 py-2 font-mono text-xs text-zinc-300">
                {row.name}: {row.attributes}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
