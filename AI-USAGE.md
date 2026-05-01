# AI Usage — Milestones 5 & 6

This file documents how AI tools were used in Milestones 5 and 6. The
cross-milestone reflection (what worked, what didn't, lessons learned)
lives at [docs/ai-reflection.md](docs/ai-reflection.md). Earlier
milestones are recorded in the README's AI Tooling Disclosure section
and in [docs/ai-usage-m4.md](docs/ai-usage-m4.md).

## Milestone 6 — Production Deployment, CI/CD, Documentation

### Tools used

- **Claude Code (CLI agent).** Used for the GitHub Actions YAML drafts,
  the deployment runbook, and as a writing partner for the user/admin
  guides, AI reflection, and architecture docs.
- **GitHub Copilot.** Used for autocomplete on the workflow YAML
  (matrix steps, action versions) and on the SWA config JSON.

### Where AI helped

- **GitHub Actions workflows.** I described what each workflow needed
  (build, test, deploy with the publish profile) and Claude drafted
  the YAML. I tightened them: paths-based triggers so unrelated commits
  don't redeploy, an `environment: production` annotation on the deploy
  job, and a `build-and-test` job that gates the deploy job.
- **Deployment runbook.** Claude drafted [docs/deployment.md](docs/deployment.md)
  from a list of resources (resource group, SQL, App Service, SWA) plus
  the secret-handling rules from the lab workshop. I edited for
  accuracy against the actual resource names and added the troubleshooting
  table from problems I'd actually hit.
- **User guide and admin guide.** I described each page and the actions
  available; Claude drafted the prose. I cut about a third of the
  marketing-style language from the first draft.
- **Architecture and ERD updates.** Claude regenerated the diagrams to
  match what actually shipped (no more messaging/reviews/reports in the
  M1 sketch). I confirmed entity relationships against the actual EF
  Core models.
- **AI reflection document.** I supplied the structure and the bullet
  points; Claude wrote the prose. I edited every paragraph for honesty.

### Where I overrode the AI

- **Hardcoded URLs in the workflow.** The first draft of `deploy-api.yml`
  embedded my App Service name in multiple places. I pulled it into a
  workflow `env` block at the top so renaming is one line.
- **Static Web App PR previews.** The initial `deploy-frontend.yml`
  didn't include the `close_pull_request` job; I added it back so
  preview environments are torn down on PR close.
- **CORS config.** The first draft of the production CORS code used
  `AllowAnyOrigin()`. I rejected that and made the production list
  config-driven via `Cors:AllowedOrigins` while keeping the localhost
  defaults for dev.
- **Documentation tone.** Multiple drafts over-promised features (e.g.
  "real-time notifications", "encrypted at rest" for things we don't
  do). I cut the unfounded claims.

### What I verified by hand

- `dotnet build` clean (zero warnings).
- `dotnet test` — 17 passing.
- `npm test -- --run` — 13 passing.
- `npx playwright test` — 1 passing (full happy path).
- `npm run build` produces a clean production bundle that picks up
  `VITE_API_URL`.
- The CI workflow file is valid (paths, action versions, secret
  references).
- Manual scripted flows from [docs/test-plan.md](docs/test-plan.md) on
  Chrome, Firefox, Safari, Edge, and a phone viewport.

---

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
