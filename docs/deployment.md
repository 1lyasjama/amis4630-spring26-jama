# Deployment Guide — Buckeye Marketplace

This document explains how Buckeye Marketplace is deployed to Azure and how
the CI/CD pipeline (GitHub Actions) ships changes to production.

## Production architecture

```
┌──────────────────────────┐        ┌──────────────────────────┐
│  Azure Static Web Apps   │  HTTPS │  Azure App Service       │
│  React + TypeScript SPA  ├───────▶│  ASP.NET Core 10 API     │
│  https://*.azurestatic   │  REST  │  https://*.azurewebsites │
│   apps.net               │        │   .net                   │
└──────────────────────────┘        └────────────┬─────────────┘
                                                 │ EF Core / TDS
                                                 ▼
                                       ┌──────────────────────┐
                                       │ Azure SQL Database   │
                                       │ BuckeyeMarketplaceDb │
                                       │ (Basic tier)         │
                                       └──────────────────────┘
```

- **Frontend** is served by Azure Static Web Apps (SWA). HTTPS is enabled by
  default and `staticwebapp.config.json` rewrites SPA routes to `index.html`
  so deep links work after refresh.
- **Backend** runs on a Linux Azure App Service (free `F1` plan) with
  HTTPS-only enforced. The runtime is `DOTNETCORE:10.0`.
- **Database** is an Azure SQL Database (Basic tier). The connection string
  is stored as an App Service Connection String, not in `appsettings.json`.

## Resource layout

| Resource              | Name (example)              | Purpose                          |
|-----------------------|-----------------------------|----------------------------------|
| Resource group        | `rg-buckeye-marketplace`    | Logical container                |
| SQL server            | `buckeye-sql-jama`          | Hosts the SQL database           |
| SQL database          | `BuckeyeMarketplaceDb`      | Application data                 |
| App Service plan      | `buckeye-plan` (Linux F1)   | Hosts the API                    |
| Web App (API)         | `buckeye-api-jama`          | ASP.NET Core 10 API              |
| Static Web App        | `buckeye-frontend-jama`     | React SPA                        |

## Where secrets live

| Secret                     | Lives in                                              | Why                                            |
|----------------------------|-------------------------------------------------------|------------------------------------------------|
| Azure publish profile      | GitHub repo secret `AZURE_API_PUBLISH_PROFILE`        | Used by the deploy workflow                    |
| SWA deployment token       | GitHub repo secret `AZURE_STATIC_WEB_APPS_API_TOKEN`  | Used by the SWA deploy workflow                |
| SQL connection string      | App Service → Configuration → Connection strings       | Read by the running app at startup             |
| `Jwt:Key`                  | App Service → Configuration → Application settings    | Runtime secret; never in source                |
| `Jwt:Issuer` / `Audience`  | App Service → Configuration → Application settings    | Tied to the production hostname                |
| `Cors:AllowedOrigins:0`    | App Service → Configuration → Application settings    | Frontend origin allowed by the API             |
| `VITE_API_URL`             | GitHub repo *variable* (or `.env.production`)         | Public URL — not a secret                      |

Rule of thumb: GitHub Secrets are for *deploy-time* secrets; App Service
configuration is for *runtime* secrets. The SQL admin password is used once
to create the connection string and then deleted from any local notes.

## CI/CD pipeline

Three GitHub Actions workflows live in [.github/workflows/](../.github/workflows/):

### `ci.yml` — build & test on every push / PR
Runs on every push to `main` and every PR. Builds the .NET solution in
Release, runs `dotnet test` (17 tests), runs Vitest (13 tests), and builds
the production frontend bundle. This is the gate that proves `main` is
green before any deploy.

### `deploy-api.yml` — backend deployment
Triggers on pushes to `main` that touch `api/`, the test project, or the
solution file. Steps:

1. `dotnet restore` / `dotnet build --configuration Release`.
2. `dotnet test` — deploy is blocked if any test fails.
3. `dotnet publish` to `./publish` and upload as a build artifact.
4. Download the artifact and ship it via `azure/webapps-deploy@v3` using
   `secrets.AZURE_API_PUBLISH_PROFILE`.

### `deploy-frontend.yml` — frontend deployment
Triggers on pushes to `main` that touch `frontend/`, plus PR open/sync for
preview deployments. Steps:

1. `npm ci` and `npm test -- --run` (gates the deploy).
2. `Azure/static-web-apps-deploy@v1` with the SWA API token, building from
   `frontend/`, output `dist/`. The build picks up `VITE_API_URL` from a
   GitHub *variable*.

PRs get a temporary preview URL automatically; the `close_pull_request` job
tears it down when the PR closes.

