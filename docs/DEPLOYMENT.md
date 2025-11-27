# BrowserScan.org — 部署与运维指南

_版本：2025-11-27_

## 1. 环境变量与 Secrets
| Key | 说明 | 存储位置 |
| --- | --- | --- |
| `CF_ACCOUNT_ID` | Cloudflare 账户 ID | GitHub Actions secret / `.env.local` |
| `CF_API_TOKEN` | 至少包含 Pages + Workers + D1 + R2 权限 | Wrangler secret / GitHub secret |
| `D1_DATABASE_ID` | `browserscan-db` ID | `.env.local` |
| `R2_BUCKET_NAME` | `browserscan-reports` | 同上 |
| `TURNSTILE_SITE_KEY` | Turnstile 前端 key | Cloudflare Pages 环境变量 |
| `TURNSTILE_SECRET_KEY` | Turnstile 验证 secret | Wrangler secret |
| `IPINFO_TOKEN` | IP intelligence token | Worker secret |
| `NEXT_PUBLIC_SITE_URL` | 站点 URL | Pages env |
| `PDF_SIGNING_KEY` | HMAC 秘钥 | Worker secret |

> `.env.local` **永不提交**，`cp .env.example .env.local` 后本地填入。生产仅通过 Cloudflare Secret/Actions secret 注入。

## 2. 本地开发流程
```bash
npm install
npm run dev:web          # Next.js 前端 (localhost:3000)
npm run dev:worker       # Miniflare 运行 Worker (http://127.0.0.1:8787)
npm run dev:full         # 并行启动 web + worker + tailwind watch
```
- `wrangler.toml` 绑定：
  ```toml
  [[d1_databases]]
  binding = "DB"
  database_name = "browserscan-db"
  database_id = "..."
  ```
- 本地 D1：`npx wrangler d1 migrations apply browserscan-db --local`。

## 3. Cloudflare Pages 部署
### 3.1 使用 Wrangler CLI
1. `npx wrangler login`
2. `npm run pages:build` (调用 `@cloudflare/next-on-pages` 输出 `.vercel/output/static`)
3. `npx wrangler pages deploy .vercel/output/static --project-name=browserscan-web`
4. 设置环境变量（Production + Preview 两套）：
   ```bash
   npx wrangler pages project secret put TURNSTILE_SITE_KEY
   npx wrangler pages project secret put NEXT_PUBLIC_SITE_URL
   ```

### 3.2 GitHub 集成
- Cloudflare Pages 连接 `BrowserScan.org` 仓库。
- Build command: `npm run pages:build`
- Output dir: `.vercel/output/static`
- Node version: `20.x`
- 设置 secrets 同上。

## 4. Workers & D1 部署
### 4.1 初始化
```bash
npx wrangler d1 create browserscan-db
npx wrangler d1 execute browserscan-db --file=drizzle/schema.sql
npx wrangler r2 bucket create browserscan-reports
```
### 4.2 发布 Worker
```bash
npm run build:worker
npx wrangler deploy workers/network-injector/src/worker.ts --name browserscan-worker
```
- 绑定资源：
  ```toml
  [[r2_buckets]]
  binding = "REPORTS_BUCKET"
  bucket_name = "browserscan-reports"

  [[kv_namespaces]]
  binding = "IP_CACHE"
  id = "..."

  [[d1_databases]]
  binding = "DB"
  database_name = "browserscan-db"
  database_id = "..."
  ```

## 5. GitHub Actions 工作流
1. **CI (`.github/workflows/ci.yml`)**
   - 触发：PR、`main` push。
   - 步骤：`npm ci` → `npm run lint` → `npm run test` → `npm run typecheck` → `npm run pages:build`。
2. **Deploy Pages (`deploy-pages.yml`)**
   - 触发：`main` push。
   - 使用 `CLOUDFLARE_API_TOKEN` 调用 `wrangler pages deploy`。
3. **Deploy Worker (`deploy-worker.yml`)**
   - 触发：`main` push 或 tag。
   - 步骤：`npm run build:worker` → `wrangler deploy`。
4. **Database Migration (`migrate.yml`)**
   - 手动触发（workflow_dispatch）。
   - 运行 `npx wrangler d1 migrations apply browserscan-db`。
5. **Seed Script (`npm run seed:d1`)**
   - `scripts/seed-demo.ts` 使用 `wrangler d1 execute` 将 demo 报告写入 Cloudflare D1，用于本地/预览数据填充。

> GitHub 仓库为 public，Actions 中所有 secrets 通过 `actions/vars`/`secrets` 管理，Workflow 中禁止直接 echo。

## 6. 生产验证 Checklist
1. `wrangler pages deployment list` 确认最新版本 `production` 状态为 `ACTIVE`。
2. `wrangler tail browserscan-worker` 观察无错误日志。
3. 打开 `https://browserscan.org` 手动执行：
   - Dashboard 自动扫描并显示评分；
   - `/report/network` 展示数据；
   - `/tools/ip-lookup` 查询成功；
   - PDF 导出下载可用。
4. Turnstile 验证成功后 Worker 返回 200。
5. D1 新增记录 `SELECT count(*) FROM scans;` /

## 7. 回滚策略
- Pages：`wrangler pages deployment rollback --project-name browserscan-web --deployment-id <id>`。
- Worker：`wrangler versions rollback browserscan-worker <version_id>`。
- 数据：
  - D1 回滚使用备份 SQL（每日导出 `wrangler d1 export`）。
  - R2 删除通过 Lifecycle 规则；如需恢复，保留 7 天版本。

## 8. 监控与日志
- 启用 Cloudflare Pages Insights（访问量、错误率）。
- Worker 使用 `wrangler tail` + Logpush (to R2/Storage)。
- 自建 `/api/health` 返回：`version`, `uptime`, `d1`, `r2`, `kv` 状态。
- Cron Job 发送每日摘要至 Slack/Webhook：扫描次数、平均分、错误计数。

## 9. 灰度/多环境策略
- 分支 `dev` → Cloudflare Pages preview 环境。
- `main` → production。
- Worker 使用 `--env dev` `--env prod` 切换
  ```toml
  [env.dev]
  vars = { ENVIRONMENT = "dev" }
  [[env.dev.d1_databases]] ...
  ```
- 外部 API token 区分测试/生产，避免污染。

## 10. 安全自检
- `npm run lint:secrets`（gitleaks）在 CI 中执行。
- 确认 `.gitignore` 包含 `.env*`, `*.pem`, `reports/*.pdf`。
- 定期 rotate Cloudflare / GitHub tokens (每 90 天)。
