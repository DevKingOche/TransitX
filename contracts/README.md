# TransitX Smart Contracts

Soroban (Rust) smart contracts deployed on the Stellar network.

## Contracts

| Contract | Description |
|---|---|
| `freight_registry` | Immutable on-chain freight event log |
| `freight_escrow` | Milestone-based USDC payment escrow |

## Prerequisites

```bash
rustup target add wasm32-unknown-unknown
cargo install --locked stellar-cli --features opt
```

## Build

```bash
# From this directory
stellar contract build
```

Or individually:

```bash
cd freight_registry && cargo build --target wasm32-unknown-unknown --release
cd freight_escrow   && cargo build --target wasm32-unknown-unknown --release
```

## Test

```bash
cargo test
```

## Deploy (Testnet)

```bash
# Registry
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/freight_registry.wasm \
  --source <YOUR_SECRET_KEY> \
  --network testnet

# Escrow
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/freight_escrow.wasm \
  --source <YOUR_SECRET_KEY> \
  --network testnet
```

Set the returned contract IDs in your `.env` files.

## Contract Interfaces

### freight_registry

| Function | Description |
|---|---|
| `register_shipment(tracking_id, shipper, origin, destination, cargo_description, payment_amount)` | Register a new shipment |
| `log_event(tracking_id, actor, event_type, notes)` | Append a freight event |
| `get_shipment(tracking_id)` | Read a shipment record |
| `list_shipments()` | List all tracking IDs |

### freight_escrow

| Function | Description |
|---|---|
| `fund(tracking_id, shipper, carrier, resolver, token, total_amount, pickup_bps)` | Lock funds in escrow |
| `release_pickup(tracking_id)` | Carrier releases pickup milestone |
| `confirm_delivery(tracking_id)` | Shipper confirms delivery, releases remainder |
| `raise_dispute(tracking_id, caller)` | Raise a dispute |
| `resolve(tracking_id, carrier_bps)` | Resolver adjudicates dispute |
| `cancel(tracking_id)` | Shipper cancels (full refund, funded state only) |
| `get_escrow(tracking_id)` | Read escrow state |
