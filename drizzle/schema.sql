CREATE TABLE IF NOT EXISTS scans (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    trust_score INTEGER,
    trust_grade TEXT,
    ip_address TEXT,
    country_code TEXT,
    browser_family TEXT,
    os_family TEXT,
    has_proxy BOOLEAN DEFAULT 0,
    has_webrtc_leak BOOLEAN DEFAULT 0,
    is_bot BOOLEAN DEFAULT 0,
    report_blob TEXT
);

CREATE INDEX IF NOT EXISTS idx_created_at ON scans(created_at);
CREATE INDEX IF NOT EXISTS idx_score ON scans(trust_score);
CREATE INDEX IF NOT EXISTS idx_country ON scans(country_code);
