-- Le durcissement précédent avait retiré EXECUTE sur is_admin() au rôle anon.
-- Or plusieurs policies RLS (products, brands, orders, product_scan_log) font
-- un EXISTS sur profiles pour vérifier le rôle admin, et l'évaluation de la
-- policy "Admins read all profiles" (qui appelle is_admin(auth.uid())) est
-- déclenchée au passage, même pour un visiteur anonyme. Sans EXECUTE sur anon,
-- toute lecture publique (ex: catalogue produits) échouait avec
-- "permission denied for function is_admin".
-- is_admin() ne renvoie qu'un booléen et ne révèle aucune donnée sensible :
-- l'exposer en lecture à anon est nécessaire au bon fonctionnement des RLS
-- publiques et ne constitue pas une régression de sécurité.
grant execute on function public.is_admin() to anon;
grant execute on function public.is_admin(uuid) to anon;
