import { Card, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ScanIdentity } from '@browserscan/types';

interface IdentityPanelProps {
  identity: ScanIdentity;
}

const identityEntries: Array<{ key: keyof ScanIdentity; label: string }> = [
  { key: 'ip', label: 'IP Address' },
  { key: 'asn', label: 'ASN' },
  { key: 'location', label: 'Location' },
  { key: 'browser', label: 'Browser' },
  { key: 'os', label: 'OS' },
  { key: 'device', label: 'Device' }
];

export function IdentityPanel({ identity }: IdentityPanelProps) {
  return (
    <Card className="col-span-1 space-y-4 md:col-span-2">
      <div className="flex items-center justify-between">
        <CardTitle>Identity</CardTitle>
        <span className="text-xs text-zinc-500">Digital fingerprint snapshot</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {identityEntries.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">{label}</p>
            <p className={cn('font-mono text-lg text-zinc-100', key === 'ip' ? 'blur-reveal focus-within:blur-0' : '')}>{identity[key]}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
