# QA Report — Milestone 6

This is the recorded run of the [test plan](test-plan.md) against the
final Milestone 6 build.

- **Build under test:** `main` at the M6 tag (`v1.0`)
- **Frontend URL:** `https://buckeye-frontend-jama.azurewebsites.net`
- **API URL:** `https://buckeye-api-jama.azurewebsites.net`
- **Test date:** April 30, 2026

---

## 1. Automated test run

```text
$ dotnet test amis4630-spring26-jama.sln --configuration Release
Passed!  - Failed: 0, Passed: 17, Skipped: 0, Total: 17, Duration: 1 s

$ cd frontend && npm test -- --run
 Test Files  3 passed (3)
      Tests  13 passed (13)
   Duration  1.15s

$ cd frontend && npx playwright test
✓  e2e/checkout.spec.ts:9:1 › happy path: register, login, browse, add to cart, checkout, view order in history (1.8s)
  1 passed (7.0s)
```

CI run for the build under test: green ✅ on
[`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

---

## 2. Manual user-flow results

| Flow (from test-plan.md)             | Chrome | Firefox | Safari | Edge | Mobile (Chrome on Android) |
|--------------------------------------|--------|---------|--------|------|----------------------------|
| 2.1 Happy path                       | ✓      | ✓       | ✓      | ✓    | ✓                          |
| 2.2 Login validation                 | ✓      | ✓       | ✓      | ✓    | ✓                          |
| 2.3 Silent token refresh              | ✓      | ✓       | ✓      | ✓    | n/a                        |
| 2.4 Logout                           | ✓      | ✓       | ✓      | ✓    | ✓                          |
| 2.5 Admin product CRUD                | ✓      | ✓       | ✓      | ✓    | ✓                          |
| 2.6 Admin order status               | ✓      | ✓       | ✓      | ✓    | ✓                          |
| 2.7 Authorization boundary (JWT-scoped) | ✓   | ✓       | ✓      | ✓    | n/a                        |
| 2.8 SPA deep-link reload             | ✓      | ✓       | ✓      | ✓    | ✓                          |

`n/a` = the test relies on the browser DevTools console; not run on the
mobile emulator.

---

## 3. Mobile / responsive sweep

Tested with Chrome DevTools device emulation:

| Device           | Viewport     | Layout    | Tap targets | Forms usable | Result |
|------------------|--------------|-----------|-------------|--------------|--------|
| iPhone 14 Pro    | 390 × 844    | 1 column  | ≥ 44 px     | yes          | ✓      |
| Pixel 7          | 412 × 915    | 1 column  | ≥ 44 px     | yes          | ✓      |
| iPad Mini        | 768 × 1024   | 2 columns | ≥ 44 px     | yes          | ✓      |

---

## 4. Bugs found during M6 testing

### B1 — Hardcoded API base URL prevented production deploy
- **Symptom:** the deployed Static Web App rendered, but every API call
  blew up because the bundle still pointed at `http://localhost:5023`.
- **Root cause:** `frontend/src/services/api.ts` had a hardcoded URL.
- **Fix:** read `import.meta.env.VITE_API_URL` at build time and fall
  back to localhost only when the env var isn't set. The CI workflow and
  the SWA build both inject `VITE_API_URL` from a GitHub variable.
- **Commit/file:** [frontend/src/services/api.ts](../frontend/src/services/api.ts)

### B2 — CORS allow-list was hardcoded to localhost only
- **Symptom:** browser blocked the deployed frontend's calls because the
  API CORS policy only allowed `http://localhost:5173` /
  `http://localhost:4173`.
- **Root cause:** the CORS policy in `Program.cs` had a hardcoded list.
- **Fix:** the localhost defaults stay (so dev keeps working), but
  additional origins are read from the
  `Cors:AllowedOrigins` configuration array. In production, the App
  Service has `Cors__AllowedOrigins__0` set to the SWA URL; no code
  change needed to onboard a custom domain later.
- **Commit/file:** [api/Program.cs](../api/Program.cs)

### B3 — SPA deep links 404'd on refresh on Static Web Apps
- **Symptom:** opening `/orders` directly or refreshing while on
  `/orders` returned a 404 from the Static Web App.
- **Root cause:** SWA didn't know to fall back to `index.html` for
  client-side routes.
- **Fix:** added [`frontend/staticwebapp.config.json`](../frontend/staticwebapp.config.json)
  with a `navigationFallback` that rewrites unknown paths to
  `/index.html` and excludes static asset extensions.
- **Commit/file:** `frontend/staticwebapp.config.json`

(Bugs found in earlier milestones — e.g. the LoginForm `noValidate` fix
from M5 — are recorded in [CHANGELOG.md](../CHANGELOG.md) and the M5
[AI-USAGE.md](../AI-USAGE.md).)

---

## 5. Final result

- **All automated tests pass**, on every push, gated by GitHub Actions.
- **All scripted manual flows pass** on Chrome, Firefox, Safari, and
  Edge, and on phone + tablet viewports.
- **Three deployment-related bugs were found during M6 testing and
  fixed**; their fixes are in the codebase under `main`.

The deployed application is ready for the M6 demo.
