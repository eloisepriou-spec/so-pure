import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandProductForm } from "@/components/site/BrandProductForm";
import { useOwnBrand } from "./route";

export const Route = createFileRoute("/_authenticated/marque/produits/nouveau")({
  head: () => ({ meta: [{ title: "Soumettre un produit — Espace marque So Pure" }] }),
  component: NewProduct,
});

function NewProduct() {
  const { user } = Route.useRouteContext();
  const brand = useOwnBrand(user.id);
  if (!brand.data) return null;
  return (
    <div>
      <Link to="/marque/produits" className="text-sm text-muted-foreground hover:text-foreground">
        ← Mes produits
      </Link>
      <h1 className="mt-4 font-serif text-3xl">Soumettre un nouveau produit</h1>
      <div className="mt-8">
        <BrandProductForm brandSlug={brand.data.slug} />
      </div>
    </div>
  );
}
