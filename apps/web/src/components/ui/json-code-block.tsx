'use client';

import { useEffect, useState, useCallback } from 'react';
import { codeToHtml } from 'shiki';

interface JsonCodeBlockProps {
  data: unknown;
  title?: string;
  maxHeight?: string;
  className?: string;
}

export function JsonCodeBlock({
  data,
  title,
  maxHeight = '400px',
  className = ''
}: JsonCodeBlockProps) {
  const [html, setHtml] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const jsonString = JSON.stringify(data, null, 2);

  useEffect(() => {
    let mounted = true;

    async function highlight() {
      try {
        const highlighted = await codeToHtml(jsonString, {
          lang: 'json',
          theme: 'github-dark-dimmed'
        });
        if (mounted) {
          setHtml(highlighted);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Syntax highlighting failed:', error);
        if (mounted) {
          // Fallback to plain code
          setHtml(`<pre><code>${escapeHtml(jsonString)}</code></pre>`);
          setIsLoading(false);
        }
      }
    }

    highlight();
    return () => { mounted = false; };
  }, [jsonString]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = jsonString;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [jsonString]);

  return (
    <div className={`rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          {title && (
            <span className="ml-2 text-xs text-zinc-500 font-mono">{title}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div
        className="overflow-auto p-4 text-sm"
        style={{ maxHeight }}
      >
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-3/4 rounded bg-zinc-800" />
            <div className="h-4 w-1/2 rounded bg-zinc-800" />
            <div className="h-4 w-2/3 rounded bg-zinc-800" />
          </div>
        ) : (
          <div
            className="shiki-container [&_pre]:!bg-transparent [&_code]:text-sm [&_code]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
