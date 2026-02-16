# System Architecture

## Connection to User Needs (Milestone 1)

Users identified:
- Scam concerns
- Unclear listing details
- Difficulty coordinating meetups

This architecture supports:
- Verified login for trust
- Centralized searchable catalog
- Messaging system for coordination
- Image storage for clear item details

## High-Level Architecture

Frontend: React + TypeScript  
Backend: .NET Web API  
Database: Azure SQL  
Authentication: OSU / Microsoft Login  

Flow:

User → React Frontend → .NET API → SQL Database  

Authentication Flow:
User → Microsoft Login → Token → Backend validation
