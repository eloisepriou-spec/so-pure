import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

/** Écoute les changements live sur orders/products/brands et invalide le cache du dashboard. */
function useDashboardRealtime() {
  const qc = useQueryClient();
  const [live, setLive] = useState(false);

  useEffect(() => {
    const invalidate = () => qc.invalidateQueries({ queryKey: ["admin"] });
    const channel = supabase
      .channel("admin-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, invalidate)
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, invalidate)
      .on("postgres_changes", { event: "*", schema: "public", table: "brands" }, invalidate)
      .subscribe((status) => setLive(status === "SUBSCRIBED"));

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [qc]);

  return live;
}

async function countWhere(table: "brands" | "products", column: string, value: string) {
  const { count } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq(column, value);
  return count ?? 0;
}

async function revenueTotals() {
  const { data, error } = await supabase.from("orders").select("total");
  if (error) throw error;
  const orders = data.length;
  const revenue = data.reduce((sum, o) => sum + Number(o.total), 0);
  return { orders, revenue };
}

function AdminHome() {
  const live = useDashboardRealtime();
  const activeBrands = useQuery({
    queryKey: ["admin", "count", "brands", "approved"],
    queryFn: () => countWhere("brands", "status", "approved"),
  });
  const published = useQuery({
    queryKey: ["admin", "count", "products", "approved"],
    queryFn: () => countWhere("products", "status", "approved"),
  });
  const analysing = useQuery({
    queryKey: ["admin", "count", "products", "pending"],
    queryFn: () => countWhere("products", "status", "pending"),
  });
  const orders = useQuery({ queryKey: ["admin", "orders", "totals"], queryFn: revenueTotals });

  const cards: {
    to: "/admin/marques" | "/admin/journal" | "/admin/commandes";
    label: string;
    n: string;
  }[] = [
    { to: "/admin/marques", label: "Marques actives", n: activeBrands.data?.toString() ?? "–" },
    { to: "/admin/journal", label: "Produits publiés", n: published.data?.toString() ?? "–" },
    { to: "/admin/journal", label: "Produits en analyse", n: analysing.data?.toString() ?? "–" },
    { to: "/admin/commandes", label: "Commandes", n: orders.data?.orders.toString() ?? "–" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span
          className={`h-2 w-2 rounded-full ${live ? "bg-emerald-500" : "bg-muted-foreground/40"}`}
        />
        {live ? "Données en direct" : "Connexion en direct…"}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <Link
            key={`${c.to}-${i}`}
            to={c.to}
            className="rounded-xl border bg-card p-6 hover:border-foreground"
          >
            <p className="micro-label text-muted-foreground">{c.label}</p>
            <p className="mt-2 font-serif text-4xl">{c.n}</p>
          </Link>
        ))}
      </div>
      <div className="rounded-xl border bg-card p-6">
        <p className="micro-label text-muted-foreground">
          Chiffre d'affaires total (commandes payées)
        </p>
        <p className="mt-2 font-serif text-4xl">
          {orders.data ? formatPrice(orders.data.revenue) : "–"}
        </p>
      </div>
    </div>
  );
}
