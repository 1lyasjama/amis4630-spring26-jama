# Lab Evaluation Report

**Student Repository**: `1lyasjama-amis4630-spring26-jama`  
**Date**: May 3, 2026  
**Rubric**: `grading/milestone-6/rubric.md`

## 0. Build & Run Status

| Component           | Build | Runs | Notes                                                                                                                                        |
| ------------------- | ----- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded (0 warnings). `dotnet run` started on http://localhost:5023.                                                        |
| Frontend (React/TS) | ✅    | ✅   | `tsc -b && vite build` succeeded. Vite dev server started on http://localhost:5173.                                                          |
| API Endpoints       | —     | ✅   | GET /api/products → 200 (10 items). POST /api/auth/login → 200 (JWT). GET /api/cart → 401 (unauth) / 200 (auth). GET /api/orders/mine → 200. |
| Backend Tests       | —     | ✅   | `dotnet test`: 17/17 passed (0 failed, 0 skipped).                                                                                           |
| Frontend Tests      | —     | ✅   | `vitest run`: 13/13 passed across 3 test files.                                                                                              |

## 1. Project Structure

| Expected                       | Found                                                               | Status |
| ------------------------------ | ------------------------------------------------------------------- | ------ |
| `.github/workflows/` (CI/CD)   | `.github/workflows/ci.yml`, `deploy-api.yml`, `deploy-frontend.yml` | ✅     |
| `api/` (ASP.NET Core backend)  | `api/` with controllers, models, services, migrations               | ✅     |
| `frontend/` (React/TS SPA)     | `frontend/` with Vite, React 19, TypeScript                         | ✅     |
| `BuckeyeMarketplaceApi.Tests/` | Present with 17 passing tests                                       | ✅     |
| `docs/` (documentation)        | `docs/` with 11 markdown files + screenshots + ADRs                 | ✅     |
| `README.md`                    | Comprehensive README with tech stack, setup, endpoints              | ✅     |
| `SUBMISSION.md`                | Present with live URLs, checklists, credentials                     | ✅     |
| `CHANGELOG.md`                 | Present with M5 and M6 entries                                      | ✅     |
| `AI-USAGE.md`                  | Present covering M5 + M6                                            | ✅     |

## 2. Rubric Scorecard

