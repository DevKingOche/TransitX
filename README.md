# TransitX

**Decentralized freight and logistics, transparently secured on Stellar.**

[![CI](https://github.com/DevKingOche/TransitX/actions/workflows/ci.yml/badge.svg)](https://github.com/DevKingOche/TransitX/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Built on Stellar](https://img.shields.io/badge/built%20on-Stellar-7B2FBE)](https://stellar.org)

---

## What is TransitX?

TransitX is a decentralized logistics and freight management platform built on the Stellar network. It modernizes traditional freight operations by incorporating blockchain and Web3 principles — providing transparent, auditable, and automated workflows for shipment tracking, cargo management, and freight settlements.

TransitX serves small businesses, large enterprises, and independent shippers who need reliable, tamper-proof records of freight events and on-chain settlement in USDC.

### Who benefits

| Stakeholder | What they get |
|---|---|
| **Shipper** | Create and track freight jobs end-to-end; pay carriers in USDC with milestone-based releases. |
| **Carrier** | Receive partial payment on pickup and the remainder on confirmed delivery — no more chasing invoices. |
| **Broker / 3PL** | Manage multiple shipments, view analytics, and earn transparent fees recorded on-chain. |
| **Enterprise** | Full audit trail of every freight event, immutable and verifiable on Stellar. |

---

## Why Stellar

TransitX is built on Stellar because freight settlement demands fast, cheap, and final transactions with a stable unit of account.

| Product | Role |
|---|---|
| [Stellar Wallets Kit](https://github.com/Creit-Tech/Stellar-Wallets-Kit) | One wallet layer for Freighter, Albedo, xBull, and more |
| [Trustless Work](https://trustlesswork.com) | Non-custodial milestone-based escrow for freight payments |
| Stellar USDC | Settlement currency — fast, cheap, globally accessible |
| Soroban Smart Contracts | On-chain freight event registry and payment logic |
| SEP-10 / SEP-24 | Auth and fiat on/off-ramp integration |

---

## How It Works

1. **Create Shipment** — Shipper creates a freight job with origin, destination, cargo details, and payment milestones. A Stellar escrow is deployed via Trustless Work.
2. **Carrier Assignment** — A carrier accepts the job; funds are locked in escrow.
3. **Pickup & Transit** — Carrier logs pickup; the first milestone payment is released to the carrier.
4. **Delivery & Settlement** — Carrier confirms delivery; remaining funds are released. All events are recorded on-chain.
5. **Dispute Resolution** — Either party can raise a dispute; a resolver adjudicates and the escrow releases accordingly.

See [doc/architecture.md](doc/architecture.md) for sequence diagrams and full integration details.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, Zustand, React Query |
| Backend | NestJS, TypeORM, PostgreSQL |
| Auth & Storage | Supabase (Auth, Postgres, RLS, Storage) |
| Blockchain | Stellar (Soroban smart contracts, Rust) |
| Wallets | Stellar Wallets Kit (`@creit.tech/stellar-wallets-kit`) |
| Escrow | Trustless Work (`@trustless-work/escrow`) |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Language | TypeScript (strict) |

---

## Quick Start

For the full step-by-step checklist, see **[SETUP.md](SETUP.md)**.

```bash
git clone https://github.com/DevKingOche/TransitX.git
cd TransitX

# Frontend
cd frontend
npm install
cp .env.example .env.local   # fill in your values
npm run dev

# Backend (separate terminal)
cd ../backend
npm install
cp .env.example .env
npm run start:dev
```

Frontend: [http://localhost:3000](http://localhost:3000)  
Backend API: [http://localhost:4000](http://localhost:4000)

---

## Project Structure

```
TransitX/
├── frontend/                 # Next.js 15 frontend
│   ├── app/                  # App Router pages
│   │   ├── page.tsx          # Landing
│   │   ├── dashboard/        # Role-based dashboard
│   │   ├── shipments/        # Shipment list + create
│   │   ├── shipments/[id]/   # Shipment detail + tracking
│   │   ├── carriers/         # Carrier directory
│   │   ├── analytics/        # Analytics & reporting
│   │   ├── settings/         # Profile + Stellar address
│   │   └── auth/             # Login, sign-up
│   ├── components/           # Navigation, ShipmentCard, UI primitives
│   ├── lib/                  # Supabase clients, Stellar helpers, formatters
│   ├── hooks/                # useWallet, useShipment, useAuth
│   ├── providers/            # WalletProvider, QueryProvider
│   └── store/                # Zustand stores
│
├── backend/                  # NestJS backend
│   └── src/
│       ├── shipments/        # Shipment module (CRUD + events)
│       ├── carriers/         # Carrier module
│       ├── users/            # User module
│       ├── auth/             # JWT auth module
│       ├── stellar/          # Stellar/Soroban integration service
│       └── common/           # Guards, interceptors, pipes
│
├── contracts/                # Soroban smart contracts (Rust)
│   ├── freight_registry/     # On-chain freight event registry
│   └── freight_escrow/       # Milestone-based payment escrow
│
├── doc/                      # Architecture, contributing guides
├── .github/                  # CI/CD workflows, issue/PR templates
├── README.md
├── SETUP.md
└── LICENSE
```

---

## Environment Variables

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only service role key |
| `NEXT_PUBLIC_STELLAR_NETWORK` | `testnet` or `mainnet` |
| `NEXT_PUBLIC_TRANSITX_PLATFORM_ADDRESS` | Platform Stellar address |
| `NEXT_PUBLIC_TRUSTLESS_WORK_API_KEY` | Trustless Work API key |
| `NEXT_PUBLIC_TRUSTLESS_NETWORK` | `testnet` or `mainnet` |

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | JWT signing secret |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `STELLAR_NETWORK` | `testnet` or `mainnet` |
| `STELLAR_SECRET_KEY` | Platform Stellar secret key |

---

## Documentation

- [Architecture](doc/architecture.md) — system overview, flows, Mermaid diagrams, all integrations
- [Contributing](doc/contributing.md) — how to contribute, commit style, PR guidelines
- [SETUP.md](SETUP.md) — step-by-step local setup checklist

---

## Contributing

Contributions are welcome! Please read [doc/contributing.md](doc/contributing.md) before opening a PR.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Implement your changes with tests
4. Open a Pull Request

---

## License

Apache License 2.0 — see [LICENSE](LICENSE).
