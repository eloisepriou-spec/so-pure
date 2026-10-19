import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOwnBrand } from "./route";

export const Route = createFileRoute("/_authenticated/marque/")({
  component: BrandProfile,
});

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  approved: { label: "Active", cls: "bg-primary/10 text-primary" },
  pending: { label: "En attente", cls: "bg-muted text-muted-foreground" },
  rejected: { label: "Suspendue", cls: "bg-destructive/10 text-destructive" },
};

function BrandProfile() {
  const { user } = Route.useRouteContext();
  const q = useOwnBrand(user.id);
  const qc = useQueryClient();
  const b = q.data;
  const [name, setName] = useState(b?.name ?? "");
  const [region, setRegion] = useState(b?.region ?? "");
  const [description, setDescription] = useState(b?.description ?? "");
  const [edited, setEdited] = useState(false);

  const save = useMutation({
    mutationFn: async () => {
      if (!b) return;
      const { error } = await supabase
        .from("brands")
        .update({ name, region, description })
        .eq("slug", b.slug);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Fiche marque mise à jour");
      setEdited(false);
      qc.invalidateQueries({ queryKey: ["marque"] });
      qc.invalidateQueries({ queryKey: ["catalog"] });
    },
    onError: (e: Error) => toast.error(`Échec : ${e.message}`),
  });

  if (!b) return null;
  const status = STATUS_LABEL[b.status] ?? STATUS_LABEL["pending"]!;

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-6">
        <div>
          <h1 className="font-serif text-3xl">{b.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Commission plateforme : {b.commission_rate} %
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.cls}`}>
          {status.label}
        </span>
      </div>

      <form
        className="space-y-5 rounded-xl border bg-card p-6"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <h2 className="text-lg font-semibold">Votre fiche publique</h2>
        <p className="text-sm text-muted-foreground">
          Ces informations sont visibles par les clients sur votre page marque.
        </p>
        <label className="block">
          <span className="micro-label text-muted-foreground">Nom de la marque</span>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setEdited(true);
            }}
            required
            className="mt-1.5 h-11 w-full rounded border bg-background px-3 text-sm outline-none focus:border-foreground"
          />
        </label>
        <label className="block">
          <span className="micro-label text-muted-foreground">Région</span>
          <input
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setEdited(true);
            }}
            placeholder="ex. Provence, France"
            className="mt-1.5 h-11 w-full rounded border bg-background px-3 text-sm outline-none focus:border-foreground"
          />
        </label>
        <label className="block">
          <span className="micro-label text-muted-foreground">Présentation & engagement</span>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setEdited(true);
            }}
            rows={5}
            placeholder="Bio, 100 % France, sans additif… présentez votre engagement."
            className="mt-1.5 w-full resize-none rounded border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </label>
        <button
          disabled={!edited || save.isPending}
          className="h-11 rounded bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
        >
          {save.isPending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
