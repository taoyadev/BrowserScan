# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BrowserScan.org is a browser fingerprinting and privacy analysis platform built on **Cloudflare's full stack** (Pages + Workers + D1 + R2). It provides real-time scanning, risk scoring, leak detection, and PDF report generation.

**Architecture**: Monorepo with npm workspaces
- **Frontend**: Next.js 15 App Router → Cloudflare Pages (SSG + Edge Functions)
- **Backend**: Cloudflare Worker (Hono framework) → D1 database + R2 storage
- **Shared**: TypeScript types package, optional UI components

## Workspace Structure

```
apps/
  web/                  # Next.js frontend (@browserscan/web)
workers/
  network-injector/     # Cloudflare Worker API (@browserscan/network-injector)
packages/
  types/                # Shared TypeScript types (@browserscan/types)
  ui/                   # Shared UI components (optional)
drizzle/
  schema.sql            # D1 database schema
scripts/
  seed-demo.ts          # Database seeding utility
```

## Common Commands

### Development

```bash
# Install dependencies (run from root)
npm install

# Start development (concurrent: web + worker)
npm run dev

# Start individual services
npm run dev:web        # Next.js dev server (http://localhost:3000)
npm run dev:worker     # Wrangler local worker (http://localhost:8787)
```

### Building & Testing

```bash
# Build all workspaces
npm run build

# Build individually
npm run build:web      # Next.js production build
npm run build:worker   # TypeScript compilation for worker

# Run tests
npm run test           # Web app tests (Vitest)
npm run test:worker    # Worker tests (Vitest)
npm run typecheck      # TypeScript validation

# Linting
npm run lint           # ESLint for web app
```

### Deployment

```bash
# Deploy to Cloudflare Pages (web app)
npm run deploy:pages   # or npm run pages:build then deploy via CLI

# Deploy worker
npm run deploy:worker  # wrangler deploy

# View worker logs
npm run tail:worker    # wrangler tail browserscan-worker
```

### Database Operations

```bash
# Seed demo data into D1
npm run seed:d1

# Run D1 migrations (if using Drizzle migrations)
cd workers/network-injector
npx wrangler d1 migrations apply browserscan-db

# Query D1 directly
npx wrangler d1 execute browserscan-db --command "SELECT * FROM scans LIMIT 10"
```

## Architecture Overview

### Data Flow (Scan Request)

1. **Browser** → `POST /api/scan/start` → **Pages Function** → **Worker**
   - Worker generates `scan_id`, writes initial record to D1
   - Returns `{ scan_id, eta_seconds: 3 }`

2. **Browser** → `POST /api/scan/collect` → **Worker**
   - Receives fingerprint data (WebRTC IPs, Canvas hash, UA string, etc.)
   - Calls external IP intelligence APIs (ipinfo.io with token)
   - Executes scoring algorithm (100 - deductions)
   - Updates D1 with full `report_blob` (JSON)

3. **Browser** → `GET /api/scan/:id` → **Worker** → D1 query
   - Returns complete `ScanReport` object
   - Frontend renders dashboard with sections: Identity, Network, Hardware, Software, Consistency

4. **PDF Export** → `POST /api/scan/:id/pdf` → **Worker**
   - Reads `report_blob` from D1
   - Generates PDF (jsPDF or HTML-to-PDF)
   - Optionally uploads to R2 (`browserscan-reports` bucket) with 30-day retention
   - Returns signed URL or binary stream

### Key Services in Worker

**Worker Entry** (`workers/network-injector/src/worker.ts`):
- Uses **Hono** router for REST endpoints
- Middleware: CORS, rate limiting (KV-based), Turnstile verification, schema validation
- Environment bindings: `DB` (D1), `REPORTS_BUCKET` (R2), `IPINFO_TOKEN`, `ENVIRONMENT`

**Core Modules** (to be implemented):
- `ipIntelService`: Multi-source IP lookup (ipinfo, ipapi, ipqs fallback)
- `webrtcLeakService`: WebRTC IP leak detection
- `portScanService`: Client-side port scanning orchestration
- `scoringService`: Deduction-based trust scoring (see `ScoreCard` type)
- `pdfService`: PDF generation and R2 persistence

### Frontend Architecture (Next.js App Router)

