# Buckeye Marketplace (AMIS 4630)

A full-stack marketplace for OSU students to buy/sell items safely using OSU login.

## Business System Summary
Buckeye Marketplace reduces scam risk and meetup friction by:
- **Verified OSU/Microsoft login** (trust + accountability)
- **Structured listings** with photos/details (clarity)
- **Messaging + meetup coordination** (smooth handoff between buyer/seller)
- **Moderation & reporting** (safety)

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
- (Move items here only after implemented in code + tested)

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

## AI Tooling Disclosure
AI tools (ChatGPT) were used to:
- Compare architecture options (React vs others, DB options, hosting)
- Draft documentation structure (ADRs, diagrams, flow descriptions)
All AI usage is noted in ADRs and commit messages.
