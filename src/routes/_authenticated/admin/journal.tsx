import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Empty } from "@/components/site/admin";

export const Route = createFileRoute("/_authenticated/admin/journal")({
  head: () => ({ meta: [{ title: "Journal scanner IA — Admin So Pure" }] }),
  component: ScanLog,
});

type LogRow = {
  id: string;
  decision: string;
  reasons: string;
  scanner_version: string;
  created_at: string;
  cancelled_by_admin: boolean;
  cancelled_at: string | null;
  product_id: string;
  products: { name: string; brand_slug: string; status: string } | null;
};

const DECISION_LABEL: Record<string, { label: string; cls: string }> = {
  approved: { label: "Approuvé", cls: "bg-primary/10 text-primary" },
  rejected: { label: "Rejeté", cls: "bg-destructive/10 text-destructive" },
};

function ScanLog() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "scan-log"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_scan_log")
        .select(
          "id,decision,reasons,scanner_version,created_at,cancelled_by_admin,cancelled_at,product_id,products(name,brand_slug,status)",
        )
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as unknown as LogRow[];
    },
  });

  const cancel = useMutation({
    mutationFn: async (row: LogRow) => {
      const newStatus = row.decision === "approved" ? "rejected" : "approved";
      const { error: pErr } = await supabase
        .from("products")
        .update({
          status: newStatus,
          rejection_reason: newStatus === "rejected" ? "Décision annulée par l'admin" : null,
        })
        .eq("id", row.product_id);
      if (pErr) throw pErr;
      const { error: lErr } = await supabase
        .from("product_scan_log")
        .update({ cancelled_by_admin: true, cancelled_at: new Date().toISOString() })
        .eq("id", row.id);
      if (lErr) throw lErr;
    },
    onSuccess: () => {
      toast.success("Décision annulée");
      qc.invalidateQueries({ queryKey: ["admin"] });
      qc.invalidateQueries({ queryKey: ["catalog"] });
      qc.invalidateQueries({ queryKey: ["marque"] });
    },
    onError: (e: Error) => toast.error(`Échec : ${e.message}`),
  });

  if (q.isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;
  if (!q.data?.length) return <Empty>Aucune décision du scanner IA pour le moment.</Empty>;

  return (
    <ul className="space-y-4">
      {q.data.map((row) => {
        const decision = DECISION_LABEL[row.decision] ?? DECISION_LABEL["rejected"]!;
        return (
          <li key={row.id} className="rounded-xl border bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-semibold">{row.products?.name ?? "Produit supprimé"}</h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${decision.cls}`}>
                    {decision.label}
                  </span>
                  {row.cancelled_by_admin && (
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                      Décision annulée par l'admin
                    </span>
                  )}
                </div>
                <p className="micro-label mt-1 text-muted-foreground">
                  {row.products?.brand_slug} · analysé le{" "}
                  {new Date(row.created_at).toLocaleString("fr-FR")} · scanner v
                  {row.scanner_version}
                </p>
                <p className="mt-3 text-sm">{row.reasons || "—"}</p>
              </div>
              {!row.cancelled_by_admin && (
                <button
                  disabled={cancel.isPending}
                  onClick={() => cancel.mutate(row)}
                  className="h-9 shrink-0 rounded border px-4 text-sm font-medium hover:bg-muted disabled:opacity-60"
                >
                  Annuler la décision
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
