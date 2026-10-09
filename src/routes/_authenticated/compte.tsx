import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageShell } from "@/components/site/Layout";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/_authenticated/compte")({
  head: () => ({
    meta: [
      { title: "Mon compte — So Pure" },
      { name: "description", content: "Vos informations et l'historique de vos commandes So Pure." },
      { property: "og:title", content: "Mon compte — So Pure" },
      { property: "og:description", content: "Espace client So Pure." },
    ],
  }),
  component: AccountPage,
});

type Line = { name: string; brand: string; qty: number; months: number; price: number };

function AccountPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const profile = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => (await supabase.from("profiles").select("first_name,last_name").eq("id", user.id).maybeSingle()).data,
  });
  const orders = useQuery({
    queryKey: ["orders", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function signOut() {
    await qc.cancelQueries({ queryKey: ["orders"] });
    qc.removeQueries({ queryKey: ["orders"] });
    qc.removeQueries({ queryKey: ["profile"] });
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  const name = [profile.data?.first_name, profile.data?.last_name].filter(Boolean).join(" ");

  return (
    <PageShell>
      <div className="container-page py-12">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
          <div>
            <p className="micro-label text-muted-foreground">Mon compte</p>
            <h1 className="mt-2 font-serif text-4xl">Bonjour{name ? `, ${profile.data?.first_name}` : ""}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{name && `${name} · `}{user.email}</p>
          </div>
          <button onClick={signOut} className="h-10 rounded border px-4 text-sm font-medium hover:bg-muted">Se déconnecter</button>
        </div>

        <h2 className="mt-10 text-lg font-semibold">Historique des commandes</h2>
        {orders.isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Chargement…</p>
        ) : !orders.data?.length ? (
          <div className="mt-4 rounded-xl border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">Vous n'avez pas encore passé de commande.</p>
            <Link to="/" className="mt-4 inline-block text-sm font-medium underline underline-offset-2">Découvrir la sélection</Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {orders.data.map((o) => (
              <li key={o.id} className="rounded-xl border bg-card p-6">
                <div className="flex flex-wrap justify-between gap-2 border-b pb-3">
                  <div>
                    <p className="font-semibold">{o.ref}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} · {o.method}
                    </p>
                  </div>
                  <p className="font-semibold">{formatPrice(Number(o.total))}</p>
                </div>
                <ul className="mt-3 space-y-1 text-sm">
                  {(o.lines as Line[]).map((l, i) => (
                    <li key={i} className="flex justify-between gap-4">
                      <span>{l.qty} × {l.name} <span className="text-muted-foreground">— {l.brand}{l.months === 3 ? " · cure 3 mois" : ""}</span></span>
                      <span>{formatPrice(l.price * l.qty)}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}
