# Changelog

All notable changes to TransitX are documented here.  
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) · [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Initial open-source release on Stellar
- Frontend: Next.js 15 + React 19 with full App Router
- Frontend: Shipment list, create, detail, tracking timeline, carriers, analytics, settings, auth pages
- Frontend: Zustand stores, React Query hooks, React Hook Form + Zod validation
- Backend: NestJS API with JWT auth, TypeORM, PostgreSQL
- Backend: Shipments, Carriers, Users, Auth, Stellar modules
- Backend: Swagger/OpenAPI at `/api/docs`
- Contracts: `freight_registry` — append-only on-chain event log (Soroban/Rust)
- Contracts: `freight_escrow` — milestone-based USDC escrow (Soroban/Rust)
- CI: GitHub Actions for frontend, backend, contracts, release, and security scanning
- Docker Compose for local development
- SQL migration scripts for PostgreSQL schema

## [0.1.0] — 2026-05-17

Initial project scaffold.
