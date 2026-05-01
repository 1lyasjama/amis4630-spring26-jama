# Lab Evaluation Report

**Student Repository**: `1lyasjama/amis4630-spring26-jama`  
**Date**: 2026-03-22  
**Rubric**: milestone-3/rubric.md

## 1. Build & Run Status

| Component           | Build | Runs | Notes                                                                                                                          |
| ------------------- | ----- | ---- | ------------------------------------------------------------------------------------------------------------------------------ |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded. `dotnet run` starts on http://localhost:5023. Required `dotnet ef database update` before first run. |
| Frontend (React/TS) | ✅    | ✅   | `npm run build` (`tsc -b && vite build`) succeeded. Vite dev server starts on port 5173.                                       |
| API Endpoints       | —     | ✅   | See endpoint details below.                                                                                                    |

**API Endpoint Tests:**

| Endpoint                | Status | Result                                                         |
| ----------------------- | ------ | -------------------------------------------------------------- |
| `GET /api/products`     | 200    | Returns JSON array of 10 products with correct shape           |
| `GET /api/products/1`   | 200    | Returns single product with title "Intro to Calculus Textbook" |
| `GET /api/products/999` | 404    | Correctly returns 404 for non-existent ID                      |

### Project Structure Comparison

| Expected    | Found       | Status |
| ----------- | ----------- | ------ |
| `/backend`  | `/api`      | ❌     |
| `/frontend` | `/frontend` | ✅     |
| `/docs`     | `/docs`     | ✅     |

> Note: The backend directory is named `api/` instead of the expected `backend/`. This is a naming deviation only; all backend code is present and functional.

## 2. Rubric Scorecard

| #   | Requirement                          | Points | Status | Evidence                                                                                                                                                                                                                                                                            |
| --- | ------------------------------------ | ------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | React Product List Page              | 5      | ✅ Met | `CatalogPage.tsx` — fetches products, renders via `ProductList` → `ProductCard` hierarchy. Loading state (L24), error state (L25), and empty state (`ProductList.tsx` L10) all handled. Component hierarchy (Page → List → Card) follows Atomic Design.                             |
| 2   | React Product Detail Page            | 5      | ✅ Met | `ProductDetailPage.tsx` — separate route at `/products/:id` (`App.tsx` L10). Displays all fields: title, price, category, description, seller, posted date, image. Back-to-listings link (L38) and card links from list (L11 in `ProductCard.tsx`) enable bidirectional navigation. |
| 3   | API Endpoint: GET /api/products      | 5      | ✅ Met | `ProductsController.cs` — `GetAll()` returns `Ok(products)` (200) with correct JSON array. SQLite data store via EF Core with seed data in `AppDbContext.cs`. Verified: returns 10 products with correct JSON shape.                                                                |
| 4   | API Endpoint: GET /api/products/{id} | 5      | ✅ Met | `ProductsController.cs` — `GetById(int id)` returns `Ok(product)` (200) for found, `NotFound()` (404) for missing. Verified: `/api/products/1` → 200, `/api/products/999` → 404.                                                                                                    |
| 5   | Frontend-to-API Integration          | 5      | ✅ Met | `CatalogPage.tsx` L14 fetches from `http://localhost:5023/api/products`. `ProductDetailPage.tsx` L16 fetches individual product from API. No hardcoded data in components. Error state handled in both pages. CORS configured in `Program.cs` L19-24.                               |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **Database migration not auto-applied**: `Program.cs` — The app uses EF Core with SQLite but does not auto-apply migrations on startup. The API returns 500 errors until `dotnet ef database update` is manually run. Consider adding `context.Database.Migrate()` or `EnsureCreated()` at startup for development convenience.

- **Hardcoded API base URL**: `CatalogPage.tsx` and `ProductDetailPage.tsx` both hardcode `http://localhost:5023/api`. Consider extracting this into an environment variable or Vite config (`import.meta.env.VITE_API_URL`) for easier configuration across environments.

- **Solution layout deviation**: The backend directory is named `api/` instead of `backend/` as specified in the solution layout standard. While functional, aligning with the standard improves consistency.

- **npm audit vulnerability**: `npm install` reports 1 high severity vulnerability. Running `npm audit fix` would address this.

## 6. Git Practices Coaching (Non-Scoring)

- **Large monolithic commits**: The entire Milestone 3 implementation was delivered in a single commit (`8e2a010 Implement Milestone 3: Product Catalog vertical slice`). Breaking this into smaller commits (e.g., backend model + controller, frontend pages, integration) would make the work easier to review and debug.

- **Good commit message clarity**: Commit messages are descriptive and clearly indicate what each commit accomplishes (e.g., "Implement Milestone 3: Product Catalog vertical slice", "Add \*.db to gitignore").

---

**25/25** — All rubric requirements are fully met. The coaching notes above (auto-migration, hardcoded URLs, solution layout naming, incremental commits) are suggestions for professional growth, not scoring deductions.
