-- 002_create_carriers.sql
-- TransitX: carriers table

CREATE TYPE carrier_status AS ENUM ('active', 'inactive', 'suspended');

CREATE TABLE IF NOT EXISTS carriers (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                     TEXT NOT NULL UNIQUE,
  email                    TEXT NOT NULL UNIQUE,
  phone                    TEXT,
  stellar_address          TEXT,
  dot_number               TEXT,
  mc_number                TEXT,
  rating                   NUMERIC(3, 2) NOT NULL DEFAULT 0,
  completed_shipments      INT NOT NULL DEFAULT 0,
  status                   carrier_status NOT NULL DEFAULT 'active',
  insurance_policy_number  TEXT,
  insurance_expiry_date    DATE,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_carriers_status ON carriers (status);

CREATE TRIGGER carriers_updated_at
  BEFORE UPDATE ON carriers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