**Route Groups**:
- `app/(public)/page.tsx` - Landing/Dashboard
- `app/(public)/report/*` - Report sections (identity, network, hardware, software, consistency)
- `app/(public)/tools/*` - IP lookup, leak test, port scan, cookie check, PDF gen
- `app/(public)/simulation/*` - reCAPTCHA/Turnstile simulation
- `app/(public)/knowledge/*` - Methodology, privacy guides (MDX)

**Key Components** (`apps/web/src/components/`):
- `layout/` - Page layouts and shells
- `sections/` - Report sections (identity, network, etc.)
- `ui/` - Shared UI primitives (based on Shadcn/Radix)

**Data Fetching**:
- `use-live-report.ts`: Custom hook using TanStack Query for scan polling
- `report-data.ts`: Static report data utilities
- `sample-report.ts`: Demo/fallback report object

**Styling**:
- Tailwind CSS with **cyber-industrial design system** (see `docs/DESIGN_SYSTEM.md`)
- Dark mode enforced, Zinc color palette, Geist Sans/Mono fonts
- Custom components: `HealthRing` (SVG score ring), `StatusDot`, `KeyValueCard`, `ScanConsole`, `JsonCodeBlock`

### Type System (`packages/types/src/index.ts`)

All data structures are centrally defined and shared across web + worker:

**Core Types**:
- `ScanReport` - Top-level report structure
- `ScanMeta` - Scan ID, timestamp, version
- `ScoreCard` - Total score (0-100), grade (A-F), verdict, deductions array
- `ScanIdentity` - IP, ASN, location, browser, OS, device
- `NetworkSection` - Risk flags (proxy/VPN/Tor), protocol fingerprints (TLS JA3, HTTP version), leak telemetry (WebRTC, DNS)
- `FingerprintSection` - Hardware (Canvas hash, WebGL, screen, concurrency) + Software (fonts, timezone, languages)
- `ConsistencySection` - Cross-checks (OS vs UA, timezone vs IP geolocation, language consistency)
- `ApiResponse<T>` - Generic API wrapper

### Database Schema (`drizzle/schema.sql`)

**Table: `scans`**
```sql
id TEXT PRIMARY KEY         -- UUID scan_id
created_at INTEGER          -- Unix timestamp
trust_score INTEGER         -- 0-100
trust_grade TEXT            -- A, B, C, D, F
ip_address TEXT             -- IPv4/IPv6
country_code TEXT           -- ISO-2
browser_family TEXT         -- Chrome, Firefox, Safari, etc.
os_family TEXT              -- Mac, Windows, Linux, iOS, Android
has_proxy BOOLEAN           -- Risk flag
has_webrtc_leak BOOLEAN     -- Leak flag
is_bot BOOLEAN              -- Bot detection
report_blob TEXT            -- Full JSON ScanReport
```

**Indexes**: `created_at`, `trust_score`, `country_code`

### External Dependencies

**Worker Runtime**:
- `hono` - HTTP router
- `@browserscan/types` - Shared types (file: workspace reference)

**Web App**:
- `next` - Framework (v15 with App Router)
- `@opennextjs/cloudflare` - Cloudflare Pages adapter
- `@tanstack/react-query` - Data fetching/polling
- `framer-motion` - Animations (respects `prefers-reduced-motion`)
- `recharts` - Data visualization
- `jspdf` - PDF generation
- `ua-parser-js` - User-Agent parsing
- `@fingerprintjs/fingerprintjs` - Browser fingerprinting
- Shadcn UI components: Radix primitives + Tailwind variants

**APIs**:
- **ipinfo.io**: IP intelligence (requires `IPINFO_TOKEN` secret)
- **Cloudflare Turnstile**: Bot verification (configured in Pages/Worker)

## Development Workflow

### Adding New Features

1. **Define Types First**: Update `packages/types/src/index.ts` if new data structures needed
2. **Worker API**: Add endpoint in `workers/network-injector/src/worker.ts`, implement service module
3. **Frontend Page**: Create route in `apps/web/src/app/(public)/`, add components in `sections/` or `ui/`
4. **Testing**: Write unit tests in `__tests__/` directories (Vitest)

### Working with D1 Database

