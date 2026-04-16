# Changelog

All notable changes to this project. Newest first.

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
