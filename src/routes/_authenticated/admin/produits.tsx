import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Empty, approveBtn, rejectBtn, useModerate } from "@/components/site/admin";
import { formatPrice } from "@/lib/catalog";
import { imageFor } from "@/lib/images";

export const Route = createFileRoute("/_authenticated/admin/produits")({
  head: () => ({ meta: [{ title: "Produits en attente — Admin So Pure" }] }),
  component: AdminProducts,
});

type Row = { id: string; name: string; price: number; image_key: string; brand_slug: string; brands: { name: string } | null };

function AdminProducts() {
  const q = useQuery({
    queryKey: ["admin", "products", "pending"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,price,image_key,brand_slug,brands(name)")
        .eq("status", "pending")
        .order("created_at");
      if (error) throw error;
      return data as unknown as Row[];
    },
  });
  if (q.isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;
  if (!q.data?.length) return <Empty>Aucun produit en attente de validation.</Empty>;
  return (
    <ul className="space-y-4">
      {q.data.map((p) => <ProductRow key={p.id} p={p} />)}
    </ul>
  );
}

function ProductRow({ p }: { p: Row }) {
  const m = useModerate("products");
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  return (
    <li className="rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-center gap-4">
        <img src={imageFor(p.image_key)} alt={p.name} className="h-20 w-20 rounded object-cover" />
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">{p.name}</h2>
          <p className="text-sm text-muted-foreground">{p.brands?.name ?? p.brand_slug}</p>
        </div>
        <p className="font-semibold">{formatPrice(Number(p.price))}</p>
        <div className="flex gap-2">
          <button disabled={m.isPending} onClick={() => m.mutate({ key: p.id, status: "approved" })} className={approveBtn}>Valider</button>
          <button disabled={m.isPending} onClick={() => setRejecting((v) => !v)} className={rejectBtn}>Rejeter</button>
        </div>
      </div>
      {rejecting && (
        <form
          className="mt-4 flex flex-col gap-2 border-t pt-4 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            m.mutate({ key: p.id, status: "rejected", reason });
          }}
        >
          <label className="sr-only" htmlFor={`reason-${p.id}`}>Motif du rejet (optionnel)</label>
          <input
            id={`reason-${p.id}`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Motif du rejet (optionnel)"
            className="h-9 flex-1 rounded border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground"
          />
          <button disabled={m.isPending} className={rejectBtn}>Confirmer le rejet</button>
        </form>
      )}
    </li>
  );
}
