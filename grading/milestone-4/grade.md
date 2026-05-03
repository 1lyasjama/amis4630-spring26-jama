# Lab Evaluation Report

**Student Repository**: `1lyasjama-amis4630-spring26-jama`  
**Date**: 2026-05-03  
**Rubric**: rubric.md (Milestone 4 — Shopping Cart, 25 points)

## 0. Build & Run Status

| Component           | Build | Runs | Notes                                                                                                                                        |
| ------------------- | ----- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded (0 warnings). `dotnet run` started on http://localhost:5023.                                                        |
| Frontend (React/TS) | ✅    | ✅   | `tsc -b && vite build` succeeded. Vite dev server started on http://localhost:5173.                                                          |
| API Endpoints       | —     | ✅   | GET /api/products → 200 (10 items). POST /api/auth/login → 200 (JWT). GET /api/cart → 401 (unauth) / 200 (auth). GET /api/orders/mine → 200. |
| Backend Tests       | —     | ✅   | `dotnet test`: 17/17 passed (0 failed, 0 skipped).                                                                                           |
| Frontend Tests      | —     | ✅   | `vitest run`: 13/13 passed across 3 test files.                                                                                              |

## 1. Project Structure

| Component         | Expected                                                  | Found                                                                      | Status |
| ----------------- | --------------------------------------------------------- | -------------------------------------------------------------------------- | ------ |
| Backend project   | `api/` with Controllers, Models, Data, Services           | `api/` — Controllers, Models, Data, Dtos, Services, Validators, Migrations | ✅     |
| Frontend project  | `frontend/src/` with components, pages, services, context | `frontend/src/` — components, pages, services, context, types, test        | ✅     |
| Cart Controller   | `api/Controllers/CartController.cs`                       | Present                                                                    | ✅     |
| Cart Models       | `api/Models/Cart.cs`, `api/Models/CartItem.cs`            | Present                                                                    | ✅     |
| Cart Context      | `frontend/src/context/CartContext.tsx`                    | Present                                                                    | ✅     |
| Cart Service      | `frontend/src/services/cartService.ts`                    | Present                                                                    | ✅     |
| Cart Page         | `frontend/src/pages/CartPage.tsx`                         | Present                                                                    | ✅     |
| Cart Components   | `CartItemCard.tsx`, `CartSummary.tsx`                     | Present                                                                    | ✅     |
| AI Usage Doc (M4) | `docs/ai-usage-m4.md`                                     | Present                                                                    | ✅     |

## 2. Rubric Scorecard

