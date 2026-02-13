-- ============================================================
-- DialMyCoffee - Full Database Schema
-- ============================================================
-- Run this file to create all tables, indexes, and RLS policies.
-- Requires Supabase (PostgreSQL with auth.users).
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. PROFILES (existing table - kept for compatibility)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  display_name text,
  is_pro boolean DEFAULT false,
  free_uses_limit integer DEFAULT 2,
  free_uses_count integer DEFAULT 0,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 2. COUNTRIES
-- ============================================================
CREATE TABLE IF NOT EXISTS countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  iso2 varchar(2) NOT NULL UNIQUE,
  iso3 varchar(3) NOT NULL UNIQUE,
  name text NOT NULL,
  region text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_countries_iso2 ON countries(iso2);
CREATE INDEX IF NOT EXISTS idx_countries_region ON countries(region);

-- ============================================================
-- 3. ROASTERIES
-- ============================================================
CREATE TABLE IF NOT EXISTS roasteries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country_id uuid REFERENCES countries(id),
  city text,
  website text,
  instagram text,
  is_popular boolean DEFAULT false,
  aliases text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_roasteries_country_id ON roasteries(country_id);
CREATE INDEX IF NOT EXISTS idx_roasteries_name ON roasteries(name);
CREATE INDEX IF NOT EXISTS idx_roasteries_is_popular ON roasteries(is_popular) WHERE is_popular = true;

-- ============================================================
-- 4. ESPRESSO MACHINES (replaces/extends old machines table)
-- ============================================================
CREATE TABLE IF NOT EXISTS espresso_machines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  name text GENERATED ALWAYS AS (brand || ' ' || model) STORED,
  type text NOT NULL DEFAULT 'semi_auto'
    CHECK (type IN ('semi_auto','auto','manual_lever','bean_to_cup','super_auto','capsule')),
  has_builtin_grinder boolean DEFAULT false,
  supports_temp_control boolean DEFAULT false,
  supports_pressure_control boolean DEFAULT false,
  supports_preinfusion boolean DEFAULT false,
  recommended_basket_sizes text[],
  default_dose_min numeric(4,1) DEFAULT 14,
  default_dose_max numeric(4,1) DEFAULT 20,
  default_ratio_min numeric(3,1) DEFAULT 1.5,
  default_ratio_max numeric(3,1) DEFAULT 2.5,
  grind_min integer,
  grind_max integer,
  espresso_min integer,
  espresso_max integer,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_espresso_machines_brand ON espresso_machines(brand);
CREATE INDEX IF NOT EXISTS idx_espresso_machines_type ON espresso_machines(type);

-- ============================================================
-- 5. GRINDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS grinders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  adjustment_type text NOT NULL DEFAULT 'stepped'
    CHECK (adjustment_type IN ('stepped','stepless','digital')),
  scale_min numeric DEFAULT 0,
  scale_max numeric DEFAULT 40,
  units text DEFAULT 'steps',
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_grinders_brand ON grinders(brand);

-- ============================================================
-- 6. BEANS (existing table - kept for compatibility)
-- ============================================================
CREATE TABLE IF NOT EXISTS beans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  roaster text,
  roast_level text DEFAULT 'medium',
  origin text,
  process text,
  flavour_notes text[],
  roasted_on date,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_beans_user_id ON beans(user_id);

-- ============================================================
-- 7. GRIND RECOMMENDATIONS (existing table - kept for compatibility)
-- ============================================================
CREATE TABLE IF NOT EXISTS grind_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  machine_id uuid,
  bean_id uuid,
  recommended_grind integer,
  ai_reasoning text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_grind_recommendations_user_id ON grind_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_grind_recommendations_machine_id ON grind_recommendations(machine_id);

-- ============================================================
-- 8. DIAL-INS
-- ============================================================
CREATE TABLE IF NOT EXISTS dial_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  machine_id uuid REFERENCES espresso_machines(id),
  grinder_id uuid REFERENCES grinders(id),
  roastery_id uuid REFERENCES roasteries(id),
  bean_name text NOT NULL,
  roast_level text NOT NULL DEFAULT 'medium',
  roasted_on date,
  days_off_roast_at_save integer,
  basket_type text,
  dose_g numeric(4,1) NOT NULL,
  yield_g numeric(4,1) NOT NULL,
  time_s integer NOT NULL,
  grind_setting text NOT NULL,
  temp_c numeric(4,1),
  notes text,
  is_successful boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dial_ins_user_id ON dial_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_dial_ins_machine_id ON dial_ins(machine_id);
CREATE INDEX IF NOT EXISTS idx_dial_ins_grinder_id ON dial_ins(grinder_id);
CREATE INDEX IF NOT EXISTS idx_dial_ins_roastery_id ON dial_ins(roastery_id);
CREATE INDEX IF NOT EXISTS idx_dial_ins_created_at ON dial_ins(created_at DESC);

