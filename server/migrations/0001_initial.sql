-- JosStay initial schema.
-- Core source: docs/02-BACKEND-ARCHITECTURE.md §3.
-- Refund recovery fields: docs/11-PAYSTACK-SPLIT-REFUND-CONFIRMATION.md §2.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE hotel_status AS ENUM ('draft', 'pending', 'published');
CREATE TYPE policy_template AS ENUM ('flexible', 'moderate', 'strict');
CREATE TYPE booking_status AS ENUM (
  'draft',
  'held',
  'payment_pending',
  'confirmed',
  'completed',
  'expired',
  'failed',
  'cancelled',
  'refund_pending',
  'refunded',
  'no_show'
);
CREATE TYPE refund_status AS ENUM ('initiated', 'processing', 'completed', 'failed');
CREATE TYPE recovery_status AS ENUM ('none', 'open', 'recovering', 'recovered', 'written_off');

CREATE OR REPLACE FUNCTION josstay_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Areas are derived from hotel data, never invented as inventory.
CREATE TABLE areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL UNIQUE,
  centre_lat double precision NOT NULL CHECK (centre_lat BETWEEN -90 AND 90),
  centre_lng double precision NOT NULL CHECK (centre_lng BETWEEN -180 AND 180),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  area_id uuid NOT NULL REFERENCES areas (id) ON DELETE RESTRICT,
  address text NOT NULL,
  lat double precision NOT NULL CHECK (lat BETWEEN -90 AND 90),
  lng double precision NOT NULL CHECK (lng BETWEEN -180 AND 180),
  phone_encrypted text,
  nightly_kobo bigint NOT NULL CHECK (nightly_kobo > 0),
  policy_template policy_template NOT NULL,
  house_rules jsonb NOT NULL DEFAULT '[]'::jsonb,
  status hotel_status NOT NULL DEFAULT 'draft',
  demo boolean NOT NULL DEFAULT true,
  commission_bps integer NOT NULL DEFAULT 1000 CHECK (commission_bps BETWEEN 0 AND 10000),
  paystack_subaccount_code text,
  subaccount_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX hotels_paystack_subaccount_code_key
  ON hotels (paystack_subaccount_code)
  WHERE paystack_subaccount_code IS NOT NULL;
CREATE INDEX hotels_area_id_idx ON hotels (area_id);
CREATE INDEX hotels_status_demo_idx ON hotels (status, demo);

COMMENT ON COLUMN hotels.phone_encrypted IS
  'Internal only. Never select into a public API response; reveal only after a confirmed booking.';
COMMENT ON COLUMN hotels.commission_bps IS
  'Fixed 10% default (1000 bps). Per-hotel overrides require an explicit decision.';
COMMENT ON COLUMN hotels.subaccount_verified_at IS
  'Set only after the hotel Paystack subaccount is verified in the dashboard.';

CREATE TABLE rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES hotels (id) ON DELETE CASCADE,
  name text NOT NULL,
  total_inventory integer NOT NULL CHECK (total_inventory > 0),
  sleeps integer NOT NULL CHECK (sleeps > 0),
  bed text NOT NULL,
  ensuite boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (hotel_id, name)
);
CREATE INDEX rooms_hotel_id_idx ON rooms (hotel_id);

CREATE TABLE verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES hotels (id) ON DELETE CASCADE,
  agent_ref text NOT NULL,
  inspected_at timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('Pass', 'Pass with notes', 'Fail')),
  checks_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  report_url text NOT NULL,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX verifications_hotel_inspected_idx ON verifications (hotel_id, inspected_at DESC);

COMMENT ON TABLE verifications IS
  'Internal only. Public pages may show inspected_at, status and check labels, never agent identity or full report.';

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  hotel_id uuid NOT NULL REFERENCES hotels (id) ON DELETE RESTRICT,
  room_id uuid NOT NULL REFERENCES rooms (id) ON DELETE RESTRICT,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests integer NOT NULL CHECK (guests > 0),
  status booking_status NOT NULL DEFAULT 'draft',
  total_kobo bigint CHECK (total_kobo IS NULL OR total_kobo > 0),
  commission_kobo bigint CHECK (commission_kobo IS NULL OR commission_kobo >= 0),
  hotel_share_kobo bigint CHECK (hotel_share_kobo IS NULL OR hotel_share_kobo >= 0),
  policy_template_snapshot policy_template NOT NULL,
  policy_deadline_at timestamptz,
  paystack_reference text UNIQUE,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT bookings_dates_valid CHECK (check_out > check_in),
  CONSTRAINT bookings_split_adds_up CHECK (
    (total_kobo IS NULL AND commission_kobo IS NULL AND hotel_share_kobo IS NULL)
    OR (total_kobo = commission_kobo + hotel_share_kobo)
  )
);
CREATE INDEX bookings_hotel_status_idx ON bookings (hotel_id, status);
CREATE INDEX bookings_room_dates_idx ON bookings (room_id, check_in, check_out);
CREATE INDEX bookings_expires_at_idx ON bookings (expires_at)
  WHERE expires_at IS NOT NULL;

