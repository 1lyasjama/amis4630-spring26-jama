# Buckeye Marketplace (AMIS 4630)

A full-stack marketplace web app for Ohio State students to buy and sell
items safely. Built across six milestones for AMIS 4630, Spring 2026.

> **Live demo (Milestone 6):**
> - Frontend: `https://buckeye-frontend-jama.azurewebsites.net`
> - API: `https://buckeye-api-jama.azurewebsites.net`
> - Swagger: `https://buckeye-api-jama.azurewebsites.net/swagger`

## Project description

Buckeye Marketplace lets students browse listings, add items to a cart,
register and log in, place orders, and view their order history. Admins
can manage the catalog and update order statuses. The system runs
entirely on Azure (App Service + Azure SQL Database) with continuous
deployment from GitHub Actions.

### Features
- **Product catalog** — browse and view product detail pages.
- **Shopping cart** — add, update quantity, remove items, persisted to
  the database per user.
- **Authentication** — register, login, logout, JWT bearer tokens with
  silent refresh-token rotation.
- **Authorization** — `User` and `Admin` roles enforced both in the
  client (route guards) and on the server (`[Authorize(Roles = "...")]`).
- **Order placement** — checkout with shipping address, generates a
  confirmation number, clears the cart, snapshots line items.
- **Order history** — users see their own orders, scoped by JWT.
- **Admin dashboard** — product CRUD and order-status management.
- **Production deployment on Azure** with HTTPS, SPA fallback routing,
  and configurable CORS origins.
- **CI/CD on GitHub Actions** — every push runs the full test suite;
  green builds auto-deploy to Azure.

## Technology stack

| Layer       | Technology                       | Version    |
|-------------|----------------------------------|------------|
| Frontend    | React + TypeScript               | React 19, TS 5.9 |
| Build tool  | Vite                              | 7.x        |
| Routing     | React Router                      | 7.x        |
| Frontend tests | Vitest + React Testing Library | Vitest 4.x |
| E2E         | Playwright                        | 1.59       |
| Backend     | ASP.NET Core Web API             | .NET 10    |
| ORM         | Entity Framework Core             | 10.x       |
| Auth        | ASP.NET Core Identity + JWT bearer | 10.x     |
| Validation  | FluentValidation                  | 11.x       |
| Backend tests | xUnit + WebApplicationFactory   | xUnit 2.x  |
| Database (dev) | SQLite                          | provider 10.x |
| Database (prod) | Azure SQL Database (Basic tier) | —        |
| Hosting (frontend) | Azure App Service (Linux F1, Node) | —          |
| Hosting (API) | Azure App Service (Linux F1)    | —          |
| CI/CD       | GitHub Actions                    | —          |

## Local development

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/) and npm

### 1. Set the JWT signing key (one-time, per machine)
```bash
cd api
dotnet user-secrets set "Jwt:Key" "ThisIsADevelopmentOnlySecretKey_ChangeInProduction_MinimumLength32Characters!"
```

### 2. Run the API
```bash
cd api
dotnet run
```
The API listens on **http://localhost:5023**. Swagger is at
`http://localhost:5023/swagger`.

The local database is SQLite (`api/BuckeyeMarketplace.db`). The schema
is created automatically on first run, and `SeedData.cs` seeds:
- Two roles (`Admin`, `User`)
- A test admin: `admin@buckeye.test` / `Admin123!`
- A test user: `user@buckeye.test` / `User1234!`
- 10 sample product listings

### 3. Run the frontend
```bash
cd frontend
npm install
npm run dev
```
The app starts on **http://localhost:5173**. The frontend reads
`VITE_API_URL` at build time; in dev it defaults to the local API.

## Production deployment

See [docs/deployment.md](docs/deployment.md) for the full runbook. The
short version:

- Frontend → **Azure App Service** (Linux Node, serves the React build via
  `pm2 serve --spa`), deployed by
  [`.github/workflows/deploy-frontend.yml`](.github/workflows/deploy-frontend.yml).
- API → **Azure App Service** (Linux, .NET 10), deployed by
  [`.github/workflows/deploy-api.yml`](.github/workflows/deploy-api.yml).
- Database → **Azure SQL Database** (Basic tier).
- HTTPS is enforced on both services.
- Secrets:
  - `Jwt:Key` lives in App Service application settings.
  - SQL connection string lives in App Service connection strings.
  - The Azure publish profiles for both apps live in GitHub repo secrets
    (`AZURE_API_PUBLISH_PROFILE`, `AZURE_FRONTEND_PUBLISH_PROFILE`).

