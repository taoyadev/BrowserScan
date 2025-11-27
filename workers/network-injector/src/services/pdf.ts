/**
 * PDF Generation Service
 * Creates comprehensive PDF reports from scan data
 *
 * Note: This uses a text-based approach since jsPDF doesn't work in Workers.
 * We'll generate a downloadable HTML report that can be printed to PDF.
 */

import type { ScanReport } from '@browserscan/types';

/**
 * Generate a PDF-ready HTML report
 */
export function generateReportHtml(report: ScanReport): string {
  const timestamp = new Date(report.meta.timestamp * 1000).toISOString();
  const gradeColor = getGradeColor(report.score.grade);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BrowserScan Report - ${report.meta.scan_id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #fff;
      color: #1a1a1a;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #e5e5e5;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: #09090b;
    }
    .logo span { color: #10b981; }
    .meta {
      text-align: right;
      font-size: 12px;
      color: #666;
    }
    .meta strong { display: block; font-size: 14px; color: #333; }
    .score-section {
      display: flex;
      align-items: center;
      gap: 30px;
      margin-bottom: 40px;
      padding: 20px;
      background: #f9fafb;
      border-radius: 12px;
    }
    .score-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: ${gradeColor}15;
      border: 4px solid ${gradeColor};
    }
    .score-value {
      font-size: 36px;
      font-weight: 700;
      color: ${gradeColor};
    }
    .score-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .score-details h2 {
      font-size: 24px;
      margin-bottom: 8px;
    }
    .verdict {
      font-size: 18px;
      color: ${gradeColor};
      font-weight: 600;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #09090b;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e5e5;
    }
    .data-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .data-item {
      padding: 12px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .data-label {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 4px;
    }
    .data-value {
      font-size: 14px;
      font-weight: 500;
      font-family: 'SF Mono', Monaco, monospace;
      word-break: break-all;
    }
    .status-pass { color: #10b981; }
    .status-fail { color: #f43f5e; }
    .status-warn { color: #f59e0b; }
    .deductions {
      margin-top: 20px;
    }
    .deduction-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 12px;
      background: #fef2f2;
      border-left: 3px solid #f43f5e;
      margin-bottom: 8px;
      border-radius: 0 8px 8px 0;
    }
    .deduction-desc { font-size: 13px; }
    .deduction-score { font-weight: 600; color: #f43f5e; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    @media print {
      body { padding: 20px; }
      .score-section { break-inside: avoid; }
      .section { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Browser<span>Scan</span>.org</div>
    <div class="meta">
      <strong>Scan ID: ${report.meta.scan_id.slice(0, 8)}</strong>
      Generated: ${timestamp}
    </div>
  </div>

  <div class="score-section">
    <div class="score-circle">
      <div class="score-value">${report.score.total}</div>
      <div class="score-label">Grade ${report.score.grade}</div>
    </div>
    <div class="score-details">
      <h2>Trust Score Analysis</h2>
      <div class="verdict">${report.score.verdict}</div>
    </div>
  </div>

  <div class="section">
    <h3 class="section-title">Identity Information</h3>
    <div class="data-grid">
      <div class="data-item">
        <div class="data-label">IP Address</div>
        <div class="data-value">${report.identity.ip}</div>
      </div>
      <div class="data-item">
        <div class="data-label">ASN</div>
        <div class="data-value">${report.identity.asn}</div>
      </div>
      <div class="data-item">
        <div class="data-label">Location</div>
        <div class="data-value">${report.identity.location}</div>
      </div>
      <div class="data-item">
        <div class="data-label">Browser</div>
        <div class="data-value">${report.identity.browser}</div>
      </div>
      <div class="data-item">
        <div class="data-label">Operating System</div>
        <div class="data-value">${report.identity.os}</div>
      </div>
      <div class="data-item">
        <div class="data-label">Device Type</div>
        <div class="data-value">${report.identity.device}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h3 class="section-title">Network Analysis</h3>
    <div class="data-grid">
      <div class="data-item">
        <div class="data-label">Proxy Detected</div>
        <div class="data-value ${report.network.risk.is_proxy ? 'status-fail' : 'status-pass'}">
          ${report.network.risk.is_proxy ? 'Yes' : 'No'}
        </div>
      </div>
      <div class="data-item">
        <div class="data-label">VPN Detected</div>
        <div class="data-value ${report.network.risk.is_vpn ? 'status-warn' : 'status-pass'}">
          ${report.network.risk.is_vpn ? 'Yes' : 'No'}
        </div>
      </div>
      <div class="data-item">
        <div class="data-label">Tor Exit Node</div>
        <div class="data-value ${report.network.risk.is_tor ? 'status-fail' : 'status-pass'}">
          ${report.network.risk.is_tor ? 'Yes' : 'No'}
        </div>
      </div>
      <div class="data-item">
        <div class="data-label">Fraud Score</div>
        <div class="data-value ${report.network.risk.fraud_score > 75 ? 'status-fail' : report.network.risk.fraud_score > 50 ? 'status-warn' : 'status-pass'}">
          ${report.network.risk.fraud_score}/100
        </div>
      </div>
      <div class="data-item">
        <div class="data-label">TLS JA3 Hash</div>
        <div class="data-value">${report.network.protocols.tls_ja3}</div>
      </div>
      <div class="data-item">
        <div class="data-label">TLS Version</div>
        <div class="data-value">${report.network.protocols.tls_version}</div>
      </div>
      <div class="data-item">
        <div class="data-label">HTTP Protocol</div>
        <div class="data-value">${report.network.protocols.http_version}</div>
      </div>
      <div class="data-item">
        <div class="data-label">TCP OS Guess</div>
        <div class="data-value">${report.network.protocols.tcp_os_guess}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h3 class="section-title">Leak Detection</h3>
    <div class="data-grid">
      <div class="data-item">
        <div class="data-label">WebRTC Status</div>
        <div class="data-value ${report.network.leaks.webrtc.status === 'LEAK' ? 'status-fail' : 'status-pass'}">
          ${report.network.leaks.webrtc.status}
          ${report.network.leaks.webrtc.status === 'LEAK' ? ` (${report.network.leaks.webrtc.ip})` : ''}
        </div>
      </div>
      <div class="data-item">
        <div class="data-label">DNS Status</div>
        <div class="data-value ${report.network.leaks.dns.status === 'LEAK' ? 'status-fail' : 'status-pass'}">
          ${report.network.leaks.dns.status}
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h3 class="section-title">Hardware Fingerprint</h3>
    <div class="data-grid">
      <div class="data-item">
        <div class="data-label">Canvas Hash</div>
        <div class="data-value">${report.fingerprint.hardware.canvas_hash}</div>
      </div>
      <div class="data-item">
        <div class="data-label">WebGL Vendor</div>
        <div class="data-value">${report.fingerprint.hardware.webgl_vendor}</div>
      </div>
      <div class="data-item">
        <div class="data-label">WebGL Renderer</div>
        <div class="data-value">${report.fingerprint.hardware.webgl_renderer}</div>
      </div>
      <div class="data-item">
        <div class="data-label">Screen Resolution</div>
        <div class="data-value">${report.fingerprint.hardware.screen}</div>
      </div>
      <div class="data-item">
        <div class="data-label">CPU Cores</div>
        <div class="data-value">${report.fingerprint.hardware.concurrency}</div>
      </div>
      <div class="data-item">
        <div class="data-label">Device Memory</div>
        <div class="data-value">${report.fingerprint.hardware.memory} GB</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h3 class="section-title">Software Fingerprint</h3>
    <div class="data-grid">
      <div class="data-item">
        <div class="data-label">Fonts Hash</div>
        <div class="data-value">${report.fingerprint.software.fonts_hash}</div>
      </div>
      <div class="data-item">
        <div class="data-label">Timezone</div>
        <div class="data-value">${report.fingerprint.software.timezone_name}</div>
      </div>
      <div class="data-item">
        <div class="data-label">Languages</div>
        <div class="data-value">${report.fingerprint.software.languages.join(', ')}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h3 class="section-title">Consistency Checks</h3>
    <div class="data-grid">
      <div class="data-item">
        <div class="data-label">OS Check</div>
        <div class="data-value status-${report.consistency.os_check.status.toLowerCase()}">
          ${report.consistency.os_check.status}
        </div>
      </div>
      <div class="data-item">
        <div class="data-label">Timezone Check</div>
        <div class="data-value status-${report.consistency.timezone_check.status.toLowerCase()}">
          ${report.consistency.timezone_check.status}
        </div>
      </div>
      <div class="data-item">
        <div class="data-label">Language Check</div>
        <div class="data-value status-${report.consistency.language_check.status.toLowerCase()}">
          ${report.consistency.language_check.status}
        </div>
      </div>
    </div>
  </div>

  ${report.score.deductions.length > 0 ? `
  <div class="section deductions">
    <h3 class="section-title">Score Deductions</h3>
    ${report.score.deductions.map(d => `
      <div class="deduction-item">
        <span class="deduction-desc">${d.desc}</span>
        <span class="deduction-score">${d.score}</span>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="footer">
    <p>Generated by BrowserScan.org - The Authority in Browser Fingerprinting</p>
    <p>This report certifies the browser fingerprint analysis performed at ${timestamp}</p>
  </div>
</body>
</html>`;
}

function getGradeColor(grade: string): string {
  if (grade.startsWith('A')) return '#10b981';
  if (grade.startsWith('B')) return '#22c55e';
  if (grade.startsWith('C')) return '#f59e0b';
  if (grade.startsWith('D')) return '#f97316';
  return '#f43f5e';
}

/**
 * Generate PDF filename
 */
export function generatePdfFilename(scanId: string): string {
  const date = new Date().toISOString().split('T')[0];
  return `browserscan-report-${scanId.slice(0, 8)}-${date}.pdf`;
}
