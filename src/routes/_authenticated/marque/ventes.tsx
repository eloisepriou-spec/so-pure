import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/catalog";
import { useOwnBrand } from "./route";

export const Route = createFileRoute("/_authenticated/marque/ventes")({
  head: () => ({ meta: [{ title: "Mes ventes — Espace marque So Pure" }] }),
  component: BrandSales,
});

type OrderLine = { id: string; name: string; brand: string; qty: number; months: number; price: number };
type OrderRow = {
  id: string;
  ref: string;
  shipping: number;
  total: number;
  created_at: string;
  lines: OrderLine[];
};

function BrandSales() {
  const { user } = Route.useRouteContext();
  const brand = useOwnBrand(user.id);

  const q = useQuery({
    queryKey: ["marque", "ventes", brand.data?.name],
    enabled: !!brand.data,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id,ref,shipping,total,created_at,lines")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const rows = (data as unknown as OrderRow[])
        .map((o) => {
          const mine = o.lines.filter((l) => l.brand === brand.data!.name);
          if (!mine.length) return null;
          const amount = mine.reduce((sum, l) => sum + l.price * l.qty, 0);
          return {
            id: o.id,
            ref: o.ref,
            created_at: o.created_at,
            items: mine,
            amount,
          };
        })
        .filter((r): r is NonNullable<typeof r> => r !== null);

      const totals = rows.reduce((sum, r) => sum + r.amount, 0);

      return { rows, totals };
    },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl">Mes ventes</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Récapitulatif des commandes contenant vos produits.
      </p>

      {q.isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Chargement…</p>
      ) : !q.data?.rows.length ? (
        <div className="mt-8 rounded-xl border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">Aucune vente pour le moment.</p>
        </div>
      ) : (
        <>
          <div className="mt-8 rounded-xl border bg-card p-6">
            <p className="micro-label text-muted-foreground">Total vendu</p>
            <p className="mt-2 font-serif text-3xl">{formatPrice(q.data.totals)}</p>
          </div>

          <ul className="mt-6 space-y-4">
            {q.data.rows.map((r) => (
              <li key={r.id} className="rounded-xl border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">Commande {r.ref}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="font-semibold">{formatPrice(r.amount)}</p>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {r.items.map((l, i) => (
                    <li key={i} className="flex justify-between gap-4">
                      <span>
                        {l.qty} × {l.name}
                        {l.months === 3 ? " · cure 3 mois" : ""}
                      </span>
                      <span>{formatPrice(l.price * l.qty)}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
