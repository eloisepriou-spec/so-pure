import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useCatalog, type Product } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

const FORMS = ["Gélules végétales", "Poudres", "Extraits liquides"] as const;

export function FilteredGrid({ products, showBadge }: { products: Product[]; showBadge: boolean }) {
  const { brands: BRANDS } = useCatalog();
  const [brands, setBrands] = useState<string[]>([]);
  const [forms, setForms] = useState<string[]>([]);
  const [max, setMax] = useState(80);
  const [sort, setSort] = useState("pertinence");

  const list = useMemo(() => {
    const l = products.filter(
      (p) =>
        (!brands.length || brands.includes(p.brand)) &&
        (!forms.length || forms.includes(p.form)) &&
        p.price <= max,
    );
    if (sort === "prix-asc") l.sort((a, b) => a.price - b.price);
    if (sort === "prix-desc") l.sort((a, b) => b.price - a.price);
    if (sort === "note") l.sort((a, b) => b.rating - a.rating);
    return l;
  }, [products, brands, forms, max, sort]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit space-y-8 rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between">
          <span className="micro-label flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Filtrer
          </span>
          <button
            onClick={() => {
              setBrands([]);
              setForms([]);
              setMax(80);
            }}
            className="text-xs underline"
          >
            Réinitialiser
          </button>
        </div>
        <fieldset>
          <legend className="micro-label mb-3">Marque</legend>
          {BRANDS.map((b) => (
            <label key={b.slug} className="flex items-center gap-3 py-1 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-foreground" checked={brands.includes(b.slug)} onChange={() => toggle(brands, setBrands, b.slug)} />
              {b.name}
            </label>
          ))}
        </fieldset>
        <div>
          <div className="mb-3 flex justify-between">
            <span className="micro-label">Prix max</span>
            <span className="text-xs font-medium">{max} €</span>
          </div>
          <input type="range" min={20} max={80} value={max} onChange={(e) => setMax(+e.target.value)} aria-label="Prix maximum" className="w-full accent-foreground" />
        </div>
        <fieldset>
          <legend className="micro-label mb-3">Forme galénique</legend>
          {FORMS.map((f) => (
            <label key={f} className="flex items-center gap-3 py-1 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-foreground" checked={forms.includes(f)} onChange={() => toggle(forms, setForms, f)} />
              {f}
            </label>
          ))}
        </fieldset>
        <p className="rounded-lg bg-muted p-4 font-serif text-sm italic text-muted-foreground">
          « La quintessence végétale sans liant ni excipient superflu. »
        </p>
      </aside>
      <div>
        <div className="mb-6 flex items-center justify-between rounded-xl border bg-card px-5 py-3">
          <span className="text-sm">
            <span className="micro-label">{list.length} compléments</span>
            <span className="text-muted-foreground"> • Disponibles immédiatement</span>
          </span>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Trier par
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 rounded border bg-muted px-2 text-foreground">
              <option value="pertinence">Pertinence</option>
              <option value="prix-asc">Prix croissant</option>
              <option value="prix-desc">Prix décroissant</option>
              <option value="note">Mieux notés</option>
            </select>
          </label>
        </div>
        {list.length ? (
          <div className="grid grid-cols-2 gap-5 xl:grid-cols-3">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} showBadge={showBadge} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-muted-foreground">Aucun complément ne correspond à ces filtres.</p>
        )}
      </div>
    </div>
  );
}
