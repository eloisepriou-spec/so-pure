import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BrandProductForm } from "@/components/site/BrandProductForm";
import { useOwnBrand } from "./route";

export const Route = createFileRoute("/_authenticated/marque/produits/$id")({
  head: () => ({ meta: [{ title: "Modifier un produit — Espace marque So Pure" }] }),
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  const { user } = Route.useRouteContext();
  const brand = useOwnBrand(user.id);
  const q = useQuery({
    queryKey: ["marque", "produit", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (!brand.data || q.isLoading) return null;
  if (!q.data) return <p className="text-sm text-muted-foreground">Produit introuvable.</p>;

  return (
    <div>
      <Link to="/marque/produits" className="text-sm text-muted-foreground hover:text-foreground">
        ← Mes produits
      </Link>
      <h1 className="mt-4 font-serif text-3xl">{q.data.name}</h1>
      <div className="mt-8">
        <BrandProductForm brandSlug={brand.data.slug} product={q.data} />
      </div>
    </div>
  );
}