| #   | Requirement                              | Points | Status | Evidence                                                                                                                                                                                                                                                                                                  |
| --- | ---------------------------------------- | ------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1a  | useReducer or Context API for cart state | 2      | ✅ Met | [CartContext.tsx](frontend/src/context/CartContext.tsx#L38) — `useReducer` with `cartReducer` and 8 action types; `CartProvider` wraps app; `useCart()` custom hook exported (L237)                                                                                                                       |
| 1b  | Add, update quantity, remove operations  | 2      | ✅ Met | [CartContext.tsx](frontend/src/context/CartContext.tsx#L149-L199) — `addToCart`, `updateQuantity`, `removeItem` all implemented with optimistic UI updates and error recovery                                                                                                                             |
| 1c  | Cart count in header + calculated totals | 1      | ✅ Met | [Header.tsx](frontend/src/components/Header.tsx#L27-L30) — cart badge shows `state.totalItems`; [CartSummary.tsx](frontend/src/components/CartSummary.tsx#L11-L16) — displays subtotal and total                                                                                                          |
| 2a  | GET /api/cart                            | 1      | ✅ Met | [CartController.cs](api/Controllers/CartController.cs#L29) — `[HttpGet]` returns `CartResponse` with items, totals; returns empty cart if none exists (200 OK)                                                                                                                                            |
| 2b  | POST /api/cart (add item)                | 1      | ✅ Met | [CartController.cs](api/Controllers/CartController.cs#L75) — `[HttpPost]` creates cart if needed, handles existing item quantity increment, returns `CreatedAtAction` (201)                                                                                                                               |
| 2c  | PUT /api/cart/{cartItemId} (update qty)  | 1      | ✅ Met | [CartController.cs](api/Controllers/CartController.cs#L120) — `[HttpPut("{cartItemId:int}")]` updates quantity, returns 200 OK or 404 Not Found                                                                                                                                                           |
| 2d  | DELETE endpoints (item + clear)          | 1      | ✅ Met | [CartController.cs](api/Controllers/CartController.cs#L146) — `[HttpDelete("{cartItemId:int}")]` removes single item (204); [CartController.cs](api/Controllers/CartController.cs#L162) — `[HttpDelete("clear")]` removes all items (204)                                                                 |
| 2e  | Proper status codes and responses        | 1      | ✅ Met | 200 OK (GET, PUT), 201 Created (POST), 204 NoContent (DELETE), 404 NotFound (missing product/item); `[Authorize]` returns 401 for unauthenticated requests                                                                                                                                                |
| 3a  | Cart/CartItem EF entities                | 2      | ✅ Met | [Cart.cs](api/Models/Cart.cs) — `Cart` entity with Id, UserId, timestamps, Items collection; [CartItem.cs](api/Models/CartItem.cs) — `CartItem` entity with Id, CartId, ProductId, Quantity                                                                                                               |
| 3b  | Relationships and navigation properties  | 1      | ✅ Met | [CartItem.cs](api/Models/CartItem.cs#L21-L23) — navigation properties `Cart` and `Product` with `[ForeignKey]` annotations; [Cart.cs](api/Models/Cart.cs#L17) — `ICollection<CartItem> Items`; [AppDbContext.cs](api/Data/AppDbContext.cs#L13-L14) — `DbSet<Cart>` and `DbSet<CartItem>` registered       |
| 3c  | Migrations applied, data persists        | 1      | ✅ Met | [20260415212247_InitialAuthAndOrders.cs](api/Migrations/20260415212247_InitialAuthAndOrders.cs#L215-L240) — migration creates Carts and CartItems tables with FK constraints; orchestrator confirmed data persists via API round-trip                                                                     |
| 4a  | Real API replaces mock/localStorage      | 2      | ✅ Met | [cartService.ts](frontend/src/services/cartService.ts) — all 5 functions call `apiFetch` against `/cart` endpoints; grep for `localStorage`/`mock`/`dummy` in frontend shows only auth token storage, no cart mock data                                                                                   |
| 4b  | All cart operations call API             | 2      | ✅ Met | [CartContext.tsx](frontend/src/context/CartContext.tsx#L149-L213) — `addToCart` calls `cartService.addToCart`, `updateQuantity` calls `cartService.updateCartItem`, `removeItem` calls `cartService.removeCartItem`, `clearCart` calls `cartService.clearCart`, `refreshCart` calls `cartService.getCart` |
| 4c  | State synchronization                    | 1      | ✅ Met | [CartContext.tsx](frontend/src/context/CartContext.tsx#L120-L133) — `refreshCart` fetches server state on auth change; optimistic updates roll back on error via `refreshCart`; `FETCH_SUCCESS` replaces local state with server response                                                                 |
| 5a  | Loading states                           | 1      | ✅ Met | [CartPage.tsx](frontend/src/pages/CartPage.tsx#L9) — `if (state.loading) return <p className="loading">Loading cart...</p>`; [CartContext.tsx](frontend/src/context/CartContext.tsx#L42) — `FETCH_START` sets `loading: true`                                                                             |
| 5b  | Error messages and edge cases            | 1      | ✅ Met | [CartPage.tsx](frontend/src/pages/CartPage.tsx#L13) — displays `state.error`; [CartContext.tsx](frontend/src/context/CartContext.tsx#L46) — `FETCH_ERROR` stores error message; empty cart state handled (L16-L21); validators enforce quantity 1-99                                                      |
| 5c  | Success feedback                         | 1      | ✅ Met | [CartContext.tsx](frontend/src/context/CartContext.tsx#L136-L140) — auto-clearing success messages after 3s; [CartPage.tsx](frontend/src/pages/CartPage.tsx#L14-L16) — renders `state.successMessage`; [ProductCard.tsx](frontend/src/components/ProductCard.tsx#L19-L20) — per-card "Added!" feedback    |
| 6a  | Clean component structure                | 1      | ✅ Met | Separate components: `CartItemCard`, `CartSummary`, `ProductCard`; pages: `CartPage`, `CatalogPage`; context separated from UI; types in dedicated `types/` directory                                                                                                                                     |
| 6b  | Service layer / custom hooks             | 1      | ✅ Met | [cartService.ts](frontend/src/services/cartService.ts) — dedicated service module; [api.ts](frontend/src/services/api.ts) — centralized `apiFetch` with auth header injection and token refresh; `useCart()` custom hook in CartContext                                                                   |
| 6c  | AI usage documented                      | 1      | ✅ Met | [ai-usage-m4.md](docs/ai-usage-m4.md) — thorough documentation covering 5 areas (Cart Context, Cart API Service, Cart Components, Product Card integration, Header badge); includes prompts, generated output, and manual modifications                                                                   |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **Optimistic UI pattern is well-implemented**: [CartContext.tsx](frontend/src/context/CartContext.tsx) — The optimistic update + rollback pattern (e.g., `OPTIMISTIC_REMOVE` dispatched immediately, then `refreshCart` on error) is a professional-grade approach. Consider extracting the optimistic/rollback logic into a reusable helper for consistency across future features.

- **Missing authorization on Cart ownership in DB query**: [CartController.cs](api/Controllers/CartController.cs#L90) — `AddToCart` creates a new cart keyed on `CurrentUserId`, which is correct. However, consider adding a unique index on `Carts.UserId` in the database to enforce one cart per user at the DB level, preventing potential race conditions.

- **FluentValidation is a nice touch**: [AddToCartRequestValidator.cs](api/Validators/AddToCartRequestValidator.cs) and [UpdateCartItemRequestValidator.cs](api/Validators/UpdateCartItemRequestValidator.cs) — Good use of FluentValidation for input validation. The quantity bounds (1-99) are enforced on both client and server side.

- **Consider extracting computed values**: [CartController.cs](api/Controllers/CartController.cs#L55-L65) — The `Sum` computations for `TotalItems`, `Subtotal`, and `Total` are duplicated in `GetCart`. Consider moving these to a helper or computing them from the DTO after mapping.

## 6. Git Practices Coaching (Non-Scoring)

- **Incremental development**: The project structure shows separate migrations and well-separated concerns across milestones, suggesting iterative work rather than a single monolithic commit.

- **AI usage transparency**: Maintaining a dedicated `docs/ai-usage-m4.md` file with detailed prompt descriptions, generated output, and manual modifications is excellent professional practice and goes beyond what many students document.

---

**25/25** — All Milestone 4 rubric items fully met. Cart state management uses `useReducer`/Context with optimistic updates, all 5 API endpoints work with proper HTTP semantics, EF Core entities have correct relationships and migrations, the frontend exclusively uses API calls (no mock data), and error handling/UX feedback is comprehensive. The coaching notes above (DB unique index, computed value extraction) are suggestions for professional growth, not scoring deductions.
