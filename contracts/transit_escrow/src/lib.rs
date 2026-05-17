//! TransitX — Freight Escrow Contract
//!
//! Milestone-based payment escrow for freight jobs.
//! Funds are locked on job creation and released in two milestones:
//!   1. Pickup milestone  — released when carrier logs pickup
//!   2. Delivery milestone — released when shipper confirms delivery
//!
//! Either party can raise a dispute; a designated resolver adjudicates.

#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Env, String,
};

// ── Storage keys ─────────────────────────────────────────────────────────────

#[contracttype]
pub enum DataKey {
    Escrow(String), // tracking_id → EscrowState
}

// ── Data types ────────────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone, PartialEq)]
pub enum EscrowStatus {
    Funded,
    PickupReleased,
    Delivered,
    Disputed,
    Resolved,
    Cancelled,
}

#[contracttype]
#[derive(Clone)]
pub struct EscrowState {
    pub tracking_id: String,
    pub shipper: Address,
    pub carrier: Address,
    pub resolver: Address,
    pub token: Address,
    pub total_amount: i128,
    pub pickup_amount: i128,   // released on pickup
    pub delivery_amount: i128, // released on delivery
    pub status: EscrowStatus,
    pub created_at: u64,
}

// ── Contract ──────────────────────────────────────────────────────────────────

#[contract]
pub struct FreightEscrow;

#[contractimpl]
impl FreightEscrow {
    /// Shipper funds the escrow. Tokens are transferred from shipper to contract.
    pub fn fund(
        env: Env,
        tracking_id: String,
        shipper: Address,
        carrier: Address,
        resolver: Address,
        token: Address,
        total_amount: i128,
        pickup_bps: u32, // basis points for pickup milestone (e.g. 3000 = 30%)
    ) -> EscrowState {
        shipper.require_auth();

        let key = DataKey::Escrow(tracking_id.clone());
        if env.storage().persistent().has(&key) {
            panic!("escrow already exists for this shipment");
        }

        if pickup_bps > 10_000 {
            panic!("pickup_bps must be <= 10000");
        }

        let pickup_amount = total_amount * pickup_bps as i128 / 10_000;
        let delivery_amount = total_amount - pickup_amount;

        // Transfer tokens from shipper to this contract
        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&shipper, &env.current_contract_address(), &total_amount);

