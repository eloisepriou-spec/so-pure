-- guard_moderation bloquait TOUT changement de statut par un non-admin, y compris
-- le cas légitime du PRD (F3) : une marque qui modifie la description ou la
-- composition d'un produit déjà approuvé/rejeté doit repasser automatiquement
-- en "pending" pour une nouvelle analyse du scanner IA. RLS restreint déjà cette
-- opération au propriétaire du produit (table products) ; on autorise donc
-- spécifiquement cette transition -> 'pending' (jamais vers 'approved'/'rejected')
-- et l'effacement du motif de rejet qui l'accompagne, uniquement sur products.
-- Le comportement sur brands (pas de resoumission côté marque, création
-- pré-approuvée par l'équipe commerciale) reste strictement inchangé : aucun
-- changement de statut par un non-admin.
CREATE OR REPLACE FUNCTION public.guard_moderation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.role() = 'service_role' OR auth.uid() IS NULL OR public.is_admin() THEN RETURN NEW; END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.status := 'pending';
    IF TG_TABLE_NAME = 'products' THEN NEW.rejection_reason := NULL; END IF;
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF TG_TABLE_NAME = 'products' AND NEW.status = 'pending' THEN
      -- Owner resubmission after an edit: allowed, enforced by RLS ownership.
      NULL;
    ELSE
      RAISE EXCEPTION 'Only admins can change moderation status';
    END IF;
  END IF;

  IF TG_TABLE_NAME = 'products' AND NEW.rejection_reason IS DISTINCT FROM OLD.rejection_reason THEN
    IF NOT (NEW.status = 'pending' AND NEW.rejection_reason IS NULL) THEN
      RAISE EXCEPTION 'Only admins can set rejection reason';
    END IF;
  END IF;

  RETURN NEW;
END; $function$;
