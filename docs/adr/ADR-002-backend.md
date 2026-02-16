# ADR-002: Backend Framework (.NET Web API)

## Context
The system requires:
- RESTful endpoints for listings, users, reviews, and messaging
- Authentication validation
- Integration with Azure SQL
- Structured, scalable architecture

## Decision
Use **.NET Web API**.

## Rationale
.NET:
- Provides strong REST support
- Integrates cleanly with Azure services
- Supports middleware for authentication and validation
- Is aligned with enterprise architecture patterns

## Impact
All frontend communication occurs through HTTPS REST calls to the API.
Business logic is centralized in backend controllers/services.

## AI Usage
ChatGPT was used to clarify backend architecture patterns and REST design principles.
