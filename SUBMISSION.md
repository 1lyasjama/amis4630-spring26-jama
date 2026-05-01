# Submission — Milestone 6 (final)

**Repository:** https://github.com/1lyasjama/amis4630-spring26-jama
**Branch graders should pull:** `main`
**Tag:** `v1.0`

## Live deployment (Milestone 6)

| Component | URL                                                          |
|-----------|--------------------------------------------------------------|
| Frontend  | `https://buckeye-frontend-jama.azurewebsites.net`          |
| API       | `https://buckeye-api-jama.azurewebsites.net`                 |
| Swagger   | `https://buckeye-api-jama.azurewebsites.net/swagger`         |

HTTPS is enforced on both services. The CI/CD pipelines in
[.github/workflows/](.github/workflows/) ship every push to `main` to
Azure (after running the full test suite).

## Milestone 6 documentation index

| Deliverable                | File                                       |
|----------------------------|--------------------------------------------|
| Comprehensive README       | [README.md](README.md)                     |
| Deployment runbook         | [docs/deployment.md](docs/deployment.md)   |
| Updated architecture       | [docs/system-architecture.md](docs/system-architecture.md) |
| Updated database schema    | [docs/database-erd.md](docs/database-erd.md) |
| User guide                 | [docs/user-guide.md](docs/user-guide.md)   |
| Admin guide                | [docs/admin-guide.md](docs/admin-guide.md) |
| E2E test plan              | [docs/test-plan.md](docs/test-plan.md)     |
| QA report                  | [docs/qa-report.md](docs/qa-report.md)     |
| AI reflection (M6)         | [docs/ai-reflection.md](docs/ai-reflection.md) |
| AI usage summary           | [AI-USAGE.md](AI-USAGE.md)                 |
| Changelog                  | [CHANGELOG.md](CHANGELOG.md)               |

## Milestone 6 pre-submission checklist

- [x] Frontend deployed to Azure Static Web Apps with HTTPS
- [x] Backend deployed to Azure App Service with HTTPS
- [x] Azure SQL Database provisioned and connected via App Service connection string
- [x] All runtime secrets (`Jwt:Key`, connection string) live in App Service configuration
- [x] CI workflow ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs on every push and PR
- [x] Backend deploy workflow ([.github/workflows/deploy-api.yml](.github/workflows/deploy-api.yml)) deploys on push to `main`
- [x] Frontend deploy workflow ([.github/workflows/deploy-frontend.yml](.github/workflows/deploy-frontend.yml)) deploys on push to `main`
- [x] Tests gate every deploy
- [x] Cross-browser sweep on Chrome, Firefox, Safari, Edge ([docs/qa-report.md](docs/qa-report.md))
- [x] Mobile responsiveness verified on phone + tablet viewports
- [x] M6 bug fixes documented in [docs/qa-report.md](docs/qa-report.md) and [CHANGELOG.md](CHANGELOG.md)
- [x] AI tool reflection (2-3 pages) at [docs/ai-reflection.md](docs/ai-reflection.md)
- [x] User guide and admin guide written
- [x] README documents tech stack with versions, setup, deployment, env vars, Swagger link

---

# Milestone 5 — Submission (preserved for graders)

## Test credentials (seeded automatically on first run)

| Role  | Email                 | Password    |
|-------|-----------------------|-------------|
| Admin | `admin@buckeye.test`  | `Admin123!` |
| User  | `user@buckeye.test`   | `User1234!` |

Both accounts are created by `api/Data/SeedData.cs` the first time the API
starts against an empty database, so a fresh clone gives you a working
admin and a working regular user without any extra steps.

## Required user-secrets

The JWT signing key (and the rest of the JWT settings) are read from .NET
user-secrets, **not** committed to `appsettings.json`. To run locally, set:

```bash
cd api
dotnet user-secrets set "Jwt:Key" "ThisIsADevelopmentOnlySecretKey_ChangeInProduction_MinimumLength32Characters!"
dotnet user-secrets set "Jwt:Issuer" "BuckeyeMarketplace"
dotnet user-secrets set "Jwt:Audience" "BuckeyeMarketplaceUsers"
# Optional overrides for seeded credentials:
dotnet user-secrets set "AdminSeed:Email" "admin@buckeye.test"
dotnet user-secrets set "AdminSeed:Password" "Admin123!"
```

## Security practices applied (W13 checklist)

1. **JWT signing key in user-secrets, never in source.** `Program.cs`
   throws on startup if `Jwt:Key` isn't configured, and the value lives in
   `dotnet user-secrets`, so the secret never ends up in git.
2. **Password hashing via ASP.NET Core Identity.** `AuthController` calls
   `UserManager.CreateAsync` / `CheckPasswordAsync`; we never roll our own
   hash. Identity is configured with min-length 8, requires a digit, and
   requires an uppercase letter (`Program.cs`).
3. **Broken-object-level-authorization defenses.** Every protected
   endpoint scopes its query to `User.FindFirstValue(ClaimTypes.NameIdentifier)`
   from the JWT — e.g. `GET /api/orders/mine` filters orders by the JWT's
   user id, not a user id passed in the URL. Cart and order endpoints use
   `[Authorize]`; admin endpoints use `[Authorize(Roles = "Admin")]`.
4. **Parameterized queries via LINQ + EF Core.** All data access goes
   through `AppDbContext` LINQ, so EF emits parameterized SQL — there are
   no `FromSqlRaw` calls or string-interpolated SQL anywhere in the API.
5. **Secure response headers + HTTPS redirect.** `Program.cs` adds
   `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and
   `Referrer-Policy: no-referrer` to every response, and enables
   `UseHttpsRedirection` in non-Development environments.

## Bonus: refresh-token mechanism

`POST /api/auth/register` and `POST /api/auth/login` now also return a
refresh token (14-day lifetime, persisted in a new `RefreshTokens` table).
`POST /api/auth/refresh` validates the presented refresh token, revokes it
(rotation, with `ReplacedByToken` recorded), and returns a fresh access
+ refresh pair. Reusing a revoked refresh token returns 401, defending
against token-replay. The frontend `apiFetch` helper transparently retries
any 401 once after silently refreshing, keeping the user signed in past
the 8-hour access-token expiry.

## AI usage documentation

See [AI-USAGE.md](AI-USAGE.md) for how Claude Code was used during this
milestone.

## Pre-submission checklist

- [x] `dotnet build` succeeds with zero warnings
- [x] `dotnet test` passes — 17 tests (3 unit, 14 integration/auth/cart, including the bonus refresh-token rotation test)
- [x] `npm test -- --run` passes — 13 tests across 3 files
- [x] `npx playwright test` runs the committed E2E spec end-to-end
- [x] No secrets committed (`git grep -i "Jwt:Key\|password\|secret"` reviewed)
- [x] Admin user seeded on a fresh database
- [x] Regular test user seeded on a fresh database

## Run-from-scratch quickstart

```bash
# 1. Backend
cd api
dotnet user-secrets set "Jwt:Key" "ThisIsADevelopmentOnlySecretKey_ChangeInProduction_MinimumLength32Characters!"
dotnet run

# 2. Frontend (separate terminal)
cd frontend
npm install
npm run dev

# 3. Tests
dotnet test                         # backend
cd frontend && npm test -- --run    # frontend unit/component
cd frontend && npx playwright install chromium && npx playwright test   # E2E
```
