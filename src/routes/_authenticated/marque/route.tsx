import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/site/Layout";
import { supabase } from "@/integrations/supabase/client";
import { fetchRole } from "@/lib/auth";
import type { Tables } from "@/integrations/supabase/types";

export type BrandRow = Tables<"brands">;

// UI gate only — the database (RLS) enforces that only the owner can read/write their brand.
export const Route = createFileRoute("/_authenticated/marque")({
  beforeLoad: async ({ context }) => {
    const role = await fetchRole(context.user.id);
    if (role !== "brand") throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { title: "Espace marque — So Pure" },
      { name: "description", content: "Gérez votre fiche marque et vos produits So Pure." },
      { property: "og:title", content: "Espace marque — So Pure" },
      { property: "og:description", content: "Espace marque So Pure." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BrandLayout,
});

const tab =
  "border-b-2 border-transparent pb-2 text-sm text-muted-foreground hover:text-foreground";

function BrandLayout() {
  const { user } = Route.useRouteContext();
  const q = useQuery({
    queryKey: ["marque", "own-brand", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <PageShell>
      <div className="container-page py-10">
        <p className="micro-label text-muted-foreground">Espace marque</p>
        {q.isLoading ? (
          <p className="mt-8 text-sm text-muted-foreground">Chargement…</p>
        ) : !q.data ? (
          <div className="mt-8 rounded-xl border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Aucune marque n'est encore associée à ce compte. Contactez l'équipe So Pure pour
              finaliser votre rattachement.
            </p>
          </div>
        ) : (
          <>
            <nav className="mt-4 flex gap-6 border-b">
              <Link
                to="/marque"
                activeOptions={{ exact: true }}
                className={tab}
                activeProps={{ className: "!border-foreground !text-foreground font-medium" }}
              >
                Ma marque
              </Link>
              <Link
                to="/marque/produits"
                className={tab}
                activeProps={{ className: "!border-foreground !text-foreground font-medium" }}
              >
                Mes produits
              </Link>
              <Link
                to="/marque/ventes"
                className={tab}
                activeProps={{ className: "!border-foreground !text-foreground font-medium" }}
              >
                Mes ventes
              </Link>
            </nav>
            <div className="mt-8">
              <Outlet />
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}

/** Shared loader for child routes: the signed-in user's brand, or null if none is linked yet. */
export function useOwnBrand(userId: string) {
  return useQuery({
    queryKey: ["marque", "own-brand", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("owner_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}
