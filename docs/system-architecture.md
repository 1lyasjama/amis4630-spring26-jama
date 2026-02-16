# System Architecture (High-Level) — Buckeye Marketplace

## 1. Purpose
Buckeye Marketplace is a full-stack marketplace for OSU students to list items, browse/search listings, message sellers, and manage listing status (available/sold). The system is designed to reduce scams using OSU login, support clear listing details (photos + descriptions), and make meetups easier (messaging + scheduling).

---

## 2. Tech Stack (Course Stack)
- **Frontend:** React + TypeScript
- **Backend:** .NET Web API
- **Database:** Azure SQL (relational)
- **Auth:** OSU / Microsoft login (OAuth)
- **Storage:** Image storage (Azure Blob or similar)
- **Hosting:** Azure (App Service / Static Web Apps + API + DB)

---

## 3. High-Level Architecture Diagram

```mermaid
flowchart LR
  U[Student User] -->|Browser| FE[React Frontend]
  FE -->|HTTPS REST API| API[.NET Web API]

  API --> DB[(Azure SQL Database)]
  API --> IMG[(Image Storage)]
  API --> AUTH[OSU/Microsoft Authentication]
  API --> ADMIN[Admin Moderation Tools]

  subgraph Azure Cloud
    FE
    API
    DB
    IMG
  end
