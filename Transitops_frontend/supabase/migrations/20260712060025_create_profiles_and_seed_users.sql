/*
# Create profiles table and seed demo users for role-based auth

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique, not null)
  - `name` (text, not null)
  - `role` (text, not null, default 'Dispatcher')
  - `created_at` (timestamptz, default now())
2. Helper Functions
- `is_admin()` — returns true if the current authenticated user has role 'Admin'
3. Security (RLS)
- Enable RLS on profiles.
- SELECT: users can read their own profile; admins can read all profiles.
- INSERT/UPDATE/DELETE: admins only.
4. Seed Data
- 5 demo auth users created (one per role) with bcrypt-hashed passwords.
- Corresponding profile rows inserted for each user.
- All demo passwords are 'demo1234'.
5. Important Notes
- Email confirmation is bypassed by setting email_confirmed_at.
- pgcrypto extension enabled for bcrypt password hashing via crypt().
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'Dispatcher',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'Admin'
  );
$$;

DROP POLICY IF EXISTS "users_read_own_or_admin_all_select" ON profiles;
CREATE POLICY "users_read_own_or_admin_all_select"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR is_admin());

DROP POLICY IF EXISTS "admin_insert_profiles" ON profiles;
CREATE POLICY "admin_insert_profiles"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_profiles" ON profiles;
CREATE POLICY "admin_update_profiles"
ON profiles FOR UPDATE
TO authenticated
USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_profiles" ON profiles;
CREATE POLICY "admin_delete_profiles"
ON profiles FOR DELETE
TO authenticated
USING (is_admin());

-- Seed demo auth users (one per role). Password for all: demo1234
-- Using fixed UUIDs so re-running is idempotent.

INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role, instance_id)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin@fleetco.com', crypt('demo1234', gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('a0000000-0000-0000-0000-000000000002', 'fleet@fleetco.com', crypt('demo1234', gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('a0000000-0000-0000-0000-000000000003', 'dispatch@fleetco.com', crypt('demo1234', gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('a0000000-0000-0000-0000-000000000004', 'safety@fleetco.com', crypt('demo1234', gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('a0000000-0000-0000-0000-000000000005', 'finance@fleetco.com', crypt('demo1234', gen_salt('bf')), now(), now(), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, email, name, role) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin@fleetco.com', 'Alex Morgan', 'Admin'),
  ('a0000000-0000-0000-0000-000000000002', 'fleet@fleetco.com', 'Sofia Chen', 'Fleet Manager'),
  ('a0000000-0000-0000-0000-000000000003', 'dispatch@fleetco.com', 'James Okafor', 'Dispatcher'),
  ('a0000000-0000-0000-0000-000000000004', 'safety@fleetco.com', 'Priya Nair', 'Safety Officer'),
  ('a0000000-0000-0000-0000-000000000005', 'finance@fleetco.com', 'Liam Murphy', 'Financial Analyst')
ON CONFLICT (id) DO NOTHING;
