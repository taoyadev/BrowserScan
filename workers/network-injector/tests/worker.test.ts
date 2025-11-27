import { describe, expect, it } from 'vitest';
import app from '../src/worker';

type Env = Parameters<typeof app.request>[2];

const createEnv = (): Env => {
  const statement = {
    first: async () => undefined,
    bind: () => statement,
    run: async () => ({ success: true })
  };

  return {
    ENVIRONMENT: 'test',
    IPINFO_TOKEN: '',
    DB: {
      prepare: () => statement
    } as unknown as D1Database,
    REPORTS_BUCKET: {
      put: async () => undefined,
      get: async () => null,
      head: async () => null,
      delete: async () => undefined
    } as unknown as R2Bucket
  } satisfies Env;
};

describe('network-injector worker', () => {
  it('returns environment information on /api/health', async () => {
    const env = createEnv();
    const response = await app.request('/api/health', {}, env);
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.status).toBe('ok');
    expect(payload.data.env).toBe('test');
  });

  it('falls back to offline ip intel when no token is configured', async () => {
    const env = createEnv();
    const response = await app.request('/api/tools/ip-lookup', {
      method: 'POST',
      body: JSON.stringify({ ip: '1.1.1.1' }),
      headers: { 'Content-Type': 'application/json' }
    }, env);
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.data.ip).toBe('1.1.1.1');
    expect(payload.data.country).toBe('UNKNOWN');
    expect(payload.data.fraud_score).toBe(0);
  });
});
