# Buckeye Marketplace (AMIS 4630)

A full-stack marketplace for OSU students to buy/sell items safely using OSU login.

## Business System Summary
Buckeye Marketplace reduces scam risk and meetup friction by:
- **Verified OSU/Microsoft login** (trust + accountability)
- **Structured listings** with photos/details (clarity)
- **Messaging + meetup coordination** (smooth handoff between buyer/seller)
- **Moderation & reporting** (safety)

## Current Status — Milestone 3: Product Catalog (Vertical Slice 1)
The first working feature is live. Users can browse a list of products and click into any product to see full details. Data flows from a .NET Web API (in-memory data store) through to the React frontend.

### What's Working
- Product List page showing all available listings as cards
- Product Detail page with full info for each item
- Client-side routing between list and detail views (React Router)
- Two API endpoints: `GET /api/products` and `GET /api/products/{id}`
- Loading and empty states handled in the UI
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
├── api/                          # .NET Web API
│   ├── Controllers/
│   │   └── ProductsController.cs # GET /api/products, GET /api/products/{id}
│   ├── Models/
│   │   └── Product.cs            # Product data model
│   └── Program.cs                # App config, CORS, routing
├── frontend/                     # React + TypeScript (Vite)
│   └── src/
│       ├── components/
│       │   ├── ProductCard.tsx    # Individual product card (molecule)
│       │   └── ProductList.tsx    # Grid of product cards (organism)
│       ├── pages/
│       │   ├── CatalogPage.tsx    # Product list page (fetches from API)
│       │   └── ProductDetailPage.tsx # Single product detail page
│       ├── types/
│       │   └── Product.ts        # TypeScript interface for Product
│       ├── App.tsx               # Routes (React Router)
│       └── App.css               # Styles
└── docs/                         # Architecture & design docs
```

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
- Feature: Product Catalog
- Feature: Shopping Cart
- Feature: Admin Dashboard
- Reviews & Ratings – Rate users
- Report Listing/User – Flag issues
- Offer / Negotiation – Send offers

### Done
- Product Catalog — Browse all listings + view product details (Milestone 3)

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
- `/docs/adr/` — Architecture Decision Records

## AI Tooling Disclosure (Milestone 3)

### Summary
I used GitHub Copilot and Claude as productivity aids during the Milestone 3 implementation. All AI-generated code was reviewed, understood, and modified before committing. 

### What AI Helped With

| Task | AI Tool | What I Did |
|------|---------|------------|
| Scaffolding the `ProductsController` | Claude | Asked for a basic controller skeleton with two GET endpoints. Accepted the structure but wrote my own sample product data to match realistic OSU student listings. |
| Generating the `Product` C# model | Copilot | Autocompleted property names after I typed the first two fields. I accepted most suggestions but changed `DatePosted` to `PostedDate` for consistency with my frontend naming. |
| React component boilerplate | Claude | Asked for a ProductCard component that takes props. Modified the JSX layout and class names to follow my own CSS naming convention instead of using the suggested inline styles. |
| Fetch/loading/error pattern | Copilot | Suggested the `useEffect` + `useState` fetch pattern. I accepted the overall pattern but restructured the error handling to show user-friendly messages rather than raw error objects. |
| CSS grid layout for product cards | Claude | Asked for a responsive grid approach. Took the `auto-fill` + `minmax` pattern but customized breakpoints, spacing, and the OSU scarlet color scheme myself. |
| CORS configuration | Copilot | Autocompleted the CORS middleware setup. I verified the correct origin port (5173 for Vite) and kept the policy scoped rather than using the suggested `AllowAnyOrigin()`. |

### Prompts Used
1. *"Create a .NET Web API controller for products with GET all and GET by id endpoints using an in-memory list"* — Used the controller structure, rewrote the sample data.
2. *"React component that displays a product card with title, price, category, and seller name as props"* — Used as a starting point, changed from inline styles to CSS classes and added the Link wrapper for routing.
3. *"How to set up CORS in .NET to allow requests from a React dev server"* — Followed the pattern but restricted the origin to localhost:5173 specifically.

### Where I Relied on My Own Judgment
- **Sample product data**: Wrote all 10 products myself to reflect realistic OSU student marketplace items (textbooks, dorm furniture, electronics, clothing) across 4 categories.
- **Component hierarchy**: Followed the Atomic Design structure from my M2 component architecture doc — `CatalogPage` > `ProductList` > `ProductCard` — rather than a flat structure.
- **Routing structure**: Decided on `/products/:id` for detail pages and used React Router's `useParams` hook.
- **Styling decisions**: Designed the card hover effect and built a responsive layout without a CSS framework.
- **API port configuration**: Matched the Vite dev server port to the CORS policy rather than using a wildcard origin.
- **Error and empty states**: Decided to show distinct messages for loading, error, and empty states rather than a single fallback.

### What I Rejected
- AI suggested using Axios for HTTP requests — I stuck with the built-in `fetch` API to keep dependencies minimal for this milestone.
- AI suggested adding search/filter functionality in the controller — I deferred that since it's not in the M3 scope and would add unnecessary complexity.
- AI suggested using a separate service layer in the .NET project — I kept the in-memory data in the controller since we're replacing it with Entity Framework in M4 .
