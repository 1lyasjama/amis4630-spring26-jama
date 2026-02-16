# ADR-004: Authentication Strategy (OSU / Microsoft Login)

## Context
User research identified scam concerns and trust issues.
Marketplace requires identity verification.

## Decision
Use **OSU / Microsoft authentication (OAuth-based login)**.

## Rationale
- Ties identity to verified OSU email
- Reduces anonymous misuse
- Eliminates need to store passwords
- Leverages secure external provider

## Impact
Frontend redirects users to Microsoft login.
Backend validates access tokens before serving protected endpoints.

## AI Usage
ChatGPT was used to outline authentication flow and security tradeoffs.
