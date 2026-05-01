# AI Tool Reflection — Buckeye Marketplace

**Author:** Ilyas Jama · **Course:** AMIS 4630 · **Date:** April 30, 2026

## Tools used

- **GitHub Copilot** (in-editor autocomplete) — used for boilerplate:
  property names, JSX, fetch/axios scaffolding, EF Core configuration,
  exhaustive reducer cases.
- **Claude (Anthropic CLI agent)** — used as a pair-programmer for
  larger units of work: scaffolding controllers, drafting React pages,
  writing tests, debugging, and generating documentation.
- **Playwright MCP via Claude** — used in M5 to generate the E2E
  happy-path spec; the prompts and the failures the agent corrected
  are recorded in [docs/e2e-run.md](e2e-run.md).

## Use across SDLC phases

- **Planning (M1).** I wrote the business idea, prioritization, and
  ADRs myself; Claude only sanity-checked that my ADR template followed
  the standard Michael-Nygard format.
- **Design (M1–M2).** Diagrams were mine; Claude reviewed them once
  and flagged that the M1 ERD had messaging entities that wouldn't
  ship — I pruned them for M6 to match what actually shipped.
- **Implementation (M3–M5).** Highest-leverage use. I'd describe a
  unit's contract, Claude would draft, I'd edit and run tests.
- **Testing (M5–M6).** Claude drafted xUnit/Vitest tests; running them
  caught both real bugs and bad tests in roughly equal measure.
- **Deployment (M6).** Claude drafted the GitHub Actions YAML and the
  deployment runbook; I tightened paths-based triggers, the
  `environment: production` annotation, and a build-test gate.
- **Documentation (M6).** This document and the user/admin guides
  were drafted with Claude and edited.

## Specific examples (prompts and outcomes)

**Example 1 — Orders controller (M5).** I prompted: *"Scaffold an
`OrdersController` with `POST /api/orders` (create from current user's
cart), `GET /api/orders/mine`, and `PUT /api/orders/{id}/status` (admin
only). Read the user id from `ClaimTypes.NameIdentifier`, never from
the URL. Use FluentValidation."* The first draft was ~80% there. I
rejected a `userId` query parameter that snuck back in on the GET,
moved cart→order mapping into a testable `OrderCalculator` service,
and tightened line-total rounding.

**Example 2 — Playwright happy-path spec (M5).** Prompt: write a
single Playwright spec covering register → login → browse → add to
cart → checkout → order history. The first run failed twice — the
API crashed because `--no-launch-profile` skipped the Development env
(fix: set `ASPNETCORE_ENVIRONMENT=Development` in the webserver
block); and the Logout selector was wrong (fix: switched
`getByRole('link')` → `getByRole('button')`). Both fixes are recorded
in [docs/e2e-run.md](e2e-run.md).

**Example 3 — CI/CD workflows (M6).** Prompt: write GitHub Actions
workflows for deploying the API to App Service and the frontend to
Azure. The first draft hardcoded the App Service name in three
places; I pulled it into a workflow `env` block. The first draft
also used `AllowAnyOrigin()` for production CORS — I rejected that and
made it config-driven via `Cors:AllowedOrigins` while keeping
localhost defaults for dev.

## What worked well

- **Boilerplate and ceremony.** EF Core configuration, FluentValidation
  validators, React Context plumbing — all faster with AI, freeing time
  for the parts that actually needed thought (security boundaries,
  cart→order mapping, test strategy).
- **First-draft tests.** Given clear cases, Claude wrote good test
  scaffolding. The cost of writing tests dropped enough that I wrote
  more of them.
- **Documentation drafts.** I wrote roughly twice as much doc in M6 as
  I would have alone, because the cost of getting from zero to a
  usable first draft fell to almost nothing.
- **Diagnosing unfamiliar errors.** Claude pointed at the
  `--no-launch-profile` issue almost immediately when the Playwright
  webserver crashed.

## What didn't work well

- **Vague prompts produce generic output.** "Write a good orders
  controller" misses the security rule that actually matters. Precision
  in the prompt mattered more than I expected.
- **AI cuts corners on security.** Claude tried more than once to
  accept a `userId` query parameter on user-scoped endpoints. That's
  the classic OWASP API1 (broken object-level authorization) failure;
  the AI doesn't catch security mistakes, you have to.
- **Test mocks were sometimes wrong.** AI would mock the database in
  places where an integration test would have caught a real bug. I
  rejected those drafts in favor of `WebApplicationFactory<Program>`
  with the in-memory provider.
- **Documentation puffery.** First drafts of the user guide had
  marketing-style fluff and over-promised features. I cut about a
  third of the text.

## Impact on productivity and learning

**Productivity.** Conservatively, AI assistance shaved 30–40% off
implementation time across M3–M5, mostly by collapsing boilerplate
and giving me a first draft to react to. M6 documentation would have
been roughly half-finished without it; with it, it's complete on time.

**Learning.** Mixed. The parts I learned most from were the parts I
fought the AI on — pushing the JWT-scoped query rule, refusing to mock
the database, demanding a startup guard for `Jwt:Key`. Those moments
forced me to articulate *why* a particular pattern was right, which
made it stick. The parts the AI got right on the first try (EF Core
configuration, React Context plumbing) I now know are reasonable
defaults but couldn't confidently re-derive from scratch — that's a
real gap.

## Lessons learned

1. **Treat AI like a junior pair, not a senior reviewer.** It will
   produce code; it will not catch your security issues.
2. **Prompts are specifications.** Vague prompts get generic output.
   The tighter the prompt — including what you *don't* want — the
   better the result.
3. **Always run tests yourself.** AI saying code "looks right" is not
   the same as tests passing.
4. **Security is non-negotiable and AI gets it wrong.** Every protected
   endpoint scoping its query to the JWT user id is something I had to
   enforce, repeatedly, against AI drafts that wanted to trust the URL.
5. **AI compounds with good engineering practice; it doesn't replace
   it.** CI gates, integration tests against a real database, and code
   review of AI output are what turned AI from a risky shortcut into a
   productivity multiplier.

The biggest takeaway: AI made me faster, but the project still rises
or falls on the engineering judgment I brought to it. The decisions
about auth boundaries, secrets management, test strategy, and
deployment topology are mine — even though AI helped me type some of
them.
