# ADR-003: Database Choice (Azure SQL)

## Context
The system requires:
- Structured relationships between users, listings, images, reviews, and reports
- Reliable transactional consistency when creating and updating listings
- Efficient querying for search, filtering, and sorting
- Strong data integrity enforcement

## Decision
Use **Azure SQL (Relational Database)**.

## Rationale
Azure SQL provides:
- Native support for one-to-many relationships (User → Listings, Listing → Images)
- Referential integrity through foreign keys and constraints
- ACID-compliant transactions for safe listing creation and updates
- Efficient querying using indexed joins for search and filtering

Relational structure aligns naturally with the marketplace domain model.

## Impact
Database schema enforces structural consistency.
Backend relies on SQL joins for listing search and related data retrieval.
Data integrity is maintained at the database level.

## AI Usage
ChatGPT was used to compare relational and NoSQL database approaches and summarize architectural tradeoffs.
