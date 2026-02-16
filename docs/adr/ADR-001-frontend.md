# ADR-001: Frontend Framework (React + TypeScript)

## Context
Buckeye Marketplace requires:
- Dynamic UI updates (filters, search, messaging)
- Reusable listing components
- Strong typing for maintainability
- Clear separation of UI logic and API calls

## Decision
Use **React with TypeScript**.

## Rationale
React enables:
- Component-based architecture (listing cards, forms, filters)
- Efficient rendering of dynamic data
- Clear state management patterns

TypeScript adds:
- Static type checking
- Safer refactoring
- Better developer experience for a growing project

## Impact
Frontend communicates with backend via REST API.
UI logic is fully separated from database and authentication logic.

## AI Usage
ChatGPT was used to compare frontend framework options and summarize tradeoffs.
