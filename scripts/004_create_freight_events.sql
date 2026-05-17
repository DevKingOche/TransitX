-- 004_create_freight_events.sql
-- TransitX: off-chain mirror of on-chain freight events

CREATE TYPE freight_event_type AS ENUM (
  'created',
  'pickup',
  'in_transit',
  'delivered',
  'disputed',
  'resolved',
  'cancelled'
);

CREATE TABLE IF NOT EXISTS freight_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id     UUID NOT NULL REFERENCES shipments (id) ON DELETE CASCADE,
  event_type      freight_event_type NOT NULL,
  actor_id        UUID REFERENCES users (id),
  stellar_tx_hash TEXT,
  notes           TEXT,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_freight_events_shipment ON freight_events (shipment_id);
CREATE INDEX idx_freight_events_type     ON freight_events (event_type);
