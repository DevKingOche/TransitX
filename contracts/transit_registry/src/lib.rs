//! TransitX — Freight Registry Contract
//!
//! Records immutable freight events on-chain. Each shipment has a unique
//! tracking ID; events (created, pickup, in_transit, delivered, disputed)
//! are appended and cannot be modified.

#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, vec, Address, Env, String, Symbol, Vec,
};

// ── Storage keys ────────────────────────────────────────────────────────────

#[contracttype]
pub enum DataKey {
    Shipment(String),   // tracking_id → ShipmentRecord
    ShipmentList,       // Vec<String> of all tracking IDs
}

// ── Data types ───────────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone)]
pub struct FreightEvent {
    pub event_type: Symbol,  // created | pickup | in_transit | delivered | disputed
    pub actor: Address,
    pub timestamp: u64,
    pub notes: String,
}

#[contracttype]
#[derive(Clone)]
pub struct ShipmentRecord {
    pub tracking_id: String,
    pub shipper: Address,
    pub origin: String,
    pub destination: String,
    pub cargo_description: String,
    pub payment_amount: i128,   // in stroops (7 decimals)
    pub events: Vec<FreightEvent>,
    pub created_at: u64,
}

// ── Contract ─────────────────────────────────────────────────────────────────

#[contract]
pub struct FreightRegistry;

#[contractimpl]
impl FreightRegistry {
    /// Register a new shipment. Callable only by the shipper.
    pub fn register_shipment(
        env: Env,
        tracking_id: String,
        shipper: Address,
        origin: String,
        destination: String,
        cargo_description: String,
        payment_amount: i128,
    ) -> ShipmentRecord {
        shipper.require_auth();

        // Prevent duplicate tracking IDs
        let key = DataKey::Shipment(tracking_id.clone());
        if env.storage().persistent().has(&key) {
            panic!("shipment already registered");
        }

        let event = FreightEvent {
            event_type: symbol_short!("created"),
            actor: shipper.clone(),
            timestamp: env.ledger().timestamp(),
            notes: String::from_str(&env, "Shipment registered"),
        };

        let record = ShipmentRecord {
            tracking_id: tracking_id.clone(),
            shipper,
            origin,
            destination,
            cargo_description,
            payment_amount,
            events: vec![&env, event],
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&key, &record);

        // Append to global list
        let list_key = DataKey::ShipmentList;
        let mut list: Vec<String> = env
            .storage()
            .persistent()
            .get(&list_key)
            .unwrap_or(vec![&env]);
        list.push_back(tracking_id);
        env.storage().persistent().set(&list_key, &list);

        record
    }

    /// Append a freight event to an existing shipment.
    pub fn log_event(
        env: Env,
        tracking_id: String,
        actor: Address,
        event_type: Symbol,
        notes: String,
    ) -> ShipmentRecord {
        actor.require_auth();

        let key = DataKey::Shipment(tracking_id.clone());
        let mut record: ShipmentRecord = env
            .storage()
            .persistent()
            .get(&key)
            .expect("shipment not found");

        let event = FreightEvent {
            event_type,
            actor,
            timestamp: env.ledger().timestamp(),
            notes,
        };

        record.events.push_back(event);
        env.storage().persistent().set(&key, &record);
        record
    }

    /// Fetch a shipment record by tracking ID.
    pub fn get_shipment(env: Env, tracking_id: String) -> ShipmentRecord {
        let key = DataKey::Shipment(tracking_id);
        env.storage()
            .persistent()
            .get(&key)
            .expect("shipment not found")
    }

    /// Return all registered tracking IDs.
    pub fn list_shipments(env: Env) -> Vec<String> {
        env.storage()
            .persistent()
            .get(&DataKey::ShipmentList)
            .unwrap_or(vec![&env])
    }
}

// ── Tests ─────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_register_and_log() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, FreightRegistry);
        let client = FreightRegistryClient::new(&env, &contract_id);

        let shipper = Address::generate(&env);
        let tracking_id = String::from_str(&env, "FF-001");

        let record = client.register_shipment(
            &tracking_id,
            &shipper,
            &String::from_str(&env, "Lagos"),
            &String::from_str(&env, "Nairobi"),
            &String::from_str(&env, "Electronics"),
            &1_500_000_000_i128,
        );

        assert_eq!(record.events.len(), 1);

        let updated = client.log_event(
            &tracking_id,
            &shipper,
            &symbol_short!("pickup"),
            &String::from_str(&env, "Picked up at warehouse"),
        );

        assert_eq!(updated.events.len(), 2);

        let list = client.list_shipments();
        assert_eq!(list.len(), 1);
    }
}
