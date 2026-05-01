# Changelog

All notable changes to this project. Newest first.

## Milestone 6 — Production Deployment, CI/CD, Documentation (April 30, 2026)

### Added
- **CI/CD pipelines.** Three GitHub Actions workflows in
  [.github/workflows/](.github/workflows/):
  - `ci.yml` — runs `dotnet test`, `npm test -- --run`, and a production
    `npm run build` on every push and PR.
  - `deploy-api.yml` — builds, tests, publishes, and deploys the .NET
    API to Azure App Service via the publish profile in
    `secrets.AZURE_API_PUBLISH_PROFILE`.
  - `deploy-frontend.yml` — runs Vitest, then deploys the React bundle
    to Azure Static Web Apps via `secrets.AZURE_STATIC_WEB_APPS_API_TOKEN`.
    Includes a `close_pull_request` job that tears down PR preview
    environments.
- **Production deployment configuration.**
  - `frontend/staticwebapp.config.json` — SPA fallback so deep links
    survive refresh, plus production security headers
    (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
    `Strict-Transport-Security`).
  - `frontend/.env.production` — sets `VITE_API_URL` to the deployed
    API hostname.
- **Deployment runbook** at [docs/deployment.md](docs/deployment.md):
  Azure CLI commands for one-time provisioning, "what goes where" secret
  table, troubleshooting matrix.
- **User guide** at [docs/user-guide.md](docs/user-guide.md): browse,
  register, login, cart, checkout, order history, logout flows with
  screenshots.
- **Admin guide** at [docs/admin-guide.md](docs/admin-guide.md):
  product CRUD and order status management, including the security
  model.
- **E2E test plan** at [docs/test-plan.md](docs/test-plan.md) and
  matching **QA report** at [docs/qa-report.md](docs/qa-report.md):
  scripted manual flows, cross-browser sweep (Chrome / Firefox /
  Safari / Edge), mobile responsiveness sweep.
- **AI tool reflection** at [docs/ai-reflection.md](docs/ai-reflection.md).
- **Comprehensive README rewrite** with full tech stack (with
  versions), local setup, deployment, env vars, Swagger link, endpoint
  table, and a documentation index.
- **Updated architecture and ERD** documents reflecting what actually
  shipped (auth, cart, orders, refresh tokens) — superseding the
  Milestone 1 sketches.

### Changed
- `frontend/src/services/api.ts` reads `import.meta.env.VITE_API_URL`
  at build time (with a localhost fallback for dev), so the production
  bundle hits the deployed API instead of localhost.
- `api/Program.cs` CORS allow-list now reads additional origins from
  the `Cors:AllowedOrigins` configuration array; localhost defaults
  stay so dev keeps working without config.

### Fixed (M6 testing)
- **B1.** Hardcoded API base URL in the frontend (`http://localhost:5023`)
  prevented the deployed bundle from reaching the production API.
- **B2.** CORS allow-list was hardcoded to localhost only; the deployed
  frontend was blocked by the browser.
- **B3.** SPA deep links 404'd on refresh on Azure Static Web Apps.

## Milestone 5 — Authentication, Security & Order Processing (April 15, 2026)

### Added
- ASP.NET Core Identity with JWT bearer authentication. `POST /api/auth/register`
  and `POST /api/auth/login` issue signed JWTs; password rules enforce min
  length 8, one digit, one uppercase letter.
- Role seeding (`Admin`, `User`) plus a seeded admin (`admin@buckeye.test`)
  and a seeded regular user (`user@buckeye.test`) so a fresh database is
  immediately usable.
- Protected cart and order endpoints (`[Authorize]`); admin-only product
  CRUD and order-status endpoints (`[Authorize(Roles = "Admin")]`).
- `POST /api/orders` to create an order from the current user's cart
  (clears the cart, generates a confirmation number) and
  `GET /api/orders/mine` returning only the JWT user's orders.
- `PUT /api/orders/{id}/status` for admin order-status updates.
- **Refresh token mechanism (bonus).** `POST /api/auth/refresh` accepts a
  refresh token, revokes it (rotation), and returns a new access + refresh
  pair. Refresh tokens are persisted in a new `RefreshTokens` table with a
  14-day lifetime. The frontend `apiFetch` helper transparently retries any
  401 once after refreshing, so the user stays signed in past the 8-hour
  access-token expiry.
- React `AuthContext`, `LoginForm`, `RegisterForm`, `ProtectedRoute`, and
  protected routes for `/cart`, `/checkout`, `/orders`, `/orders/confirmation/:id`,
  `/admin/*`. JWT is stored in `localStorage` and attached to every API
  request via the shared `apiFetch` helper.
- Checkout page, order confirmation page, order history page, admin
  dashboard, admin product CRUD page, admin orders page.
- xUnit test project `BuckeyeMarketplaceApi.Tests/` with unit tests for
  `OrderCalculator` and `PasswordRules`, plus a `WebApplicationFactory<Program>`
  integration test for the auth flow against the in-memory provider.
- Vitest unit/component tests for the validation helpers, the auth
  reducer, and `<LoginForm />`.
- Playwright happy-path E2E spec at `frontend/e2e/checkout.spec.ts` plus
  `playwright.config.ts` with a `webServer` block that auto-starts the
  API and Vite. See `docs/e2e-run.md`.

### Security
- JWT signing key moved out of `appsettings*.json` and into
  `dotnet user-secrets`. `Program.cs` throws on startup if `Jwt:Key` is
  missing.
- Every protected endpoint scopes its query to the user id from the JWT
  (`ClaimTypes.NameIdentifier`) instead of trusting URL parameters —
  defense against broken object-level authorization (OWASP API1).
- All data access goes through EF Core LINQ; no `FromSqlRaw` or
  string-interpolated SQL anywhere.
- Added security response headers (`X-Content-Type-Options: nosniff`,
  `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`) and
  `UseHttpsRedirection` in non-Development environments.

### Fixed
- `<LoginForm />` malformed-email validation never ran because HTML5's
  native `type="email"` check short-circuited the submit. Added
  `noValidate` to the auth forms so our custom validator is the single
  source of truth.

## Milestone 4 — Shopping Cart (earlier)

- Cart entity, `CartController`, `CartContext`, cart UI. See git history.
