/*
# Harden is_admin function security

1. Security Changes
- Recreate `public.is_admin()` as `SECURITY INVOKER` (was SECURITY DEFINER).
  The function only reads the caller's own profile row, which RLS already
  grants via the `users_read_own_or_admin_all_select` policy. INVOKER is
  safe and removes the elevated-privilege attack surface.
- Set a fixed `search_path = public` so the function is not vulnerable to
  search-path hijacking.
- REVOKE EXECUTE from `anon` and `public`; GRANT EXECUTE only to `authenticated`.
  Anonymous users have no role to check and must not be able to call this RPC.
2. Important Notes
- The function body is unchanged; only the security attributes and grants change.
- RLS policies referencing `is_admin()` continue to work because authenticated
  users can read their own profile row.
*/

DROP POLICY IF EXISTS "users_read_own_or_admin_all_select" ON profiles;
DROP POLICY IF EXISTS "admin_insert_profiles" ON profiles;
DROP POLICY IF EXISTS "admin_update_profiles" ON profiles;
DROP POLICY IF EXISTS "admin_delete_profiles" ON profiles;

DROP FUNCTION IF EXISTS public.is_admin();

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY INVOKER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'Admin'
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Re-apply profiles RLS policies (unchanged logic)
CREATE POLICY "users_read_own_or_admin_all_select"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "admin_insert_profiles"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "admin_update_profiles"
ON profiles FOR UPDATE
TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admin_delete_profiles"
ON profiles FOR DELETE
TO authenticated
USING (public.is_admin());
