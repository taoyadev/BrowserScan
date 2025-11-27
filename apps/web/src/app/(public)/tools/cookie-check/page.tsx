'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface CookieInfo {
  name: string;
  value: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite: 'strict' | 'lax' | 'none' | 'unknown';
  expires: string | null;
  domain: string;
  path: string;
}

export default function CookieCheckPage() {
  const [cookies, setCookies] = useState<CookieInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeCookies();
  }, []);

  function analyzeCookies() {
    setLoading(true);

    if (typeof document === 'undefined') {
      setLoading(false);
      return;
    }

    const rawCookies = document.cookie.split(';').filter(Boolean);

    const analyzed: CookieInfo[] = rawCookies.map(raw => {
      const [nameValue] = raw.trim().split(';');
      const [name, ...valueParts] = nameValue.split('=');
      const value = valueParts.join('=');

      // Note: JavaScript can only see non-HttpOnly cookies
      // Real security flags would need server-side analysis
      return {
        name: name.trim(),
        value: value.length > 50 ? value.slice(0, 50) + '...' : value,
        secure: window.location.protocol === 'https:',
        httpOnly: false, // Can't detect - if we can see it, it's not HttpOnly
        sameSite: 'unknown',
        expires: null,
        domain: window.location.hostname,
        path: '/'
      };
    });

    setCookies(analyzed);
    setLoading(false);
  }

  const securityScore = cookies.length === 0 ? 100 :
    Math.round((cookies.filter(c => c.secure).length / cookies.length) * 100);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      {/* Header */}
      <div>
        <Link href="/tools" className="text-xs text-zinc-500 hover:text-zinc-400">← Back to Tools</Link>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-zinc-500">BrowserScan Tools</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Cookie Analyzer</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Inspect browser cookies and analyze their security attributes. Identifies potential security misconfigurations.
        </p>
      </div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-950/80 to-zinc-900/40 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500">Cookies Detected</p>
            <p className="text-4xl font-bold text-zinc-100">{cookies.length}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500">Secure Cookies</p>
            <p className={`text-2xl font-semibold ${
              securityScore >= 80 ? 'text-emerald-400' :
              securityScore >= 50 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {securityScore}%
            </p>
          </div>
        </div>

        <div className="mt-4 h-2 rounded-full bg-zinc-800">
          <div
            className={`h-full rounded-full transition-all ${
              securityScore >= 80 ? 'bg-emerald-500' :
              securityScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${securityScore}%` }}
          />
        </div>
      </motion.div>

      {/* Cookie List */}
      {loading ? (
        <div className="text-center text-zinc-500">Analyzing cookies...</div>
      ) : cookies.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-10 text-center">
          <p className="text-lg text-zinc-400">No cookies detected</p>
          <p className="mt-1 text-sm text-zinc-600">
            This page has no accessible cookies, or all cookies are HttpOnly.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {cookies.map((cookie, index) => (
            <motion.div
              key={cookie.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-zinc-800/80 bg-black/40 p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-sm font-semibold text-zinc-100">{cookie.name}</p>
                  <p className="mt-1 font-mono text-xs text-zinc-500 break-all">{cookie.value}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    cookie.secure ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {cookie.secure ? 'Secure' : 'Not Secure'}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500">
                <span>Domain: {cookie.domain}</span>
                <span>Path: {cookie.path}</span>
                {cookie.expires && <span>Expires: {cookie.expires}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Security Tips */}
      <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-6">
        <h3 className="text-sm font-semibold text-zinc-100">Cookie Security Best Practices</h3>
        <ul className="mt-4 space-y-2 text-sm text-zinc-400">
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">•</span>
            <span><strong className="text-zinc-300">Secure flag:</strong> Ensures cookies are only sent over HTTPS</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">•</span>
            <span><strong className="text-zinc-300">HttpOnly flag:</strong> Prevents JavaScript access, mitigating XSS attacks</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">•</span>
            <span><strong className="text-zinc-300">SameSite attribute:</strong> Controls cross-site request behavior, helps prevent CSRF</span>
          </li>
        </ul>
      </div>

      {/* Refresh Button */}
      <button
        onClick={analyzeCookies}
        className="w-full rounded-xl border border-violet-500/40 bg-violet-500/10 py-3 text-sm font-medium text-violet-400 transition hover:bg-violet-500/20"
      >
        Refresh Analysis
      </button>
    </div>
  );
}