- **Schema changes**: Edit `drizzle/schema.sql`, then run migrations via `wrangler d1 migrations apply`
- **Local testing**: Use `--local` flag in `wrangler dev` for local D1 instance
- **Seeding**: Run `npm run seed:d1` to populate demo data
- **Querying**: Use `wrangler d1 execute` for ad-hoc SQL

### Cloudflare Bindings

Worker environment (`wrangler.toml`):
```toml
[[d1_databases]]
binding = "DB"
database_name = "browserscan-db"

[[r2_buckets]]
binding = "REPORTS_BUCKET"
bucket_name = "browserscan-reports"

[vars]
ENVIRONMENT = "dev"
```

Access in worker: `c.env.DB`, `c.env.REPORTS_BUCKET`, `c.env.IPINFO_TOKEN`, etc.

Access in Next.js: `getCloudflareContext()` (via `@opennextjs/cloudflare`)

### Design System Enforcement

See `docs/DESIGN_SYSTEM.md` for complete guidelines. Key rules:

- **Colors**: Zinc palette for backgrounds/text, Emerald (safe), Rose (risk), Amber (warn), Sky (info)
- **Typography**: Geist Sans (UI), Geist Mono (data/code), uppercase labels with `tracking-[0.2em]`
- **Layout**: Bento Grid with `col-span` variants, cards have `border-zinc-800` + subtle gradient backgrounds
- **Animations**: Use `framer-motion` for score rings, status dots, spotlights; check `prefers-reduced-motion`
- **Accessibility**: WCAG AA contrast (4.5:1), `aria-label` on icon buttons, keyboard focus rings

### Performance & Optimization

**Frontend**:
- SSG pages where possible (knowledge base, static tools)
- Lazy load heavy components (maps, charts) with `next/dynamic`
- Use TanStack Query for polling instead of intervals

**Worker**:
- Use `Promise.allSettled()` for concurrent external API calls
- Implement exponential backoff for retries
- Compress `report_blob` with gzip/brotli before D1 insert
- Cache static endpoints with Cache API

**Database**:
- Use transactions for batch writes
- Add indexes for frequent queries (already defined in schema)
- Pagination with `LIMIT/OFFSET` or cursor-based

## Security Practices

- **Secrets Management**: Use `wrangler secret` for production, `.env.local` for development (gitignored)
- **Rate Limiting**: KV-based token bucket per IP (planned middleware)
- **Turnstile**: Required for scan endpoints to prevent abuse
- **IP Anonymization**: Blur IP addresses in UI, reveal on hover
- **PDF Links**: Short-lived signed URLs with HMAC
- **Logs**: Production logs anonymized, exported via Cloudflare Logpush

## Testing Strategy

**Unit Tests** (Vitest):
- Scoring algorithm logic
- Type validation (Zod schemas)
- Utility functions in `apps/web/src/lib/`

**Integration Tests**:
- Use Miniflare to simulate Worker environment
- Test API endpoints with mock D1/R2 bindings

**E2E Tests** (Playwright):
- Full scan flow: Dashboard → Start scan → View report → Generate PDF
- Tool pages: IP lookup, leak test, port scan
- `npm run test:e2e` (to be configured)

## Documentation Reference

- **Architecture Deep Dive**: `docs/ARCHITECTURE.md` (system design, data flow, module breakdown)
- **Design System**: `docs/DESIGN_SYSTEM.md` (colors, typography, components, animations)
- **Type Definitions**: `packages/types/src/index.ts` (source of truth for all data structures)
- **Database Schema**: `drizzle/schema.sql` (D1 table definitions)

## Important Notes

- **OpenNext Cloudflare**: Uses `@opennextjs/cloudflare` adapter for Pages deployment, enables SSR/Edge Runtime
- **Workspace Dependencies**: `@browserscan/types` uses `file:` protocol, installed via npm workspaces
- **Worker Name**: `browserscan-network-injector` (defined in `wrangler.toml`)
- **Environment Detection**: Worker checks `c.env.ENVIRONMENT` for dev/staging/production logic
- **Sample Data**: Fallback to `sampleReport` when D1 is empty or unavailable
- **Monorepo Root Commands**: Always run workspace-specific commands from root using `npm run <script> --workspace <name>` or use the provided aliases
