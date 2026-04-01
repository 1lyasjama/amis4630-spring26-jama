# AI Tool Usage — Milestone 4: Shopping Cart

## Tool Used
- **GitHub Copilot** (integrated in VS Code)

## How AI Was Used

### 1. Cart Context & State Management
**Prompt/Task:** Scaffolding the CartContext provider with useReducer for managing cart state (items, totals, loading, errors).

**What was generated:** Initial boilerplate for the reducer action types, state shape, and context provider wrapper.

**Modifications made:**
- Added optimistic UI update actions (OPTIMISTIC_REMOVE, OPTIMISTIC_CLEAR, OPTIMISTIC_UPDATE_QTY) for smoother UX
- Implemented auto-clearing success messages with a useEffect timer
- Added proper error recovery that re-fetches cart state when optimistic updates fail
- Wrapped all action functions in useCallback for performance

### 2. Cart API Service Layer
**Prompt/Task:** Creating a service module to handle all cart API calls (GET, POST, PUT, DELETE).

**What was generated:** Basic fetch wrapper functions for each endpoint.

**Modifications made:**
- Added handling for 404 response on GET /api/cart to return an empty cart object instead of throwing (since the API returns 404 when no cart exists yet)
- Added error response body parsing in addToCart to surface server-side validation messages
- Ensured all functions use proper TypeScript types matching the backend DTOs

### 3. Cart Components (CartPage, CartItemCard, CartSummary)
**Prompt/Task:** Building the cart UI components for displaying and managing cart items.

**What was generated:** Suggestions for component structure and JSX layout.

**Modifications made:**
- Structured CartItemCard with inline quantity controls (+/- buttons) with min/max enforcement
- Added accessibility attributes (aria-labels) to quantity buttons and remove actions
- Built responsive layout with CSS flexbox for cart page (items list + summary sidebar)
- Added empty cart state with a call-to-action link back to product browsing

### 4. Product Card "Add to Cart" Integration
**Prompt/Task:** Adding add-to-cart functionality to existing ProductCard and ProductDetailPage components.

**What was generated:** Basic onClick handler suggestions.

**Modifications made:**
- Restructured ProductCard from a single `<Link>` wrapper to a `<div>` with a nested link and separate button area, so the add-to-cart button doesn't trigger navigation
- Added event.preventDefault() and event.stopPropagation() to prevent link navigation when clicking add-to-cart
- Added per-card "Added!" feedback that auto-clears after 2 seconds
- Added disabled state during async add operation to prevent double-clicks

### 5. Header with Cart Badge
**Prompt/Task:** Creating a sticky navigation header with a cart item count badge.

**What was generated:** Basic header layout with navigation links.

**Modifications made:**
- Styled badge as a circular counter positioned over the cart link
- Conditionally rendered badge only when totalItems > 0
- Applied OSU scarlet (#bb0000) branding to match existing design system

## Summary
AI was used primarily for generating boilerplate code and initial component scaffolding. All business logic, error handling patterns, optimistic UI updates, accessibility features, and integration with the existing codebase were implemented and refined manually. The AI suggestions served as a starting point that was then adapted to match the project's architecture and requirements.