-- ============================================================
-- 9. CALIBRATION HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS calibration_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_id uuid REFERENCES grind_recommendations(id),
  machine_id uuid REFERENCES espresso_machines(id),
  iteration integer NOT NULL DEFAULT 1,
  shot_time_s numeric(5,1),
  actual_yield_g numeric(5,1),
  taste text[] NOT NULL DEFAULT '{}',
  visual_issues text[] NOT NULL DEFAULT '{}',
  changes_made jsonb,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_calibration_history_user_id ON calibration_history(user_id);
CREATE INDEX IF NOT EXISTS idx_calibration_history_recommendation_id ON calibration_history(recommendation_id);
CREATE INDEX IF NOT EXISTS idx_calibration_history_machine_id ON calibration_history(machine_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE roasteries ENABLE ROW LEVEL SECURITY;
ALTER TABLE espresso_machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE grinders ENABLE ROW LEVEL SECURITY;
ALTER TABLE beans ENABLE ROW LEVEL SECURITY;
ALTER TABLE grind_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dial_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE calibration_history ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------
-- PROFILES: users can read/update their own profile
-- ----------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_select_own' AND tablename = 'profiles') THEN
    CREATE POLICY profiles_select_own ON profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_update_own' AND tablename = 'profiles') THEN
    CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_insert_own' AND tablename = 'profiles') THEN
    CREATE POLICY profiles_insert_own ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- ----------------------------------------------------------
-- COUNTRIES: everyone can read (public reference data)
-- ----------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'countries_select_all' AND tablename = 'countries') THEN
    CREATE POLICY countries_select_all ON countries FOR SELECT USING (true);
  END IF;
END $$;

-- ----------------------------------------------------------
-- ROASTERIES: everyone can read (public reference data)
-- ----------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'roasteries_select_all' AND tablename = 'roasteries') THEN
    CREATE POLICY roasteries_select_all ON roasteries FOR SELECT USING (true);
  END IF;
END $$;

-- ----------------------------------------------------------
-- ESPRESSO MACHINES: everyone can read (public reference data)
-- ----------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'espresso_machines_select_all' AND tablename = 'espresso_machines') THEN
    CREATE POLICY espresso_machines_select_all ON espresso_machines FOR SELECT USING (true);
  END IF;
END $$;

-- ----------------------------------------------------------
-- GRINDERS: everyone can read (public reference data)
-- ----------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'grinders_select_all' AND tablename = 'grinders') THEN
    CREATE POLICY grinders_select_all ON grinders FOR SELECT USING (true);
  END IF;
END $$;

-- ----------------------------------------------------------
-- BEANS: users can only access their own
-- ----------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'beans_select_own' AND tablename = 'beans') THEN
    CREATE POLICY beans_select_own ON beans FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'beans_insert_own' AND tablename = 'beans') THEN
    CREATE POLICY beans_insert_own ON beans FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'beans_update_own' AND tablename = 'beans') THEN
    CREATE POLICY beans_update_own ON beans FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'beans_delete_own' AND tablename = 'beans') THEN
    CREATE POLICY beans_delete_own ON beans FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- ----------------------------------------------------------
-- GRIND RECOMMENDATIONS: users can only access their own
-- ----------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'grind_recommendations_select_own' AND tablename = 'grind_recommendations') THEN
    CREATE POLICY grind_recommendations_select_own ON grind_recommendations FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'grind_recommendations_insert_own' AND tablename = 'grind_recommendations') THEN
    CREATE POLICY grind_recommendations_insert_own ON grind_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- ----------------------------------------------------------
-- DIAL-INS: users can only see/insert/update/delete their own
-- ----------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'dial_ins_select_own' AND tablename = 'dial_ins') THEN
    CREATE POLICY dial_ins_select_own ON dial_ins FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'dial_ins_insert_own' AND tablename = 'dial_ins') THEN
    CREATE POLICY dial_ins_insert_own ON dial_ins FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'dial_ins_update_own' AND tablename = 'dial_ins') THEN
    CREATE POLICY dial_ins_update_own ON dial_ins FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'dial_ins_delete_own' AND tablename = 'dial_ins') THEN
    CREATE POLICY dial_ins_delete_own ON dial_ins FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- ----------------------------------------------------------
-- CALIBRATION HISTORY: users can only see/insert their own
-- ----------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'calibration_history_select_own' AND tablename = 'calibration_history') THEN
    CREATE POLICY calibration_history_select_own ON calibration_history FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'calibration_history_insert_own' AND tablename = 'calibration_history') THEN
    CREATE POLICY calibration_history_insert_own ON calibration_history FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- ============================================================
-- Done. Run seed files next:
--   1. seed-countries.sql
--   2. seed-roasteries.sql
--   3. seed-machines.sql
--   4. seed-grinders.sql
-- ============================================================
