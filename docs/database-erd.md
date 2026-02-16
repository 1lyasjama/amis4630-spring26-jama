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
flowchart LR

  %% Core domain
  subgraph Core
    U[USER]
    L[LISTING]
    LI[LISTING_IMAGE]
  end

  %% Messaging domain
  subgraph Messaging
    MT[MESSAGE_THREAD]
    M[MESSAGE]
  end

  %% Trust & safety domain
  subgraph Trust_&_Safety
    R[REVIEW]
    RP[REPORT]
  end

  %% Core relationships
  U -->|creates| L
  L -->|has| LI

  %% Messaging relationships
  U -->|participates_in| MT
  L -->|about| MT
  MT -->|contains| M
  U -->|sends| M

  %% Review relationships
  U -->|writes| R
  U -->|receives| R
  L -->|related_to| R

  %% Report relationships
  U -->|submits| RP
  L -->|reported_for| RP
