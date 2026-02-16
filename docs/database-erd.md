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
flowchart TB

  %% ===== Core domain (top / center) =====
  subgraph Core
    direction TB
    U[USER]
    L[LISTING]
    U -->|creates| L
  end

  %% ===== Left side: Listing images =====
  subgraph Media
    direction TB
    LI[LISTING_IMAGE]
  end
  L -->|has| LI

  %% ===== Bottom-left: Messaging =====
  subgraph Messaging
    direction TB
    MT[MESSAGE_THREAD]
    M[MESSAGE]
    MT -->|contains| M
  end

  %% Messaging relationships
  U -->|participates_in| MT
  L -->|about| MT
  U -->|sends| M

  %% ===== Bottom-right: Trust & Safety =====
  subgraph Trust_and_Safety
    direction TB
    R[REVIEW]
    RP[REPORT]
  end

  %% Reviews
  U -->|writes| R
  U -->|receives| R
  L -->|related_to| R

  %% Reports
  U -->|submits| RP
  L -->|reported_for| RP
