-- 005_rls_policies.sql
-- TransitX: Row Level Security for Supabase

ALTER TABLE users     ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE carriers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE freight_events ENABLE ROW LEVEL SECURITY;

-- Users: can only read/update their own row
CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid() = id);

-- Shipments: shippers see their own; carriers see assigned shipments
CREATE POLICY shipments_shipper_select ON shipments
  FOR SELECT USING (auth.uid() = shipper_id);

CREATE POLICY shipments_carrier_select ON shipments
  FOR SELECT USING (auth.uid() = carrier_id);

CREATE POLICY shipments_shipper_insert ON shipments
  FOR INSERT WITH CHECK (auth.uid() = shipper_id);

CREATE POLICY shipments_shipper_update ON shipments
  FOR UPDATE USING (auth.uid() = shipper_id);

-- Carriers: public read, authenticated insert/update
CREATE POLICY carriers_public_select ON carriers
  FOR SELECT USING (true);

CREATE POLICY carriers_auth_insert ON carriers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Freight events: readable by shipment participants
CREATE POLICY freight_events_select ON freight_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM shipments s
      WHERE s.id = freight_events.shipment_id
        AND (s.shipper_id = auth.uid() OR s.carrier_id = auth.uid())
    )
  );
