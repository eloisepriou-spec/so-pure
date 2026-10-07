import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flag, Leaf, Lock, Minus, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Crumbs, PageShell } from "@/components/site/Layout";
import { formatPrice, useCatalog } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { PROMO, PROMO_KEY, shippingFor } from "@/lib/order";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Mon panier — So Pure" },
      { name: "description", content: "Votre panier So Pure, expédié directement par chaque marque." },
      { property: "og:title", content: "Mon panier — So Pure" },
      { property: "og:description", content: "Votre panier So Pure." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, count, subtotal, setQty, remove } = useCart();
  const { brands: BRANDS } = useCatalog();
  const [code, setCode] = useState("");
  const [promo, setPromo] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => setPromo(sessionStorage.getItem(PROMO_KEY) === "1"), []);
  const discount = promo ? subtotal * 0.1 : 0;
  const shipping = shippingFor(subtotal);
  const total = subtotal - discount + shipping;
  const groups = BRANDS.map((b) => ({ brand: b, items: items.filter((i) => i.product.brand === b.slug) })).filter((g) => g.items.length);

  return (
    <PageShell>
      <div className="container-page py-10">
        <Crumbs items={[{ label: "Panier d'achat" }]} />
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl font-medium tracking-tight">
            Mon Panier <span className="text-muted-foreground">({count} article{count > 1 ? "s" : ""})</span>
          </h1>
          {count > 0 && (
            <span className="rounded-full bg-muted px-4 py-2 text-xs">
              {shipping === 0 ? "Livraison offerte appliquée" : `Plus que ${formatPrice(50 - subtotal)} pour la livraison offerte`} • Expédition directe par chaque marque
            </span>
          )}
        </div>

        {count === 0 ? (
          <div className="mt-16 rounded-xl border bg-card p-16 text-center">
            <p className="font-serif text-2xl">Votre panier est vide.</p>
            <Link to="/c/$slug" params={{ slug: "meilleures-ventes" }} className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
              Découvrir nos meilleures ventes
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              {groups.map((g, gi) => (
                <section key={g.brand.slug} className="rounded-xl border bg-card p-6">
                  <header className="flex flex-wrap items-start justify-between gap-2 border-b pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted"><Leaf className="h-4 w-4" /></span>
                      <div>
                        <div className="text-sm"><span className="micro-label text-muted-foreground">Colis {gi + 1}</span> • <strong>Expédié par {g.brand.name}</strong></div>
                        <div className="text-xs text-muted-foreground">{g.brand.region}</div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Sous-total marque : <strong className="text-foreground">{formatPrice(g.items.reduce((s, i) => s + i.qty * i.unitPrice, 0))}</strong>
                    </span>
                  </header>
                  {g.items.map((i) => (
                    <div key={i.id + i.months} className="flex items-center gap-4 border-b py-5 last:border-0 last:pb-0">
                      <img src={i.product.image} alt={i.product.name} className="h-20 w-20 rounded-lg bg-muted object-cover" />
                      <div className="flex-1">
                        <Link to="/produit/$id" params={{ id: i.id }} className="font-medium hover:underline">{i.product.name}</Link>
                        <div className="text-xs text-muted-foreground">{g.brand.name} • Cure {i.months} mois</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-bold">{formatPrice(i.qty * i.unitPrice)}</span>
                        <span className="text-xs text-muted-foreground">{formatPrice(i.unitPrice)} / unité</span>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 items-center rounded border bg-muted">
                            <button aria-label="Diminuer" onClick={() => setQty(i.id, i.months, i.qty - 1)} className="px-2"><Minus className="h-3.5 w-3.5" /></button>
                            <span className="w-6 text-center text-sm">{i.qty}</span>
                            <button aria-label="Augmenter" onClick={() => setQty(i.id, i.months, i.qty + 1)} className="px-2"><Plus className="h-3.5 w-3.5" /></button>
                          </div>
                          <button aria-label="Retirer" onClick={() => remove(i.id, i.months)} className="p-1.5 text-muted-foreground hover:text-foreground"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              ))}
              <div className="rounded-xl bg-muted p-5 text-sm">
                <strong>{count} flacon{count > 1 ? "s" : ""} en verre consigné ou 100% recyclable</strong>
                <div className="text-xs text-muted-foreground">Zéro plastique superflu • Calage en fibres de maïs compostables</div>
              </div>
            </div>

            <aside className="h-fit rounded-xl bg-muted p-6 lg:sticky lg:top-32">
              <div className="flex justify-between">
                <h2 className="font-semibold">Résumé de la commande</h2>
                <span className="text-xs text-muted-foreground">{count} articles</span>
              </div>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between"><dt>Sous-total articles</dt><dd>{formatPrice(subtotal)}</dd></div>
                {promo && <div className="flex justify-between"><dt>Code {PROMO} (-10%)</dt><dd>-{formatPrice(discount)}</dd></div>}
                <div className="flex justify-between"><dt>Livraison</dt><dd>{shipping ? formatPrice(shipping) : "Offerte"}</dd></div>
                <div className="flex justify-between"><dt>Bilan carbone compensé</dt><dd className="text-muted-foreground">Inclus</dd></div>
              </dl>
              <form
                className="mt-6 border-t pt-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (code.trim().toUpperCase() === PROMO) {
                    setPromo(true);
                    sessionStorage.setItem(PROMO_KEY, "1");
                    setErr("");
                  } else setErr("Ce code n'est pas valide.");
                }}
              >
                <label htmlFor="promo" className="text-xs">Code avantage ou parrainage</label>
                <div className="mt-2 flex gap-2">
                  <input id="promo" value={code} onChange={(e) => setCode(e.target.value)} placeholder="EX : EQUILIBRE10" className="h-11 flex-1 rounded border bg-card px-3 text-sm placeholder:text-muted-foreground" />
                  <button className="rounded bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">Appliquer</button>
                </div>
                {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
                {promo && <p className="mt-2 text-xs">Code appliqué ✓</p>}
              </form>
              <div className="mt-6 flex items-baseline justify-between border-t pt-6">
                <span className="font-semibold">Total TTC</span>
                <span className="text-3xl font-bold">{formatPrice(total)}</span>
              </div>
              <Link to="/paiement" className="mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary-hover">
                Procéder au paiement <ArrowRight className="h-4 w-4" />
              </Link>
              <ul className="mt-6 space-y-4 rounded-lg bg-card p-4 text-xs">
                <li className="flex gap-3"><Lock className="h-4 w-4" /><span><strong>Paiement 100% sécurisé</strong><br /><span className="text-muted-foreground">Cartes bancaires, Apple Pay, Klarna 3x</span></span></li>
                <li className="flex gap-3"><RotateCcw className="h-4 w-4" /><span><strong>Retours sereins 30 jours</strong><br /><span className="text-muted-foreground">Flacons scellés retournables sans frais</span></span></li>
                <li className="flex gap-3"><Flag className="h-4 w-4" /><span><strong>Service client en France</strong><br /><span className="text-muted-foreground">Réponse par nos pharmaciens sous 4h</span></span></li>
              </ul>
            </aside>
          </div>
        )}
      </div>
    </PageShell>
  );
}
