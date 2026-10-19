import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Empty } from "@/components/site/admin";
import type { TablesUpdate } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/admin/marques")({
  head: () => ({ meta: [{ title: "Marques — Admin So Pure" }] }),
  component: AdminBrands,
});

type BrandRow = {
  slug: string;
  name: string;
  region: string;
  status: string;
  commission_rate: number;
  owner_id: string | null;
  stripe_account_id: string | null;
};

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  approved: { label: "Active", cls: "bg-primary/10 text-primary" },
  pending: { label: "En attente", cls: "bg-muted text-muted-foreground" },
  rejected: { label: "Suspendue", cls: "bg-destructive/10 text-destructive" },
};

function AdminBrands() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "brands", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("slug,name,region,status,commission_rate,owner_id,stripe_account_id")
        .order("name");
      if (error) throw error;
      return data as BrandRow[];
    },
  });

  const update = useMutation({
    mutationFn: async (v: { slug: string; patch: TablesUpdate<"brands"> }) => {
      const { error } = await supabase.from("brands").update(v.patch).eq("slug", v.slug);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Marque mise à jour");
      qc.invalidateQueries({ queryKey: ["admin"] });
      qc.invalidateQueries({ queryKey: ["catalog"] });
    },
    onError: (e: Error) => toast.error(`Échec : ${e.message}`),
  });

  if (q.isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;
  if (!q.data?.length) return <Empty>Aucune marque enregistrée.</Empty>;

  return (
    <ul className="space-y-4">
      {q.data.map((b) => (
        <BrandRow
          key={b.slug}
          b={b}
          onSave={(patch) => update.mutate({ slug: b.slug, patch })}
          saving={update.isPending}
        />
      ))}
    </ul>
  );
}

function BrandRow({
  b,
  onSave,
  saving,
}: {
  b: BrandRow;
  onSave: (patch: TablesUpdate<"brands">) => void;
  saving: boolean;
}) {
  const [rate, setRate] = useState(String(b.commission_rate));
  const status = STATUS_LABEL[b.status] ?? STATUS_LABEL["pending"]!;
  const suspended = b.status === "rejected";
  const rateChanged = rate !== String(b.commission_rate);

  return (
    <li className="flex flex-col gap-4 rounded-xl border bg-card p-6 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold">{b.name}</h2>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.cls}`}>
            {status.label}
          </span>
        </div>
        <p className="micro-label mt-1 text-muted-foreground">
          {b.region || "Région non renseignée"}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Compte marque {b.owner_id ? "lié" : "non lié"} · Stripe Connect{" "}
          {b.stripe_account_id ? "connecté" : "non connecté (limite connue V1)"}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          Commission
          <input
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="h-9 w-20 rounded border bg-background px-2 text-sm outline-none focus:border-foreground"
          />
          %
        </label>
        {rateChanged && (
          <button
            disabled={saving}
            onClick={() => onSave({ commission_rate: Number(rate) })}
            className="h-9 rounded bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
          >
            Enregistrer
          </button>
        )}
        <button
          disabled={saving}
          onClick={() => onSave({ status: suspended ? "approved" : "rejected" })}
          className="h-9 rounded border px-4 text-sm font-medium hover:bg-muted disabled:opacity-60"
        >
          {suspended ? "Réactiver" : "Suspendre"}
        </button>
      </div>
    </li>
  );
}
