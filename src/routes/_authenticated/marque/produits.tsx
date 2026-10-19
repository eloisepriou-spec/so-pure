import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/catalog";
import { imageFor } from "@/lib/images";
import { useOwnBrand } from "./route";

export const Route = createFileRoute("/_authenticated/marque/produits")({
  component: BrandProducts,
});

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  approved: { label: "Publié", cls: "bg-primary/10 text-primary" },
  pending: { label: "En analyse", cls: "bg-muted text-muted-foreground" },
  rejected: { label: "Rejeté", cls: "bg-destructive/10 text-destructive" },
};

function BrandProducts() {
  const { user } = Route.useRouteContext();
  const brand = useOwnBrand(user.id);
  const q = useQuery({
    queryKey: ["marque", "produits", brand.data?.slug],
    enabled: !!brand.data,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,price,image_key,status,rejection_reason,created_at")
        .eq("brand_slug", brand.data!.slug)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">Mes produits</h1>
        <Link
          to="/marque/produits/nouveau"
          className="h-10 rounded bg-primary px-5 text-sm font-semibold leading-10 text-primary-foreground hover:bg-primary-hover"
        >
          + Soumettre un produit
        </Link>
      </div>

      {q.isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Chargement…</p>
      ) : !q.data?.length ? (
        <div className="mt-8 rounded-xl border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">Vous n'avez pas encore soumis de produit.</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {q.data.map((p) => {
            const status = STATUS_LABEL[p.status] ?? STATUS_LABEL["pending"]!;
            return (
              <li key={p.id} className="rounded-xl border bg-card p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <img
                    src={imageFor(p.image_key)}
                    alt={p.name}
                    className="h-16 w-16 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold">{p.name}</h2>
                    <p className="text-sm text-muted-foreground">{formatPrice(Number(p.price))}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.cls}`}>
                    {status.label}
                  </span>
                  <Link
                    to="/marque/produits/$id"
                    params={{ id: p.id }}
                    className="h-9 rounded border px-4 text-sm font-medium leading-9 hover:bg-muted"
                  >
                    Modifier
                  </Link>
                </div>
                {p.status === "rejected" && p.rejection_reason && (
                  <p className="mt-3 rounded border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                    <strong>Motif du rejet :</strong> {p.rejection_reason}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
