import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/utils";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

const CATEGORIES: { slug: string; name: string }[] = [
  { slug: "sommeil", name: "Sommeil" },
  { slug: "digestion", name: "Digestion" },
  { slug: "energie", name: "Énergie" },
  { slug: "sante-feminine", name: "Santé Féminine" },
  { slug: "longevite", name: "Longévité" },
];

const FORMS = ["Gélules végétales", "Poudres", "Extraits liquides"] as const;

const fieldCls =
  "mt-1.5 h-11 w-full rounded border bg-background px-3 text-sm outline-none focus:border-foreground";
const taCls =
  "mt-1.5 w-full resize-none rounded border bg-background px-3 py-2 text-sm outline-none focus:border-foreground";

export type BrandProduct = Tables<"products">;

/**
 * Shared submission form for a brand's product: creation (product is undefined) or edit
 * (product is passed). Any new submission starts at status "pending" so the scanner picks it
 * up; editing composition or description on an approved product resets it to "pending" too,
 * per the PRD rule that a changed product is re-scanned before going live again.
 */
export function BrandProductForm({
  brandSlug,
  product,
}: {
  brandSlug: string;
  product?: BrandProduct;
}) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEdit = !!product;
  const [name, setName] = useState(product?.name ?? "");
  const [categorySlug, setCategorySlug] = useState(product?.category_slug ?? CATEGORIES[0]!.slug);
  const [form, setForm] = useState(product?.form ?? FORMS[0]);
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [tagline, setTagline] = useState(product?.tagline ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [composition, setComposition] = useState(product?.composition ?? "");
  const [dosage, setDosage] = useState(product?.dosage ?? "");
  const [error, setError] = useState<string | null>(null);

  const submit = useMutation({
    mutationFn: async () => {
      const priceNum = Number(price.replace(",", "."));
      if (!priceNum || priceNum <= 0) throw new Error("Prix invalide.");

      if (isEdit) {
        const contentChanged =
          description !== product!.description || composition !== product!.composition;
        const patch: TablesUpdate<"products"> = {
          name,
          category_slug: categorySlug,
          form,
          price: priceNum,
          tagline,
          description,
          composition,
          dosage,
        };
        // A change to the product sheet goes back through the scanner (PRD F3 rule): a rejected
        // product being corrected, or an approved product being edited, is re-queued for review.
        if (contentChanged && product!.status !== "pending") {
          patch["status"] = "pending";
          patch["rejection_reason"] = null;
        }
        const { error } = await supabase.from("products").update(patch).eq("id", product!.id);
        if (error) throw error;
        return product!.id;
      }

      const id = slugify(name);
      const row: TablesInsert<"products"> = {
        id,
        brand_slug: brandSlug,
        category_slug: categorySlug,
        form,
        name,
        price: priceNum,
        image_key: "placeholder",
        tagline,
        description,
        composition,
        dosage,
        status: "pending",
      };
      const { error } = await supabase.from("products").insert(row);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast.success(
        isEdit
          ? "Produit mis à jour, renvoyé au scanner si modifié"
          : "Produit soumis au scanner IA",
      );
      qc.invalidateQueries({ queryKey: ["marque", "produits"] });
      qc.invalidateQueries({ queryKey: ["admin"] });
      qc.invalidateQueries({ queryKey: ["catalog"] });
      navigate({ to: "/marque/produits" });
    },
    onError: (e: Error) => setError(e.message),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    submit.mutate();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5 rounded-xl border bg-card p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="micro-label text-muted-foreground">Nom du produit</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={fieldCls}
          />
        </label>
        <label className="block">
          <span className="micro-label text-muted-foreground">Prix (€)</span>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            inputMode="decimal"
            placeholder="29.00"
            className={fieldCls}
          />
        </label>
        <label className="block">
          <span className="micro-label text-muted-foreground">Besoin associé</span>
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className={fieldCls}
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="micro-label text-muted-foreground">Forme</span>
          <select
            value={form}
            onChange={(e) => setForm(e.target.value as (typeof FORMS)[number])}
            className={fieldCls}
          >
            {FORMS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="micro-label text-muted-foreground">Accroche courte</span>
        <input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="ex. Un sommeil profond et réparateur"
          className={fieldCls}
        />
      </label>

      <label className="block">
        <span className="micro-label text-muted-foreground">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
          placeholder="Décrivez le produit sans allégation santé (pas de « guérit », « soigne », « traite »)."
          className={taCls}
        />
      </label>

      <label className="block">
        <span className="micro-label text-muted-foreground">Composition</span>
        <textarea
          value={composition}
          onChange={(e) => setComposition(e.target.value)}
          rows={3}
          required
          placeholder="ex. Extrait de racine d'ashwagandha bio (KSM-66, 300 mg), enveloppe de gélule végétale."
          className={taCls}
        />
      </label>

      <label className="block">
        <span className="micro-label text-muted-foreground">Dosage conseillé</span>
        <input
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          placeholder="ex. 1 gélule par jour, au cours d'un repas."
          className={fieldCls}
        />
      </label>

      <p className="text-xs text-muted-foreground">
        Chaque nouveau produit, ou toute modification de la description ou de la composition d'un
        produit déjà publié, est automatiquement analysé par le scanner IA avant publication.
      </p>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        disabled={submit.isPending}
        className="h-11 rounded bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
      >
        {submit.isPending
          ? "Envoi…"
          : isEdit
            ? "Enregistrer et renvoyer au scanner"
            : "Soumettre au scanner IA"}
      </button>
    </form>
  );
}
