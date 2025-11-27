export type ScanMeta = {
  scan_id: string;
  timestamp: number;
  version: string;
};

export type ScoreDeduction = {
  code: string;
  score: number;
  desc: string;
};

export type ScoreCard = {
  total: number;
  grade: string;
  verdict: string;
  deductions: ScoreDeduction[];
};

export type ScanIdentity = {
  ip: string;
  asn: string;
  location: string;
  browser: string;
  os: string;
  device: string;
};

export type NetworkRisk = {
  is_proxy: boolean;
  is_vpn: boolean;
  is_tor: boolean;
  fraud_score: number;
};

export type ProtocolFingerprints = {
  tls_ja3: string;
  tls_version: string;
  http_version: string;
  tcp_os_guess: string;
};

export type LeakStatus = 'SAFE' | 'LEAK' | 'WARN' | 'UNKNOWN';

export type LeakTelemetry = {
  webrtc: { status: LeakStatus; ip: string; region: string };
  dns: { status: LeakStatus; servers: string[] };
};

export type NetworkSection = {
  risk: NetworkRisk;
  protocols: ProtocolFingerprints;
  leaks: LeakTelemetry;
};

export type HardwareFingerprint = {
  canvas_hash: string;
  webgl_vendor: string;
  webgl_renderer: string;
  screen: string;
  concurrency: number;
  memory: number;
};

export type SoftwareFingerprint = {
  fonts_hash: string;
  timezone_name: string;
  languages: string[];
};

export type FingerprintSection = {
  hardware: HardwareFingerprint;
  software: SoftwareFingerprint;
};

export type ConsistencyCheck = {
  status: 'PASS' | 'FAIL' | 'WARN' | string;
  evidence: string;
};

export type ConsistencySection = {
  os_check: ConsistencyCheck;
  timezone_check: ConsistencyCheck;
  language_check: ConsistencyCheck;
};

export type ScanReport = {
  meta: ScanMeta;
  score: ScoreCard;
  identity: ScanIdentity;
  network: NetworkSection;
  fingerprint: FingerprintSection;
  consistency: ConsistencySection;
};

export type ApiResponse<T> = {
  status: 'ok';
  data: T;
};
