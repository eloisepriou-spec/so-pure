import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

async function countPending(table: "brands" | "products") {
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true }).eq("status", "pending");
  return count ?? 0;
}

function AdminHome() {
  const brands = useQuery({ queryKey: ["admin", "pending-count", "brands"], queryFn: () => countPending("brands") });
  const products = useQuery({ queryKey: ["admin", "pending-count", "products"], queryFn: () => countPending("products") });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[
        { to: "/admin/marques" as const, label: "Marques en attente", n: brands.data },
        { to: "/admin/produits" as const, label: "Produits en attente", n: products.data },
      ].map((c) => (
        <Link key={c.to} to={c.to} className="rounded-xl border bg-card p-6 hover:border-foreground">
          <p className="micro-label text-muted-foreground">{c.label}</p>
          <p className="mt-2 font-serif text-4xl">{c.n ?? "–"}</p>
        </Link>
      ))}
    </div>
  );
}
