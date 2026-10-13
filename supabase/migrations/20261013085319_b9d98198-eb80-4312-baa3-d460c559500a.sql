REVOKE INSERT, UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (first_name, last_name) ON public.profiles TO authenticated;
DROP POLICY IF EXISTS "Own profile insert" ON public.profiles;

CREATE OR REPLACE FUNCTION public.is_admin(_uid uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _uid AND role = 'admin')
$$;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.guard_moderation() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.role() = 'service_role' OR auth.uid() IS NULL OR public.is_admin(auth.uid()) THEN RETURN NEW; END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'pending';
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    RAISE EXCEPTION 'Only admins can change moderation status';
  END IF;
  IF TG_TABLE_NAME = 'products' THEN
    IF TG_OP = 'INSERT' THEN NEW.rejection_reason := NULL;
    ELSIF NEW.rejection_reason IS DISTINCT FROM OLD.rejection_reason THEN RAISE EXCEPTION 'Only admins can set rejection reason'; END IF;
  END IF;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.guard_moderation() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER brands_guard_moderation BEFORE INSERT OR UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.guard_moderation();
CREATE TRIGGER products_guard_moderation BEFORE INSERT OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.guard_moderation();

GRANT SELECT, UPDATE ON public.brands TO authenticated;
GRANT SELECT, UPDATE ON public.products TO authenticated;