## CI/CD

Every push and pull request runs [`.github/workflows/ci.yml`](.github/workflows/ci.yml):
- `dotnet test` (17 tests across unit + integration + auth)
- `npm test -- --run` (13 frontend unit/component tests)
- `npm run build` (production frontend bundle)

Pushes to `main` that touch the API trigger
[`deploy-api.yml`](.github/workflows/deploy-api.yml); pushes that touch
the frontend trigger
[`deploy-frontend.yml`](.github/workflows/deploy-frontend.yml). Tests
gate every deploy.

## Environment variables

### API (App Service application settings in production; user-secrets locally)

| Setting                     | Required | Notes                                                   |
|-----------------------------|----------|---------------------------------------------------------|
| `Jwt:Key`                   | yes      | 32+ char signing key. App throws on startup if missing. |
| `Jwt:Issuer`                | yes      | Production hostname.                                    |
| `Jwt:Audience`              | yes      | Production hostname.                                    |
| `Cors:AllowedOrigins:0..N`  | prod     | Frontend origins to allow (in addition to localhost).   |
| `ConnectionStrings:Default` | dev      | SQLite path; defaults to `Data Source=BuckeyeMarketplace.db`. |
| `ConnectionStrings:DefaultConnection` (App Service) | prod | Azure SQL connection string. |
| `AdminSeed:Email` / `AdminSeed:Password` | optional | Override the seeded admin credentials. |

### Frontend (Vite build-time)

| Variable        | Required | Notes                                                            |
|-----------------|----------|------------------------------------------------------------------|
| `VITE_API_URL`  | prod     | Base URL of the deployed API (no trailing `/api`). Set in `.env.production` or as a GitHub variable for the deploy workflow. |

## API documentation

Swagger UI ships with the API in every environment:
- Local: `http://localhost:5023/swagger`
- Production: `https://buckeye-api-jama.azurewebsites.net/swagger`

### Endpoints summary

#### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | none | Register; returns access + refresh tokens. |
| POST | `/api/auth/login`    | none | Login; returns access + refresh tokens. |
| POST | `/api/auth/refresh`  | none | Rotate a refresh token (revokes the old one). |

#### Products (`/api/products`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET    | `/api/products`        | none  | List all products. |
| GET    | `/api/products/{id}`   | none  | Get product by id. |
| POST   | `/api/products`        | Admin | Create product. |
| PUT    | `/api/products/{id}`   | Admin | Update product. |
| DELETE | `/api/products/{id}`   | Admin | Delete product. |

#### Cart (`/api/cart`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET    | `/api/cart`                   | User | Get current user's cart. |
| POST   | `/api/cart`                   | User | Add item. |
| PUT    | `/api/cart/{cartItemId}`      | User | Update item quantity. |
| DELETE | `/api/cart/{cartItemId}`      | User | Remove a single item. |
| DELETE | `/api/cart/clear`             | User | Clear all items. |

#### Orders (`/api/orders`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST   | `/api/orders`                 | User  | Create order from cart; clears the cart. |
| GET    | `/api/orders/mine`            | User  | Current user's orders (JWT-scoped). |
| GET    | `/api/orders/{id}`            | User  | Single order; only if owned by the JWT user, or admin. |
| GET    | `/api/orders`                 | Admin | All orders. |
| PUT    | `/api/orders/{orderId}/status`| Admin | Update order status. |

## Project structure

