# Database ERD (High-Level)

## Overview
This ERD shows the core entities for **Buckeye Marketplace** and how they relate at a high level.
It focuses on **main tables + relationships** (not column-level details).

---

## Main Entities
- **User**: OSU-authenticated student account
- **Listing**: items posted for sale
- **ListingImage**: images attached to a listing
- **MessageThread**: conversation context between two users about a listing
- **Message**: individual messages inside a thread
- **Review**: rating/feedback between users after a transaction/interaction
- **Report**: flags for unsafe/fraud/violations (moderation)

---

## Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
  USER ||--o{ LISTING : creates
  LISTING ||--o{ LISTING_IMAGE : has

  USER ||--o{ MESSAGE_THREAD : participates_in
  LISTING ||--o{ MESSAGE_THREAD : about
  MESSAGE_THREAD ||--o{ MESSAGE : contains
  USER ||--o{ MESSAGE : sends

  USER ||--o{ REVIEW : writes
  USER ||--o{ REVIEW : receives
  LISTING ||--o{ REVIEW : related_to

  USER ||--o{ REPORT : submits
  LISTING ||--o{ REPORT : reported_for
