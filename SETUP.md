# TransitX — Local Setup Checklist

Follow these steps in order to run TransitX locally.

---

## Prerequisites

- Node.js 20+
- npm 10+ (or pnpm 9+)
- PostgreSQL 15+ (or use Supabase local)
- Rust + Cargo (for Soroban contracts)
- Stellar CLI (`stellar` or `soroban`)
- A Supabase account (free tier works)
- A Freighter wallet browser extension (for testing)

---

## 1. Clone the repository

```bash
git clone https://github.com/DevKingOche/TransitX.git
cd TransitX
```

---

## 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. Copy your **Project URL** and **anon key** from Settings → API.
3. Copy your **service role key** (keep this secret).
4. Run the database migrations:

```bash
# Using Supabase CLI
supabase link --project-ref <your-project-ref>
supabase db push

# Or run SQL scripts manually in the Supabase SQL editor:
# frontend/supabase/migrations/*.sql  (in order)
```

---

## 3. Set up the Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_TRANSITX_PLATFORM_ADDRESS=GPLACEHOLDER
NEXT_PUBLIC_TRUSTLESS_WORK_API_KEY=your-trustless-work-key
NEXT_PUBLIC_TRUSTLESS_NETWORK=testnet
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 4. Set up the Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/transitx
JWT_SECRET=your-super-secret-jwt-key-change-in-production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STELLAR_NETWORK=testnet
STELLAR_SECRET_KEY=SPLACEHOLDER
PORT=4000
```

Start the backend:

```bash
npm run start:dev
```

API available at [http://localhost:4000](http://localhost:4000).  
Swagger docs at [http://localhost:4000/api](http://localhost:4000/api).

---

## 5. Set up Soroban Contracts (optional for local dev)

```bash
cd contracts

# Install Stellar CLI
cargo install --locked stellar-cli --features opt

# Build contracts
cd freight_registry
cargo build --target wasm32-unknown-unknown --release

cd ../freight_escrow
cargo build --target wasm32-unknown-unknown --release

# Deploy to testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/freight_escrow.wasm \
  --source <your-secret-key> \
  --network testnet
```

---

## 6. Get a Testnet Wallet

1. Install [Freighter](https://freighter.app) browser extension.
2. Create or import a wallet.
3. Switch to **Testnet** in Freighter settings.
4. Fund your testnet account at [friendbot.stellar.org](https://friendbot.stellar.org/?addr=YOUR_ADDRESS).

---

## 7. Verify everything works

- [ ] Frontend loads at http://localhost:3000
- [ ] Backend API responds at http://localhost:4000/api
- [ ] Supabase auth works (sign up / sign in)
- [ ] Freighter wallet connects on the frontend
- [ ] Can create a test shipment

---

## Troubleshooting

**`NEXT_PUBLIC_SUPABASE_URL` is not defined**  
→ Make sure you copied `.env.example` to `.env.local` and filled in the values.

**Database connection refused**  
→ Check your `DATABASE_URL` in `backend/.env`. Make sure PostgreSQL is running.

**Stellar transaction fails**  
→ Make sure you're on testnet and your account is funded via Friendbot.

**Contract deployment fails**  
→ Ensure `stellar-cli` is installed and you have a funded testnet account.
