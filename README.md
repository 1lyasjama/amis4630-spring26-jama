# Buckeye Marketplace (AMIS 4630)

A full-stack marketplace for OSU students to buy/sell items safely using OSU login.

## Business System Summary
Buckeye Marketplace reduces scam risk and meetup friction by:
- **Verified OSU/Microsoft login** (trust + accountability)
- **Structured listings** with photos/details (clarity)
- **Messaging + meetup coordination** (smooth handoff between buyer/seller)
- **Moderation & reporting** (safety)

## Current Status — Milestone 4: Shopping Cart (Vertical Slice 2)
The shopping cart feature is now live end-to-end. Users can browse products, add items to their cart from both the product listing and detail pages, adjust quantities, remove individual items, clear the entire cart, and see totals update in real time. Cart data persists in the database across page refreshes and browser sessions.

### What's Working
- Product List page showing all available listings as cards
- Product Detail page with full info for each item
- **Add to Cart** from both product listing cards and detail pages
- **Shopping Cart page** with item list, quantity controls, and order summary
- **Cart state management** using React Context + useReducer
- **Cart item count badge** visible in the navigation header
- **5 cart API endpoints**: GET, POST, PUT, DELETE (item), DELETE (clear)
- **Database persistence** via Entity Framework Core with SQLite
- **Optimistic UI updates** for smooth cart interactions
- Loading states, error messages, and success feedback throughout
- Empty cart state with prompt to browse products
- Responsive layout for cart page
- CORS configured for local development

## How to Run Locally

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/) and npm

### 1. Start the .NET API
```bash
cd api
dotnet run
```
The API will start on **http://localhost:5023**.

### 2. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
The app will start on **http://localhost:5173**.

Open http://localhost:5173 in your browser. You should see the product listings pulled from the API.

## Screenshots

### Product List Page
![Product List Page](docs/screenshots/Buckeye%20Product%20List.png)

### Product Detail Page
![Product Detail Page](docs/screenshots/Buckeye%20Product%20Detail.png)

## Project Structure
```
├── api/                              # .NET Web API
│   ├── Controllers/
│   │   ├── ProductsController.cs     # GET /api/products, GET /api/products/{id}
│   │   └── CartController.cs         # GET, POST, PUT, DELETE cart endpoints
│   ├── Models/
│   │   ├── Product.cs                # Product entity
│   │   ├── Cart.cs                   # Cart entity (user's cart)
│   │   └── CartItem.cs               # CartItem entity (line item in cart)
│   ├── Dtos/
│   │   ├── AddToCartRequest.cs       # POST request body
│   │   ├── UpdateCartItemRequest.cs  # PUT request body
│   │   ├── CartResponse.cs           # Full cart response
│   │   └── CartItemResponse.cs       # Individual cart item response
│   ├── Validators/
│   │   ├── AddToCartRequestValidator.cs
│   │   └── UpdateCartItemRequestValidator.cs
│   ├── Data/
│   │   └── AppDbContext.cs           # EF Core context + seed data
│   ├── Migrations/                   # EF Core migrations
│   └── Program.cs                    # App config, CORS, DI
├── frontend/                         # React + TypeScript (Vite)
│   └── src/
│       ├── components/
│       │   ├── Header.tsx            # Navigation bar with cart count badge
│       │   ├── ProductCard.tsx       # Product card with Add to Cart button
│       │   ├── ProductList.tsx       # Grid of product cards
│       │   ├── CartItemCard.tsx      # Cart line item with qty controls
│       │   └── CartSummary.tsx       # Order summary with totals
│       ├── context/
│       │   └── CartContext.tsx        # useReducer + Context for cart state
│       ├── pages/
│       │   ├── CatalogPage.tsx       # Product list page
│       │   ├── ProductDetailPage.tsx # Product detail with Add to Cart
│       │   └── CartPage.tsx          # Shopping cart page
│       ├── services/
│       │   └── cartService.ts        # Cart API service layer
│       ├── types/
│       │   ├── Product.ts            # Product TypeScript interface
│       │   └── Cart.ts               # Cart/CartItem TypeScript interfaces
│       ├── App.tsx                   # Routes + CartProvider
│       └── App.css                   # Styles
└── docs/                             # Architecture & design docs
    └── ai-usage-m4.md               # AI tool usage for Milestone 4
```

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/{id}` | Get product by ID |

### Cart
| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/api/cart` | Get cart contents | 200, 404 |
| POST | `/api/cart` | Add item to cart | 201, 400, 404 |
| PUT | `/api/cart/{cartItemId}` | Update item quantity | 200, 400, 404 |
| DELETE | `/api/cart/{cartItemId}` | Remove item from cart | 204, 404 |
| DELETE | `/api/cart/clear` | Clear entire cart | 204, 404 |

