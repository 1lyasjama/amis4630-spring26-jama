# Buckeye Marketplace
AMIS 4630 – Spring 2026  
Milestone 2: Architecture Design & Frontend Foundation

---

## 1. Business System Summary

Buckeye Marketplace is a secure campus-only marketplace for OSU students to buy and sell items.

Problem:
- Scam risk on Facebook Marketplace
- No verified student identity
- Poor coordination for meetups

Solution:
- OSU email login verification
- Structured listing system
- Messaging between buyers and sellers
- Ratings and reporting system

---

## 2. Feature Prioritization (MoSCoW)

### Must
- OSU Login / Authentication
- User Profiles
- Create Listing
- Edit/Delete Listing
- Listing Photos
- Browse Listings Feed
- Search Listings
- Filter & Sort Listings
- Listing Status (Available/Sold)

### Should
- Payment Preference Display
- Meetup Scheduling
- Save/Favorite Listings
- Notifications

### Could
- Reviews & Ratings
- Report Listing/User
- Admin Dashboard
- Offer / Negotiation
- Shopping Cart
- Product Catalog

---

## 3. Architecture Decisions

See `/docs/adr` folder for full ADR documents.

Key decisions:
- Frontend: React + TypeScript
- Backend: .NET Web API
- Database: Azure SQL
- Authentication: OSU / Microsoft Login
- Hosting: Azure Cloud

---

## 4. Documentation Table of Contents

- System Architecture: `/docs/system-architecture.md`
- Database ERD: `/docs/database-erd.md`
- Component Architecture: `/docs/component-architecture-product-catalog.md`
- ADRs: `/docs/adr`

---

## 5. AI Usage Disclosure

ChatGPT was used for:
- Comparing architecture options
- Drafting ADR structures
- Generating Mermaid diagrams
- Improving documentation clarity