COMMENT ON COLUMN bookings.policy_template_snapshot IS
  'Snapshot of the hotel rule at booking time. Later hotel changes must not rewrite past bookings.';
COMMENT ON COLUMN bookings.policy_deadline_at IS
  'Resolved cancellation deadline for this booking, derived from the snapshot and check-in.';

CREATE TABLE holds (
  booking_id uuid PRIMARY KEY REFERENCES bookings (id) ON DELETE CASCADE,
  room_id uuid NOT NULL REFERENCES rooms (id) ON DELETE CASCADE,
  nights integer NOT NULL CHECK (nights > 0),
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX holds_room_expires_idx ON holds (room_id, expires_at);

COMMENT ON TABLE holds IS
  'Durable mirror of short-lived Redis holds. Availability always re-checks this table.';

CREATE TABLE blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES hotels (id) ON DELETE CASCADE,
  room_id uuid NOT NULL REFERENCES rooms (id) ON DELETE CASCADE,
  dates daterange NOT NULL CHECK (
    NOT isempty(dates) AND lower(dates) IS NOT NULL AND upper(dates) IS NOT NULL
  ),
  reason text NOT NULL,
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX blocks_hotel_idx ON blocks (hotel_id);
CREATE INDEX blocks_room_dates_idx ON blocks (room_id, dates);

CREATE TABLE refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings (id) ON DELETE RESTRICT,
  amount_kobo bigint NOT NULL CHECK (amount_kobo > 0),
  commission_reversed_kobo bigint NOT NULL DEFAULT 0 CHECK (commission_reversed_kobo >= 0),
  hotel_share_kobo bigint NOT NULL DEFAULT 0 CHECK (hotel_share_kobo >= 0),
  paystack_refund_id text UNIQUE,
  status refund_status NOT NULL DEFAULT 'initiated',
  initiated_by text NOT NULL,
  reason text NOT NULL DEFAULT '',
  recovery_status recovery_status NOT NULL DEFAULT 'none',
  recovery_due_at timestamptz,
  recovery_notified_at timestamptz,
  recovered_kobo bigint NOT NULL DEFAULT 0 CHECK (recovered_kobo >= 0),
  fee_lost_kobo bigint NOT NULL DEFAULT 0 CHECK (fee_lost_kobo >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX refunds_booking_idx ON refunds (booking_id);
CREATE INDEX refunds_status_idx ON refunds (status);
CREATE INDEX refunds_recovery_idx ON refunds (recovery_status, recovery_due_at)
  WHERE recovery_status IN ('open', 'recovering');

COMMENT ON COLUMN refunds.recovery_status IS
  'open means the hotel share was already paid out and must be collected contractually.';
COMMENT ON COLUMN refunds.recovered_kobo IS
  'Amount actually collected from the hotel or offset against future settlements.';
COMMENT ON COLUMN refunds.fee_lost_kobo IS
  'Non-refundable Paystack fee absorbed by JosStay. Never promised back to the guest.';

CREATE TABLE audit_logs (
  id bigserial PRIMARY KEY,
  actor text NOT NULL,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id uuid,
  before jsonb,
  after jsonb,
  at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_logs_entity_idx ON audit_logs (entity, entity_id, at DESC);
CREATE INDEX audit_logs_actor_at_idx ON audit_logs (actor, at DESC);

CREATE TRIGGER areas_set_updated_at
  BEFORE UPDATE ON areas FOR EACH ROW EXECUTE FUNCTION josstay_set_updated_at();
CREATE TRIGGER hotels_set_updated_at
  BEFORE UPDATE ON hotels FOR EACH ROW EXECUTE FUNCTION josstay_set_updated_at();
CREATE TRIGGER rooms_set_updated_at
  BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION josstay_set_updated_at();
CREATE TRIGGER verifications_set_updated_at
  BEFORE UPDATE ON verifications FOR EACH ROW EXECUTE FUNCTION josstay_set_updated_at();
CREATE TRIGGER bookings_set_updated_at
  BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION josstay_set_updated_at();
CREATE TRIGGER blocks_set_updated_at
  BEFORE UPDATE ON blocks FOR EACH ROW EXECUTE FUNCTION josstay_set_updated_at();
CREATE TRIGGER refunds_set_updated_at
  BEFORE UPDATE ON refunds FOR EACH ROW EXECUTE FUNCTION josstay_set_updated_at();
