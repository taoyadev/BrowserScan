import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { ScanReport, NetworkSection, LeakStatus, HardwareFingerprint, SoftwareFingerprint } from '@browserscan/types';
import { sampleReport } from './sample-report';
import { calculateScore, addBotDeduction } from './services/scoring';
import { lookupIpInfo, extractCloudflareData } from './services/ip-intel';
import {
  parseUserAgent,
  buildConsistencySection,
  buildProtocolFingerprints,
  generateScanId
} from './services/fingerprint';
import { generateReportHtml, generatePdfFilename } from './services/pdf';

interface Env {
  DB: D1Database;
  REPORTS_BUCKET: R2Bucket;
  IPINFO_TOKEN: string;
  TURNSTILE_SITE_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  ENVIRONMENT: string;
}

// Client fingerprint payload from browser
interface ClientFingerprint {
  scan_id: string;
  canvas_hash: string;
  webgl_vendor: string;
  webgl_renderer: string;
  screen: string;
  concurrency: number;
  memory: number;
  fonts_hash: string;
  timezone: string;
  languages: string[];
  webrtc_ips: string[];
  dns_servers: string[];
  audio_hash?: string;
  plugins?: string[];
  is_webdriver?: boolean;
  is_headless?: boolean;
}

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// ============================================
// Health & Status Endpoints
// ============================================

app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    data: {
      env: c.env.ENVIRONMENT ?? 'production',
      timestamp: Date.now(),
      version: '1.0.0'
    },
  });
});

// ============================================
// Scan Endpoints
// ============================================

/**
 * Start a new scan - creates initial record and returns scan_id
 */
app.post('/api/scan/start', async (c) => {
  try {
    const scanId = generateScanId();
    const timestamp = Math.floor(Date.now() / 1000);

    // Extract Cloudflare request data
    const cfData = extractCloudflareData(c.req.raw);

    // Initial placeholder - will be updated when client sends fingerprints
    await c.env.DB.prepare(`
      INSERT INTO scans (id, created_at, ip_address, country_code)
      VALUES (?1, ?2, ?3, ?4)
    `).bind(scanId, timestamp, cfData.ip, cfData.country).run();

    return c.json({
      status: 'ok',
      data: {
        scan_id: scanId,
        eta_seconds: 3,
        server_data: {
          ip: cfData.ip,
          country: cfData.country,
          colo: cfData.colo,
          tls_version: cfData.tlsVersion,
          http_protocol: cfData.httpProtocol
        }
      }
    });
  } catch (error) {
    console.error('scan/start error:', error);
    return c.json({ status: 'error', message: 'Failed to start scan' }, 500);
  }
});

/**
 * Collect fingerprints from client and build complete report
 */
app.post('/api/scan/collect', async (c) => {
  try {
    const body = await c.req.json<ClientFingerprint>();
    const { scan_id } = body;

    if (!scan_id) {
      return c.json({ status: 'error', message: 'scan_id required' }, 400);
    }

    // Extract server-side data
    const cfData = extractCloudflareData(c.req.raw);
    const userAgent = c.req.header('user-agent') || '';
    const parsedUA = parseUserAgent(userAgent);

    // Lookup IP intelligence
    const ipIntel = await lookupIpInfo(cfData.ip, c.env.IPINFO_TOKEN);

    // Build network section
    const webrtcLeak = detectWebRTCLeak(cfData.ip, body.webrtc_ips);
    const dnsLeak = detectDNSLeak(body.dns_servers);

    const network: NetworkSection = {
      risk: {
        is_proxy: ipIntel.isProxy,
        is_vpn: ipIntel.isVpn,
        is_tor: ipIntel.isTor,
        fraud_score: ipIntel.fraudScore
      },
      protocols: buildProtocolFingerprints(
        cfData.tlsVersion,
        'TLS_AES_128_GCM_SHA256', // Placeholder - actual cipher from cf
        cfData.httpProtocol,
        parsedUA.os
      ),
      leaks: {
        webrtc: webrtcLeak,
        dns: dnsLeak
      }
    };

    // Build fingerprint section
    const hardware: HardwareFingerprint = {
      canvas_hash: body.canvas_hash || 'unknown',
      webgl_vendor: body.webgl_vendor || 'unknown',
      webgl_renderer: body.webgl_renderer || 'unknown',
      screen: body.screen || 'unknown',
      concurrency: body.concurrency || 0,
      memory: body.memory || 0
    };

    const software: SoftwareFingerprint = {
      fonts_hash: body.fonts_hash || 'unknown',
      timezone_name: body.timezone || 'unknown',
      languages: body.languages || []
    };

    // Build consistency section
    const consistency = buildConsistencySection(
      ipIntel.timezone,
      body.timezone,
      ipIntel.countryCode,
      body.languages,
      parsedUA.os,
      body.webgl_renderer
    );

    // Calculate score
    let scoreCard = calculateScore(network, consistency);

    // Check for bot indicators
    if (body.is_webdriver || body.is_headless) {
      scoreCard = addBotDeduction(scoreCard, body.is_webdriver ? 'WebDriver detected' : 'Headless browser detected');
    }

    // Build complete report
    const report: ScanReport = {
      meta: {
        scan_id,
        timestamp: Math.floor(Date.now() / 1000),
        version: '1.0.0'
      },
      score: scoreCard,
      identity: {
        ip: cfData.ip,
        asn: ipIntel.asn + ' ' + ipIntel.org,
        location: `${ipIntel.city}, ${ipIntel.country}`,
        browser: `${parsedUA.browser} ${parsedUA.browserVersion}`,
        os: `${parsedUA.os} ${parsedUA.osVersion}`,
        device: parsedUA.device
      },
      network,
      fingerprint: {
        hardware,
        software
      },
      consistency
    };

    // Update database with complete report
    await c.env.DB.prepare(`
      UPDATE scans SET
        trust_score = ?1,
        trust_grade = ?2,
        browser_family = ?3,
        os_family = ?4,
        has_proxy = ?5,
        has_webrtc_leak = ?6,
        is_bot = ?7,
        report_blob = ?8
      WHERE id = ?9
    `).bind(
      scoreCard.total,
      scoreCard.grade,
      parsedUA.browser,
      parsedUA.os,
      network.risk.is_proxy ? 1 : 0,
      webrtcLeak.status === 'LEAK' ? 1 : 0,
      body.is_webdriver || body.is_headless ? 1 : 0,
      JSON.stringify(report),
      scan_id
    ).run();

    return c.json({ status: 'ok', data: report });
  } catch (error) {
    console.error('scan/collect error:', error);
    return c.json({ status: 'error', message: 'Failed to process scan' }, 500);
  }
});

