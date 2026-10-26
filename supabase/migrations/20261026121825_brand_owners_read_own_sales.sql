-- F3 (PRD) : la marque doit pouvoir consulter ses commandes. Jusqu'ici seules les policies
-- "Own orders read" (le client) et "Admins read all orders" existaient ; une marque n'avait
-- aucun accès à la table orders. On ajoute une policy SELECT, en lecture seule, qui laisse
-- une marque lire les commandes contenant au moins une ligne pour l'un de ses produits
-- (le nom de la marque est stocké tel quel dans chaque ligne de orders.lines en JSONB).
CREATE POLICY "Brand owners read orders with their lines"
ON public.orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.brands b, jsonb_array_elements(lines) AS line
    WHERE b.owner_id = auth.uid()
      AND line ->> 'brand' = b.name
  )
);