```
amis4630-spring26-jama/
├── .github/workflows/             # CI + deploy pipelines
│   ├── ci.yml
│   ├── deploy-api.yml
│   └── deploy-frontend.yml
├── api/                           # ASP.NET Core 10 Web API
│   ├── Controllers/               # Auth, Products, Cart, Orders
│   ├── Data/                      # AppDbContext + seed data
│   ├── Dtos/                      # Request / response shapes
│   ├── Migrations/                # EF Core migrations
│   ├── Models/                    # Domain entities
│   ├── Services/                  # JwtTokenService, OrderCalculator, PasswordRules
│   ├── Validators/                # FluentValidation rules
│   └── Program.cs                 # Composition root, security middleware
├── BuckeyeMarketplaceApi.Tests/   # xUnit unit + integration tests
├── frontend/                      # React + TypeScript SPA
│   ├── e2e/                       # Playwright spec
│   ├── src/
│   │   ├── components/            # Header, ProductCard, LoginForm, ...
│   │   ├── context/               # AuthContext, CartContext
│   │   ├── pages/                 # Catalog, Detail, Cart, Checkout, Admin*
│   │   ├── services/              # apiFetch, authService, cartService, orderService
│   │   ├── test/                  # Vitest unit/component tests
│   │   ├── types/                 # TypeScript interfaces
│   │   └── utils/                 # validation helpers
│   ├── staticwebapp.config.json   # SPA fallback + security headers (SWA)
│   ├── playwright.config.ts
│   └── vite.config.ts
├── docs/
│   ├── adr/                       # Architecture Decision Records
│   ├── system-architecture.md     # High-level architecture (M6)
│   ├── database-erd.md            # Database schema (M6)
│   ├── deployment.md              # Production deployment runbook
│   ├── test-plan.md               # E2E test plan (M6)
│   ├── qa-report.md               # QA results for the M6 build
│   ├── user-guide.md              # Shopper user guide
│   ├── admin-guide.md             # Admin guide
│   ├── ai-reflection.md           # M6 AI tool reflection
│   ├── ai-usage-m4.md             # M4 AI usage notes
│   ├── e2e-run.md                 # M5 Playwright agent run notes
│   └── screenshots/
├── README.md                      # this file
├── SUBMISSION.md                  # Submission notes (M5 + M6)
├── AI-USAGE.md                    # AI usage summary
├── CHANGELOG.md                   # Per-milestone changelog
└── amis4630-spring26-jama.sln
```

## Documentation index

| Doc | Purpose |
|---|---|
| [docs/system-architecture.md](docs/system-architecture.md) | High-level architecture, request flows, deployment topology |
| [docs/database-erd.md](docs/database-erd.md) | ERD + entity descriptions |
| [docs/deployment.md](docs/deployment.md) | Azure provisioning + CI/CD runbook |
| [docs/test-plan.md](docs/test-plan.md) | What we test, how, and where |
| [docs/qa-report.md](docs/qa-report.md) | Recorded results from the M6 build |
| [docs/user-guide.md](docs/user-guide.md) | Shopper-facing user guide |
| [docs/admin-guide.md](docs/admin-guide.md) | Admin guide for product / order management |
| [docs/ai-reflection.md](docs/ai-reflection.md) | Cross-milestone reflection on AI use |
| [docs/adr/](docs/adr/) | Architecture Decision Records |
| [SUBMISSION.md](SUBMISSION.md) | Submission notes + test credentials |
| [AI-USAGE.md](AI-USAGE.md) | AI usage summary across milestones |
| [CHANGELOG.md](CHANGELOG.md) | Per-milestone change log |

## Testing

```bash
# Backend (unit + integration via WebApplicationFactory + in-memory provider)
dotnet test amis4630-spring26-jama.sln --configuration Release

# Frontend unit / component
cd frontend && npm test -- --run

# End-to-end happy path (Playwright)
cd frontend && npx playwright install chromium && npx playwright test
```

`dotnet build` produces zero warnings; all 17 backend tests, 13 frontend
tests, and the 1 Playwright E2E spec pass on a fresh clone.

## Architecture Decisions (ADRs)

Stored in [docs/adr/](docs/adr/):
- ADR-001 Frontend: React + TypeScript
- ADR-002 Backend: .NET Web API
- ADR-003 Database: Azure SQL (relational)
- ADR-004 Authentication: OSU/Microsoft Login (note: implementation
  shipped as ASP.NET Core Identity + JWT; OSU SSO would be a future
  swap-in)
- ADR-005 Cloud: Azure deployment

## AI usage

A cross-milestone reflection lives at
[docs/ai-reflection.md](docs/ai-reflection.md). Per-milestone notes:

- **Milestone 3** — see the table in
  [AI-USAGE.md](AI-USAGE.md) and earlier git history.
- **Milestone 4** — [docs/ai-usage-m4.md](docs/ai-usage-m4.md).
- **Milestone 5** — [AI-USAGE.md](AI-USAGE.md);
  Playwright agent run notes in
  [docs/e2e-run.md](docs/e2e-run.md).
- **Milestone 6** — [docs/ai-reflection.md](docs/ai-reflection.md).

All AI-assisted code was reviewed, edited, and tested before being
committed. The engineering judgment — auth boundaries, secrets handling,
test strategy, deployment topology — is mine.