| #   | Requirement                                                                 | Points | Status | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --- | --------------------------------------------------------------------------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Production Deployment** — Flawless deployment, HTTPS, professional setup  | 5      | ✅ Met | SUBMISSION.md provides live URLs for frontend (`buckeye-frontend-jama.azurewebsites.net`), API (`buckeye-api-jama.azurewebsites.net`), and Swagger. [docs/deployment.md](docs/deployment.md) documents full Azure provisioning (App Service, Azure SQL, SWA) with resource layout, secret management table, and troubleshooting. HTTPS enforced via `staticwebapp.config.json` (L7–11: HSTS header with `max-age=63072000`). Secrets stored in App Service config, never in source. `Program.cs` throws on missing `Jwt:Key`.                                                        |
| 2   | **CI/CD Pipeline** — Automated pipeline working perfectly                   | 4      | ✅ Met | Three workflow files: [ci.yml](.github/workflows/ci.yml) runs on every push/PR with backend build+test and frontend lint+test+build. [deploy-api.yml](.github/workflows/deploy-api.yml) has path-based triggers, build-and-test gate job, artifact upload, and Kudu ZipDeploy with `environment: production`. [deploy-frontend.yml](.github/workflows/deploy-frontend.yml) mirrors the pattern for the frontend. Tests gate every deploy — both workflows run the full test suite before shipping.                                                                                   |
| 3   | **Testing & QA** — Comprehensive testing, well-documented                   | 4      | ✅ Met | 17 backend tests (3 unit + 14 integration via `WebApplicationFactory`), 13 frontend tests (Vitest + RTL), 1 Playwright E2E spec — all passing. [docs/test-plan.md](docs/test-plan.md) documents 8 scripted manual flows, cross-browser sweep (Chrome/Firefox/Safari/Edge), and mobile responsiveness testing. [docs/qa-report.md](docs/qa-report.md) records pass/fail for all flows across browsers. 3 bugs found and fixed during M6 testing (B1–B3), properly documented with root cause and fix.                                                                                 |
| 4   | **Technical Docs** — Excellent documentation, comprehensive                 | 5      | ✅ Met | [docs/system-architecture.md](docs/system-architecture.md) — Mermaid architecture diagram, 4 architectural layers, 3 key request flows, deployment topology table. [docs/database-erd.md](docs/database-erd.md) — Mermaid ERD with all 8 entities, column details, and design notes. [docs/deployment.md](docs/deployment.md) — full Azure provisioning runbook with `az` commands, secret management table, CI/CD pipeline docs. 5 ADRs in `docs/adr/`. README has full tech stack with versions, endpoint summary, env var table, project structure tree, and documentation index. |
| 5   | **User Docs** — Professional user guide with screenshots                    | 4      | ✅ Met | [docs/user-guide.md](docs/user-guide.md) covers 5 user flows (browse, register/login, cart, checkout, order history) with test credentials and references 2 screenshots (`Buckeye Product List.png`, `Buckeye Product Detail.png`). [docs/admin-guide.md](docs/admin-guide.md) covers sign-in, product CRUD, and order-status management with admin test credentials. Both guides are well-structured and task-oriented.                                                                                                                                                             |
| 6   | **AI Reflection** — Insightful reflection, specific examples, deep analysis | 3      | ✅ Met | [docs/ai-reflection.md](docs/ai-reflection.md) is a thorough ~2-page reflection covering: tools used (Copilot, Claude, Playwright MCP), use across all SDLC phases, 3 specific prompt→outcome examples with concrete details (orders controller, Playwright spec, CI/CD workflows), balanced "what worked / what didn't" sections, honest productivity estimate (30–40%), and 5 actionable lessons learned. Notably self-critical about security gaps in AI output (OWASP API1 repeated violation) and learning gaps from over-reliance.                                             |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **Screenshot coverage in user guide**: [docs/user-guide.md](docs/user-guide.md) references only 2 screenshots (product list and product detail). Adding screenshots for the cart, checkout, order confirmation, and admin pages would make the guide more professional and useful for end users.

- **Deployment doc references SWA but deploy workflow uses App Service**: [docs/deployment.md](docs/deployment.md) describes the frontend hosted on Azure Static Web Apps, but [deploy-frontend.yml](.github/workflows/deploy-frontend.yml) actually deploys to an Azure App Service via Kudu ZipDeploy (not via the SWA action). The CHANGELOG similarly mentions SWA. This inconsistency between docs and implementation should be reconciled for clarity.

- **Lint errors allowed to pass**: [ci.yml](.github/workflows/ci.yml) L47 sets `continue-on-error: true` on the lint step. While pragmatic, this means lint failures are silently ignored in CI. Consider removing this once lint issues are resolved so regressions are caught.

- **Hardcoded development secrets in SUBMISSION.md**: [SUBMISSION.md](SUBMISSION.md) documents the full `dotnet user-secrets set` command with an example key value. While labeled "development only," this pattern could encourage copying the same key to production. A brief note reminding readers to generate a unique production key would strengthen the guidance.

## 6. Git Practices Coaching (Non-Scoring)

- **Tagging**: The repository is tagged as `v1.0` per submission requirements, which is good practice for marking release points.

- **Changelog discipline**: [CHANGELOG.md](CHANGELOG.md) has detailed per-milestone entries with Added/Changed/Fixed sections following Keep a Changelog conventions — this is professional-grade and a strong habit to continue.

---

**25/25** — Excellent submission across all criteria. The coaching notes above (screenshot coverage, doc/implementation consistency for SWA vs App Service, lint CI gate, dev secret guidance) are suggestions for professional growth, not scoring deductions.
