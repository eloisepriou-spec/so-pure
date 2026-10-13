import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type ModerationStatus = "approved" | "rejected";

/** Update moderation status of a brand (by slug) or product (by id). */
export function useModerate(table: "brands" | "products") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: { key: string; status: ModerationStatus; reason?: string }) => {
      const patch: Record<string, unknown> = { status: v.status };
      if (table === "products") patch["rejection_reason"] = v.status === "rejected" ? v.reason?.trim() || null : null;
      const { error } =
        table === "brands"
          ? await supabase.from("brands").update(patch as never).eq("slug", v.key)
          : await supabase.from("products").update(patch as never).eq("id", v.key);
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      toast.success(v.status === "approved" ? "Validé" : "Rejeté");
      qc.invalidateQueries({ queryKey: ["admin"] });
      qc.invalidateQueries({ queryKey: ["catalog"] });
    },
    onError: (e: Error) => toast.error(`Échec : ${e.message}`),
  });
}

export const approveBtn =
  "h-9 rounded bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60";
export const rejectBtn = "h-9 rounded border px-4 text-sm font-medium hover:bg-muted disabled:opacity-60";

export function Empty({ children }: { children: string }) {
  return <p className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">{children}</p>;
}