/**
 * Get scan by ID
 */
app.get('/api/scan/:id', async (c) => {
  try {
    const scanId = c.req.param('id');

    const row = await c.env.DB.prepare(
      'SELECT report_blob FROM scans WHERE id = ?'
    ).bind(scanId).first<{ report_blob?: string }>();

    if (!row || !row.report_blob) {
      return c.json({ status: 'error', message: 'Scan not found' }, 404);
    }

    const report = JSON.parse(row.report_blob) as ScanReport;
    return c.json({ status: 'ok', data: report });
  } catch (error) {
    console.error('scan/:id error:', error);
    return c.json({ status: 'error', message: 'Failed to fetch scan' }, 500);
  }
});

/**
 * Get latest scan (for dashboard)
 */
app.get('/api/scan/latest', async (c) => {
  try {
    const row = await c.env.DB.prepare(
      'SELECT report_blob FROM scans WHERE report_blob IS NOT NULL ORDER BY created_at DESC LIMIT 1'
    ).first<{ report_blob?: string }>();

    if (row?.report_blob) {
      const report = JSON.parse(row.report_blob) as ScanReport;
      return c.json({ status: 'ok', data: report });
    }

    // Return sample report if no scans exist
    return c.json({ status: 'ok', data: sampleReport });
  } catch (error) {
    console.error('scan/latest error:', error);
    return c.json({ status: 'ok', data: sampleReport });
  }
});

/**
 * Generate PDF report
 */
