# End-to-End Test Plan — Buckeye Marketplace (Milestone 6)

This document is the **test plan** for the production deployment of
Buckeye Marketplace. It covers what we test, how we test it, what passed,
what bugs were found, and what was done about them.

The test plan has three layers:

1. **Automated tests** — gate every push to `main` via GitHub Actions.
2. **Scripted manual flows** — exercised against the deployed app on the
   browsers and screen sizes we care about.
3. **Cross-browser / mobile sweep** — happy path verified on the major
   browsers and on a phone viewport.

See [qa-report.md](qa-report.md) for the recorded results from the most
recent run.

---

## 1. Automated tests (CI gate)

Run on every push and PR via [.github/workflows/ci.yml](../.github/workflows/ci.yml).

| Layer        | Tool      | Count    | Where                                            |
|--------------|-----------|----------|--------------------------------------------------|
| Backend unit | xUnit     | 3 tests  | `BuckeyeMarketplaceApi.Tests/`                   |
| Backend integration (auth, cart, orders, refresh) | xUnit + `WebApplicationFactory<Program>` | 14 tests | `BuckeyeMarketplaceApi.Tests/AuthIntegrationTests.cs` |
| Frontend unit / component | Vitest + React Testing Library | 13 tests across 3 files | `frontend/src/test/` |
| End-to-end (happy path) | Playwright | 1 spec, full flow | `frontend/e2e/checkout.spec.ts` |

Total: **30 backend + frontend automated tests + 1 Playwright spec**.

Runbook:

```bash
# Backend
dotnet test amis4630-spring26-jama.sln --configuration Release

# Frontend (unit + component)
cd frontend && npm test -- --run

# Frontend (E2E happy path)
cd frontend && npx playwright install chromium && npx playwright test
```

Both deploy workflows (`deploy-api.yml`, `deploy-frontend.yml`) refuse to
ship if any of the above fails.

---

## 2. Manual user flows (deployed app)

Each flow below is a scripted scenario that an experienced grader could
follow against the live URL. ✓ marks the most recent passing result;
[qa-report.md](qa-report.md) records the actual run.

### 2.1 Browse → cart → checkout → order (happy path) ✓

1. Open the live frontend URL as a guest.
2. Verify the catalog renders with all 10 seeded products.
3. Click a product card → product detail page loads.
4. Hit **Register** and create a brand-new user with a unique email.
5. From the catalog, click **Add to Cart** on two different products.
6. Open the cart; bump quantity on one item, remove the other.
7. Click **Proceed to Checkout**.
8. Fill in the shipping address; click **Place Order**.
9. Land on **Order Confirmation**; capture the confirmation number.
10. Click **Order History**; verify the new order is at the top with the
    correct total and status `Pending`.

### 2.2 Login flow ✓

1. From a fresh incognito window, click **Login**.
2. Submit the form empty → expect inline validation messages.
3. Submit with a malformed email → expect "Enter a valid email" (no HTML5
   short-circuit; we set `noValidate` on the form so our validator runs).
4. Submit a wrong password → expect "Invalid email or password" toast.
5. Submit valid credentials → land on the catalog with the user's name in
   the header.

### 2.3 Token refresh ✓

1. Sign in. Copy the access token from `localStorage`.
2. Wait until it's just past the access-token TTL (or hand-edit it to
   `exp` in the past in DevTools).
3. Click any protected route (e.g., `/cart`).
4. Verify the request succeeds — under the hood, `apiFetch` should call
   `POST /api/auth/refresh` once and replay the request.

### 2.4 Logout ✓

1. Click **Logout** in the header.
2. Verify access + refresh tokens are gone from `localStorage`.
3. Verify the header shows **Login** / **Register** again.
4. Visit `/cart` → expect a redirect to `/login`.

### 2.5 Admin product CRUD ✓

1. Log in as `admin@buckeye.test`.
2. Visit `/admin/products`.
3. Add a new product → verify it appears in the catalog as a guest in a
   second browser.
4. Edit the new product's price; refresh the catalog → verify the new
   price.
5. Delete the new product; refresh → verify it's gone, and that any past
   orders that referenced it (none, since it's brand new) are unaffected.

### 2.6 Admin order management ✓

1. As admin, place an order (or use an order placed by a regular user in
   the seed data).
2. Visit `/admin/orders`.
3. Change the status from `Pending` → `Processing`.
4. Sign back in as the customer; visit `/orders` → confirm the new
   status is shown.

### 2.7 Authorization boundary ✓

1. Sign in as a regular user. Note the JWT in `localStorage`.
2. From the browser console, hit `GET /api/orders` (admin-only) with the
   user's JWT → expect `403 Forbidden`.
3. Hit `GET /api/orders/mine` with the same JWT → expect `200` with
   only that user's orders.
4. Hit `GET /api/orders/mine?userId=<other-user-id>` → expect the *same*
   set of orders (the URL is ignored; the user id comes from the JWT).
   This confirms broken-object-level authorization is closed.

### 2.8 SPA deep-link reload ✓

1. Visit the live frontend, navigate to `/orders`.
2. Hit refresh in the browser.
3. Verify the page reloads instead of 404'ing — `staticwebapp.config.json`
   rewrites unknown paths to `/index.html`.

---

## 3. Cross-browser sweep

The happy path (flow 2.1) is repeated on each:

| Browser               | OS        | Result                                                    |
|-----------------------|-----------|-----------------------------------------------------------|
| Chrome (latest)       | macOS     | ✓ pass                                                     |
| Firefox (latest)      | macOS     | ✓ pass                                                     |
| Safari (latest)       | macOS     | ✓ pass                                                     |
| Edge (latest)         | macOS     | ✓ pass                                                     |
| Chrome (Android emu)  | Android   | ✓ pass — see mobile section below                          |

---

## 4. Mobile responsiveness

Tested with Chrome DevTools device emulation at:

- **iPhone 14 Pro** (390 × 844)
- **Pixel 7** (412 × 915)
- **iPad Mini** (768 × 1024)

Verified:

- Header collapses to a compact navigation with cart count visible.
- Product cards reflow to a single column on phones, two columns on
  tablets.
- Forms (login, register, checkout) are usable without horizontal scroll.
- Cart quantity controls are tap-target-sized (≥ 44 px).

---

## 5. Bugs found during M6 testing

See [qa-report.md](qa-report.md) for the full record. Summary:

| #  | Bug                                                         | Status | Where fixed                                |
|----|-------------------------------------------------------------|--------|--------------------------------------------|
| B1 | Hardcoded API base URL prevented production deploy          | Fixed  | `frontend/src/services/api.ts`             |
| B2 | CORS allow-list was hardcoded to localhost only             | Fixed  | `api/Program.cs` (`Cors:AllowedOrigins`)   |
| B3 | SPA deep links 404'd on refresh on Static Web Apps          | Fixed  | `frontend/staticwebapp.config.json`        |

(Bugs from earlier milestones — like the LoginForm `noValidate` fix — are
recorded in `CHANGELOG.md` and the M5 AI-USAGE doc.)

---

## 6. Out of scope for M6 (acknowledged limitations)

- **Image upload.** Listings reference image URLs; we don't host an image
  service.
- **Real payment.** Checkout records the order and clears the cart but
  does not integrate with a payment processor.
- **Password reset.** A future milestone would add it; today, registering
  a new account is the work-around.
- **Load testing.** The site has been tested for correctness, not for
  load. The Basic-tier SQL Database is not sized for a real launch.