        let state = EscrowState {
            tracking_id: tracking_id.clone(),
            shipper,
            carrier,
            resolver,
            token,
            total_amount,
            pickup_amount,
            delivery_amount,
            status: EscrowStatus::Funded,
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&key, &state);
        state
    }

    /// Carrier calls this on pickup — releases pickup milestone.
    pub fn release_pickup(env: Env, tracking_id: String) -> EscrowState {
        let key = DataKey::Escrow(tracking_id.clone());
        let mut state: EscrowState = env
            .storage()
            .persistent()
            .get(&key)
            .expect("escrow not found");

        state.carrier.require_auth();

        if state.status != EscrowStatus::Funded {
            panic!("invalid state for pickup release");
        }

        let token_client = token::Client::new(&env, &state.token);
        token_client.transfer(
            &env.current_contract_address(),
            &state.carrier,
            &state.pickup_amount,
        );

        state.status = EscrowStatus::PickupReleased;
        env.storage().persistent().set(&key, &state);
        state
    }

    /// Shipper confirms delivery — releases remaining funds to carrier.
    pub fn confirm_delivery(env: Env, tracking_id: String) -> EscrowState {
        let key = DataKey::Escrow(tracking_id.clone());
        let mut state: EscrowState = env
            .storage()
            .persistent()
            .get(&key)
            .expect("escrow not found");

        state.shipper.require_auth();

        if state.status != EscrowStatus::PickupReleased {
            panic!("pickup must be released before delivery confirmation");
        }

        let token_client = token::Client::new(&env, &state.token);
        token_client.transfer(
            &env.current_contract_address(),
            &state.carrier,
            &state.delivery_amount,
        );

        state.status = EscrowStatus::Delivered;
        env.storage().persistent().set(&key, &state);
        state
    }

    /// Either party raises a dispute.
    pub fn raise_dispute(env: Env, tracking_id: String, caller: Address) -> EscrowState {
        let key = DataKey::Escrow(tracking_id.clone());
        let mut state: EscrowState = env
            .storage()
            .persistent()
            .get(&key)
            .expect("escrow not found");

        caller.require_auth();

        if caller != state.shipper && caller != state.carrier {
            panic!("only shipper or carrier can raise a dispute");
        }

        if state.status == EscrowStatus::Delivered || state.status == EscrowStatus::Resolved {
            panic!("cannot dispute a completed escrow");
        }

        state.status = EscrowStatus::Disputed;
        env.storage().persistent().set(&key, &state);
        state
    }

    /// Resolver adjudicates: splits remaining funds between shipper and carrier.
    pub fn resolve(
        env: Env,
        tracking_id: String,
        carrier_bps: u32, // basis points of remaining funds going to carrier
    ) -> EscrowState {
        let key = DataKey::Escrow(tracking_id.clone());
        let mut state: EscrowState = env
            .storage()
            .persistent()
            .get(&key)
            .expect("escrow not found");

        state.resolver.require_auth();

        if state.status != EscrowStatus::Disputed {
            panic!("escrow is not in disputed state");
        }

        if carrier_bps > 10_000 {
            panic!("carrier_bps must be <= 10000");
        }

        // Remaining balance = total - already released pickup (if any)
        let released = if state.status == EscrowStatus::PickupReleased {
            state.pickup_amount
        } else {
            0
        };
        let remaining = state.total_amount - released;

        let carrier_share = remaining * carrier_bps as i128 / 10_000;
        let shipper_share = remaining - carrier_share;

        let token_client = token::Client::new(&env, &state.token);
        let contract = env.current_contract_address();

        if carrier_share > 0 {
            token_client.transfer(&contract, &state.carrier, &carrier_share);
        }
        if shipper_share > 0 {
            token_client.transfer(&contract, &state.shipper, &shipper_share);
        }

        state.status = EscrowStatus::Resolved;
        env.storage().persistent().set(&key, &state);
        state
    }

    /// Shipper cancels before carrier is assigned (full refund).
    pub fn cancel(env: Env, tracking_id: String) -> EscrowState {
        let key = DataKey::Escrow(tracking_id.clone());
        let mut state: EscrowState = env
            .storage()
            .persistent()
            .get(&key)
            .expect("escrow not found");

        state.shipper.require_auth();

        if state.status != EscrowStatus::Funded {
            panic!("can only cancel a freshly funded escrow");
        }

        let token_client = token::Client::new(&env, &state.token);
        token_client.transfer(
            &env.current_contract_address(),
            &state.shipper,
            &state.total_amount,
        );

        state.status = EscrowStatus::Cancelled;
        env.storage().persistent().set(&key, &state);
        state
    }

    /// Read escrow state.
    pub fn get_escrow(env: Env, tracking_id: String) -> EscrowState {
        let key = DataKey::Escrow(tracking_id);
        env.storage()
            .persistent()
            .get(&key)
            .expect("escrow not found")
    }
}

// ── Tests ─────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{
        testutils::{Address as _, MockAuth, MockAuthInvoke},
        token::{Client as TokenClient, StellarAssetClient},
        Env, IntoVal,
    };

    fn setup() -> (Env, Address, Address, Address, Address, Address) {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, FreightEscrow);
        let token_admin = Address::generate(&env);
        let token_id = env.register_stellar_asset_contract_v2(token_admin.clone()).address();
        let shipper = Address::generate(&env);
        let carrier = Address::generate(&env);
        let resolver = Address::generate(&env);

        // Mint tokens to shipper
        let token_admin_client = StellarAssetClient::new(&env, &token_id);
        token_admin_client.mint(&shipper, &10_000_000_000_i128);

        (env, contract_id, token_id, shipper, carrier, resolver)
    }

    #[test]
    fn test_full_happy_path() {
        let (env, contract_id, token_id, shipper, carrier, resolver) = setup();
        let client = FreightEscrowClient::new(&env, &contract_id);
        let tracking_id = soroban_sdk::String::from_str(&env, "FF-001");

        // Fund
        client.fund(
            &tracking_id,
            &shipper,
            &carrier,
            &resolver,
            &token_id,
            &1_000_000_000_i128,
            &3000_u32,
        );

        // Pickup
        client.release_pickup(&tracking_id);

        // Delivery
        let state = client.confirm_delivery(&tracking_id);
        assert_eq!(state.status, EscrowStatus::Delivered);
    }
}
