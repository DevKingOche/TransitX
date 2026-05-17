-- 003_create_shipments.sql
-- TransitX: shipments table

CREATE TYPE shipment_status AS ENUM (
  'draft',
  'pending_pickup',
  'in_transit',
  'delivered',
  'disputed',
  'cancelled'
);

CREATE TABLE IF NOT EXISTS shipments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number     TEXT NOT NULL UNIQUE,
  origin              TEXT NOT NULL,
  destination         TEXT NOT NULL,
  cargo_description   TEXT,
  weight_kg           NUMERIC(10, 2),
  payment_amount      NUMERIC(18, 7) NOT NULL,
  payment_currency    TEXT NOT NULL DEFAULT 'USDC',
  status              shipment_status NOT NULL DEFAULT 'draft',
  escrow_address      TEXT,
  escrow_contract_id  TEXT,
  pickup_date         DATE,
  shipper_id          UUID NOT NULL REFERENCES users (id),
  carrier_id          UUID REFERENCES users (id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shipments_shipper ON shipments (shipper_id);
CREATE INDEX idx_shipments_carrier ON shipments (carrier_id);
CREATE INDEX idx_shipments_status  ON shipments (status);
CREATE INDEX idx_shipments_tracking ON shipments (tracking_number);

CREATE TRIGGER shipments_updated_at
  BEFORE UPDATE ON shipments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