app.post('/api/scan/:id/pdf', async (c) => {
  try {
    const scanId = c.req.param('id');

    const row = await c.env.DB.prepare(
      'SELECT report_blob FROM scans WHERE id = ?'
    ).bind(scanId).first<{ report_blob?: string }>();

    if (!row || !row.report_blob) {
      return c.json({ status: 'error', message: 'Scan not found' }, 404);
    }

    const report = JSON.parse(row.report_blob) as ScanReport;
    const html = generateReportHtml(report);

    // Store HTML in R2 for later access
    const filename = generatePdfFilename(scanId);
    const key = `reports/${new Date().toISOString().slice(0, 7)}/${filename.replace('.pdf', '.html')}`;

    await c.env.REPORTS_BUCKET.put(key, html, {
      httpMetadata: { contentType: 'text/html' },
      customMetadata: { scanId, createdAt: Date.now().toString() }
    });

    // Return HTML directly for now (client can print to PDF)
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="${filename.replace('.pdf', '.html')}"`
      }
    });
  } catch (error) {
    console.error('scan/:id/pdf error:', error);
    return c.json({ status: 'error', message: 'Failed to generate report' }, 500);
  }
});

// ============================================
// Tools Endpoints
// ============================================

/**
 * IP Lookup tool
 */
app.post('/api/tools/ip-lookup', async (c) => {
  try {
    const body = await c.req.json<{ ip?: string }>();
    const ip = body.ip || c.req.header('cf-connecting-ip') || '8.8.8.8';

    const intel = await lookupIpInfo(ip, c.env.IPINFO_TOKEN);

    return c.json({
      status: 'ok',
      data: {
        ip: intel.ip,
        asn: intel.asn,
        org: intel.org,
        country: intel.country,
        country_code: intel.countryCode,
        region: intel.region,
        city: intel.city,
        timezone: intel.timezone,
        is_proxy: intel.isProxy,
        is_vpn: intel.isVpn,
        is_tor: intel.isTor,
        is_hosting: intel.isHosting,
        fraud_score: intel.fraudScore,
        coordinates: intel.lat && intel.lon ? { lat: intel.lat, lon: intel.lon } : null
      }
    });
  } catch (error) {
    console.error('ip-lookup error:', error);
    return c.json({ status: 'error', message: 'IP lookup failed' }, 500);
  }
});

/**
 * Port scan tool (checks if common ports are accessible)
 */
app.post('/api/tools/port-scan', async (c) => {
  try {
    const body = await c.req.json<{ ip?: string; ports?: number[] }>();
    const ip = body.ip || c.req.header('cf-connecting-ip') || '';
    const ports = body.ports || [22, 80, 443, 3389, 8080];

    // Note: Workers can't do TCP connects, so we return a placeholder
    // Real implementation would use a backend service or external API
    const results = ports.map(port => ({
      port,
      status: 'unknown' as const,
      service: getServiceName(port)
    }));

    return c.json({
      status: 'ok',
      data: {
        target_ip: ip,
        ports: results,
        note: 'Port scanning requires direct TCP connections not available in edge workers'
      }
    });
  } catch (error) {
    console.error('port-scan error:', error);
    return c.json({ status: 'error', message: 'Port scan failed' }, 500);
  }
});

/**
 * Turnstile verification
 */
app.post('/api/tools/turnstile-verify', async (c) => {
  try {
    const body = await c.req.json<{ token: string }>();
    const { token } = body;

    if (!token) {
      return c.json({ status: 'error', message: 'Token required' }, 400);
    }

    const ip = c.req.header('cf-connecting-ip') || '';

    const formData = new FormData();
    formData.append('secret', c.env.TURNSTILE_SECRET_KEY);
    formData.append('response', token);
    formData.append('remoteip', ip);

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });

    const outcome = await result.json<{
      success: boolean;
      challenge_ts?: string;
      hostname?: string;
      'error-codes'?: string[];
    }>();

    return c.json({
      status: 'ok',
      data: {
        success: outcome.success,
        challenge_timestamp: outcome.challenge_ts,
        hostname: outcome.hostname,
        errors: outcome['error-codes']
      }
    });
  } catch (error) {
    console.error('turnstile-verify error:', error);
    return c.json({ status: 'error', message: 'Verification failed' }, 500);
  }
});

// ============================================
// Helper Functions
// ============================================

function detectWebRTCLeak(
  publicIp: string,
  webrtcIps: string[]
): { status: LeakStatus; ip: string; region: string } {
  if (!webrtcIps || webrtcIps.length === 0) {
    return { status: 'UNKNOWN', ip: '', region: '' };
  }

  // Filter out local/private IPs
  const publicWebrtcIps = webrtcIps.filter(ip => !isPrivateIp(ip));

  if (publicWebrtcIps.length === 0) {
    return { status: 'SAFE', ip: '', region: '' };
  }

  // Check if any WebRTC IP differs from the public IP
  const leakedIp = publicWebrtcIps.find(ip => ip !== publicIp);

  if (leakedIp) {
    return {
      status: 'LEAK',
      ip: leakedIp,
      region: 'Unknown' // Would need IP lookup to get region
    };
  }

  return { status: 'SAFE', ip: publicIp, region: '' };
}

function detectDNSLeak(
  dnsServers: string[]
): { status: LeakStatus; servers: string[] } {
  if (!dnsServers || dnsServers.length === 0) {
    return { status: 'UNKNOWN', servers: [] };
  }

  // Check for common secure DNS servers
  const secureDns = ['1.1.1.1', '1.0.0.1', '8.8.8.8', '8.8.4.4', '9.9.9.9'];
  const hasSecure = dnsServers.some(s => secureDns.includes(s));

  if (hasSecure) {
    return { status: 'SAFE', servers: dnsServers };
  }

  // If using ISP DNS, it might leak location
  return { status: 'WARN', servers: dnsServers };
}

function isPrivateIp(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4) return false;

  // 10.x.x.x
  if (parts[0] === 10) return true;
  // 172.16.x.x - 172.31.x.x
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.x.x
  if (parts[0] === 192 && parts[1] === 168) return true;
  // 127.x.x.x (localhost)
  if (parts[0] === 127) return true;

  return false;
}

function getServiceName(port: number): string {
  const services: Record<number, string> = {
    21: 'FTP',
    22: 'SSH',
    23: 'Telnet',
    25: 'SMTP',
    53: 'DNS',
    80: 'HTTP',
    110: 'POP3',
    143: 'IMAP',
    443: 'HTTPS',
    445: 'SMB',
    3306: 'MySQL',
    3389: 'RDP',
    5432: 'PostgreSQL',
    5900: 'VNC',
    6379: 'Redis',
    8080: 'HTTP-ALT',
    8443: 'HTTPS-ALT'
  };
  return services[port] || 'Unknown';
}

export default app;
