import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Empty, approveBtn, rejectBtn, useModerate } from "@/components/site/admin";

export const Route = createFileRoute("/_authenticated/admin/marques")({
  head: () => ({ meta: [{ title: "Marques en attente — Admin So Pure" }] }),
  component: AdminBrands,
});

function AdminBrands() {
  const q = useQuery({
    queryKey: ["admin", "brands", "pending"],
    queryFn: async () => {
      const { data, error } = await supabase.from("brands").select("slug,name,region,description").eq("status", "pending").order("created_at");
      if (error) throw error;
      return data;
    },
  });
  const m = useModerate("brands");
  if (q.isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;
  if (!q.data?.length) return <Empty>Aucune marque en attente de validation.</Empty>;
  return (
    <ul className="space-y-4">
      {q.data.map((b) => (
        <li key={b.slug} className="flex flex-col gap-4 rounded-xl border bg-card p-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold">{b.name}</h2>
            <p className="micro-label mt-1 text-muted-foreground">{b.region || "Région non renseignée"}</p>
            <p className="mt-3 text-sm">{b.description || "—"}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button disabled={m.isPending} onClick={() => m.mutate({ key: b.slug, status: "approved" })} className={approveBtn}>Valider</button>
            <button disabled={m.isPending} onClick={() => m.mutate({ key: b.slug, status: "rejected" })} className={rejectBtn}>Rejeter</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