## Feature Prioritization

### Must
- OSU Login / Authentication – Students log in with OSU email
- User Profiles – Buyer and seller profiles
- Create Listing – Post item for sale
- Edit/Delete Listing – Manage listings
- Listing Photos – Upload item images
- Browse Listings Feed – Scroll all listings
- Search Listings – Keyword search
- Filter & Sort Listings – Price/category filters
- Listing Status – Available / Sold

### Should
- Payment Preference Display – Cash/Venmo
- Meetup Scheduling – Plan pickup
- Save/Favorite Listings – Bookmark items
- Notifications – Messages/offers alerts

### Could
- Feature: Admin Dashboard
- Reviews & Ratings – Rate users
- Report Listing/User – Flag issues
- Offer / Negotiation – Send offers

### Done
- Product Catalog — Browse all listings + view product details (Milestone 3)
- Shopping Cart — Add/remove/update cart items with persistent storage (Milestone 4)

## Architecture Decisions (ADRs)
We document key decisions in `/docs/adr/`:
- ADR-001 Frontend: React + TypeScript
- ADR-002 Backend: .NET Web API
- ADR-003 Database: Azure SQL (relational)
- ADR-004 Authentication: OSU/Microsoft Login
- ADR-005 Cloud: Azure deployment

## Documentation Table of Contents
- `/docs/system-architecture.md` — High-level system architecture + request flows
- `/docs/database-erd.md` — ERD + relationships
- `/docs/component-architecture-product-catalog.md` — Frontend component design
- `/docs/ai-usage-m4.md` — AI tool usage for Milestone 4
- `/docs/adr/` — Architecture Decision Records

## AI Tooling Disclosure

### Milestone 3
I used GitHub Copilot and Claude as productivity aids during the Milestone 3 implementation. All AI-generated code was reviewed, understood, and modified before committing.

| Task | AI Tool | What I Did |
|------|---------|------------|
| Scaffolding the `ProductsController` | Claude | Asked for a basic controller skeleton with two GET endpoints. Accepted the structure but wrote my own sample product data to match realistic OSU student listings. |
| Generating the `Product` C# model | Copilot | Autocompleted property names after I typed the first two fields. I accepted most suggestions but changed `DatePosted` to `PostedDate` for consistency with my frontend naming. |
| React component boilerplate | Claude | Asked for a ProductCard component that takes props. Modified the JSX layout and class names to follow my own CSS naming convention instead of using the suggested inline styles. |
| Fetch/loading/error pattern | Copilot | Suggested the `useEffect` + `useState` fetch pattern. I accepted the overall pattern but restructured the error handling to show user-friendly messages rather than raw error objects. |
| CSS grid layout for product cards | Claude | Asked for a responsive grid approach. Took the `auto-fill` + `minmax` pattern but customized breakpoints, spacing, and the OSU scarlet color scheme myself. |
| CORS configuration | Copilot | Autocompleted the CORS middleware setup. I verified the correct origin port (5173 for Vite) and kept the policy scoped rather than using the suggested `AllowAnyOrigin()`. |

### Milestone 4
See [docs/ai-usage-m4.md](docs/ai-usage-m4.md) for detailed AI tool usage documentation for the shopping cart feature. GitHub Copilot was used for scaffolding and boilerplate; all business logic, error handling, optimistic updates, and integration were implemented manually.