## One-time Azure provisioning

These steps are run once per environment. They are not in the CI workflow
because they create paid resources.

```bash
# 1. Resource group
az group create --name rg-buckeye-marketplace --location eastus

# 2. SQL server + database (read the password interactively so it doesn't
#    end up in shell history)
read -rs SQL_PW && echo
az sql server create --name buckeye-sql-jama \
    --resource-group rg-buckeye-marketplace --location eastus \
    --admin-user sqladmin --admin-password "$SQL_PW"

az sql db create --name BuckeyeMarketplaceDb \
    --resource-group rg-buckeye-marketplace --server buckeye-sql-jama \
    --service-objective Basic

az sql server firewall-rule create --resource-group rg-buckeye-marketplace \
    --server buckeye-sql-jama --name AllowAzureServices \
    --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0

# 3. App Service plan + Web App
az appservice plan create --name buckeye-plan \
    --resource-group rg-buckeye-marketplace --sku F1 --is-linux
az webapp create --name buckeye-api-jama \
    --resource-group rg-buckeye-marketplace --plan buckeye-plan \
    --runtime "DOTNETCORE:10.0"

# 4. Application settings (runtime secrets)
read -rs CONN_STR && echo
read -rs JWT_KEY && echo
az webapp config connection-string set --name buckeye-api-jama \
    --resource-group rg-buckeye-marketplace \
    --connection-string-type SQLAzure \
    --settings DefaultConnection="$CONN_STR"
az webapp config appsettings set --name buckeye-api-jama \
    --resource-group rg-buckeye-marketplace \
    --settings Jwt__Key="$JWT_KEY" \
               Jwt__Issuer="https://buckeye-api-jama.azurewebsites.net" \
               Jwt__Audience="https://buckeye-api-jama.azurewebsites.net" \
               Cors__AllowedOrigins__0="https://buckeye-frontend-jama.azurewebsites.net" \
               ASPNETCORE_ENVIRONMENT="Production"

# 5. Azure Static Web App (created via Portal -> linked to GitHub on `main`,
#    app_location=frontend, output_location=dist). The SWA wizard generates
#    its own API token; copy it into the repo secret AZURE_STATIC_WEB_APPS_API_TOKEN.

# 6. Publish profile for the API workflow
az webapp deployment list-publishing-profiles \
    --name buckeye-api-jama --resource-group rg-buckeye-marketplace --xml
# Copy the XML into the repo secret AZURE_API_PUBLISH_PROFILE.
```

## Switching the app to Azure SQL

The codebase ships with SQLite for local development. Production uses Azure
SQL via the `DefaultConnection` connection string set on the App Service.
The provider switch lives in [api/Program.cs](../api/Program.cs); when
deploying for the first time, change the EF Core registration to:

```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

…and add `Microsoft.EntityFrameworkCore.SqlServer` to the API csproj. The
EF Core migrations under [api/Migrations](../api/Migrations) are
provider-agnostic at the model level; regenerate the SQL Server-specific
migrations from a clean state if the existing SQLite migrations don't
apply.

Keeping SQLite in dev means contributors don't need an Azure SQL connection
to run the app locally — `dotnet run` still produces a working app with
seeded data.

## Custom domain (bonus)

Both Static Web Apps and App Service support custom domains under the free
tier. After provisioning a domain in Azure DNS (or any registrar) and
adding the CNAME / TXT records to validate ownership, both services
auto-issue managed TLS certificates. No code changes are needed; only the
Issuer/Audience claims and `Cors:AllowedOrigins` need to be updated to the
new hostname.

## Cleanup (after grading)

```bash
az group delete --name rg-buckeye-marketplace --yes --no-wait
```

This deletes every resource in one command and preserves Azure-for-Students
credit for future projects.

## Troubleshooting

| Symptom                              | Likely cause                                  | Fix                                                     |
|--------------------------------------|-----------------------------------------------|---------------------------------------------------------|
| `500` on every API call              | Missing `Jwt:Key` or connection string        | App Service → Configuration; restart the app            |
| CORS error in browser console        | Frontend origin not in `Cors:AllowedOrigins`  | Update the App Service app setting and restart          |
| Frontend loads but no data           | `VITE_API_URL` build var was wrong            | Update the GitHub variable, re-run the deploy workflow  |
| GitHub Actions deploy fails on auth  | Stale `AZURE_API_PUBLISH_PROFILE` secret       | Re-download the publish profile and update the secret   |
| Deep links 404 on refresh            | Missing `staticwebapp.config.json`            | File is at `frontend/staticwebapp.config.json`          |
| `Application Error` page on Azure    | App failed to start                            | App Service → Log Stream                                 |
