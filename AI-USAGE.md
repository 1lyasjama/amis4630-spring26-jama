# AI Usage — Milestone 5

This milestone was built with Claude Code (Anthropic's CLI agent) acting as
a pair-programmer. Below is an honest account of how AI assistance was used
and where I made the calls myself.

## Tools used

- **Claude Code (CLI, model `claude-opus-4-6`).** Primary assistant for
  scaffolding, refactoring, debugging, and writing tests.
- **Playwright MCP integration.** Used through Claude to scaffold and
  iterate on the end-to-end spec at `frontend/e2e/checkout.spec.ts`. See
  `docs/e2e-run.md` for the prompts and the failures the agent corrected.

## Where AI helped

- **Auth backend scaffolding.** I described the requirements (Identity, JWT,
  password rules, role seeding) and Claude generated the first cuts of
  `AuthController`, `JwtTokenService`, `PasswordRules`, and the JWT setup in
  `Program.cs`. I reviewed each file, tightened claim names, and made sure
  the JWT key was loaded from `dotnet user-secrets` rather than
  `appsettings.json`.
- **Order flow.** `OrdersController`, the cart-to-order mapping, and the
  React `CheckoutPage` / `OrderConfirmationPage` / `OrderHistoryPage` were
  drafted with Claude. I provided the DTO shapes and the broken-object-level
  authorization rule (user id must come from the JWT, not from the URL).
- **Frontend auth context.** Claude wrote the initial `AuthContext`,
  `authReducer`, and `ProtectedRoute`. I asked it to use a reducer + typed
  actions so the unit test for the reducer would be easy to write.
- **Test scaffolding.** Claude wrote the first version of the xUnit and
  Vitest tests; I ran them, reviewed the failures, and asked it to either
  fix the test or fix the production code depending on which was wrong. The
  `LoginForm` malformed-email test, for example, surfaced a real bug:
  HTML5's native `type="email"` validation was short-circuiting our custom
  validator. The fix (`noValidate` on the form) came from that loop.
- **Playwright spec.** The agent generated `e2e/checkout.spec.ts` and the
  `playwright.config.ts` webServer block. The first run failed twice (JWT
  key missing because `--no-launch-profile` skipped Development env;
  Logout was a `<button>`, not a link); both fixes are documented in
  `docs/e2e-run.md`.

## Where I overrode the AI

- **Security boundary on `/api/orders/mine`.** The first draft accepted a
  user id query parameter. I rejected that and required the controller to
  read the id from `ClaimTypes.NameIdentifier` on the JWT.
- **Seed data for a regular test user.** Claude originally only seeded the
  admin. I asked for a second seeded `User` so graders have working
  credentials for both roles without needing to register.
- **Secrets handling.** Claude initially put a placeholder JWT key in
  `appsettings.Development.json`. I moved it to `dotnet user-secrets` and
  added a startup guard in `Program.cs` that throws if the key isn't
  configured.

## What I verified by hand

- `dotnet build` clean
- `dotnet test` (16 passing)
- `npm test -- --run` (13 passing)
- `npx playwright test` (1 passing, full happy path)
- `git grep -i "Jwt:Key\|password\|secret"` review for accidentally
  committed secrets
- Manual click-through of the admin dashboard (product CRUD + order
  status update) against a fresh database
