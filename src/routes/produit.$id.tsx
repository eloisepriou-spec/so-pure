import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, ChevronDown, FlaskConical, Heart, Leaf, Minus, Plus, Recycle, ShoppingBag, Star, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Crumbs, PageShell } from "@/components/site/Layout";
import { NeedBadge, ProductCard } from "@/components/site/ProductCard";
import { brandOf, catalogQuery, formatPrice, useCatalog } from "@/lib/catalog";
import { linePrice, useCart } from "@/lib/cart";

export const Route = createFileRoute("/produit/$id")({
  loader: async ({ params, context }) => {
    const c = await context.queryClient.ensureQueryData(catalogQuery);
    const p = c.products.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { ...p, brandName: brandOf(c, p).name };
  },
  head: ({ loaderData: p }) => ({
    meta: p
      ? [
          { title: `${p.name} — ${p.brandName} | So Pure` },
          { name: "description", content: p.description },
          { property: "og:title", content: `${p.name} — So Pure` },
          { property: "og:description", content: p.description },
          { property: "og:image", content: p.image },
          { name: "twitter:image", content: p.image },
        ]
      : [],
  }),
  component: ProductPage,
});

const REVIEWS = [
  { name: "Éléonore V.", when: "Il y a 4 jours", text: "Remarquable tolérance digestive par rapport aux formes classiques. Après 3 semaines de cure, mes tensions ont complètement disparu." },
  { name: "Marc-Antoine D.", when: "Il y a 2 semaines", text: "Le flacon en verre est un véritable bel objet sur la table de chevet, et la formule ne provoque aucune lourdeur. Mon sommeil s'est nettement allongé." },
  { name: "Camille L.", when: "Il y a 3 semaines", text: "Recommandé par ma naturopathe pour gérer les pics de stress au travail. Effet apaisant sans somnolence diurne." },
];

function Accordion({ title, children, open: initial = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  const [open, setOpen] = useState(initial);
  return (
    <div className="rounded-xl border bg-card">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between px-5 py-4">
        <span className="micro-label">{title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="space-y-3 px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{children}</div>}
    </div>
  );
}

function ProductPage() {
  const p = Route.useLoaderData();
  const catalog = useCatalog();
  const brand = brandOf(catalog, p);
  const gallery = p.gallery.length ? p.gallery : [p.image];
  const [img, setImg] = useState(0);
  const [months, setMonths] = useState<1 | 3>(1);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const pairings = catalog.products.filter((x) => x.id !== p.id && x.need !== p.need).slice(0, 3);

  return (
    <PageShell>
      <div className="container-page py-8" key={p.id}>
        <Crumbs items={[{ label: p.need, to: "/c/$slug", params: { slug: p.needSlug } }, { label: p.name }]} />

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
              <img src={gallery[img]} alt={`${brand.name} - ${p.name}`} className="h-full w-full object-cover" />
              <span className="micro-label absolute left-4 top-4 rounded-full bg-background px-3 py-1">Flacon verre</span>
            </div>
            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {gallery.map((g, i) => (
                  <button
                    key={g}
                    aria-label={`Voir l'image ${i + 1}`}
                    onClick={() => setImg(i)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 ${i === img ? "border-foreground" : "border-transparent"}`}
                  >
                    <img src={g} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl bg-muted p-6 text-center text-xs">
              {[
                [Recycle, "Flacon verre recyclable", "Zéro plastique fossile"],
                [Leaf, "100% végétal", "Sans excipient superflu"],
                [FlaskConical, "Analysé par labo indépendant", "Lot 2026-B8 certifié"],
              ].map(([Icon, t, s]) => {
                const I = Icon as typeof Leaf;
                return (
                  <div key={t as string}>
                    <I className="mx-auto mb-2 h-5 w-5" />
                    <div className="font-medium">{t as string}</div>
                    <div className="mt-1 text-muted-foreground">{s as string}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:pt-2">
            <NeedBadge need={p.need} />
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight">{p.name}</h1>
            <Link to="/marques/$slug" params={{ slug: brand.slug }} className="mt-2 block text-sm text-muted-foreground hover:text-foreground">
              {brand.name} — {brand.region}
            </Link>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-foreground" />
                ))}
              </div>
              <span className="font-medium">{p.rating.toFixed(1)}/5</span>
              <span className="text-muted-foreground">({p.reviews} avis vérifiés)</span>
            </div>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-bold">{formatPrice(linePrice(p, months))}</span>
              <span className="text-xs text-muted-foreground">TTC, soit {formatPrice(linePrice(p, months) / (months * 30))} / jour</span>
            </div>
            <p className="mt-6 leading-relaxed text-muted-foreground">{p.description}</p>

            <div className="mt-8">
              <span className="micro-label">Choisir la durée du protocole</span>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {([1, 3] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMonths(m)}
                    className={`rounded-xl border p-4 text-left transition-colors ${months === m ? "border-foreground ring-1 ring-foreground" : "hover:border-foreground/40"}`}
                  >
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>
                        Cure {m} mois{" "}
                        {m === 3 && <span className="ml-1 rounded bg-coral px-1.5 py-0.5 text-[10px] text-coral-foreground">-10%</span>}
                      </span>
                      <span>{formatPrice(linePrice(p, m))}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{m * 60} gélules végétales</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-12 items-center rounded-full border">
                <button aria-label="Diminuer" onClick={() => setQty(Math.max(1, qty - 1))} className="px-4"><Minus className="h-4 w-4" /></button>
                <span className="w-6 text-center text-sm font-medium">{qty}</span>
                <button aria-label="Augmenter" onClick={() => setQty(qty + 1)} className="px-4"><Plus className="h-4 w-4" /></button>
              </div>
              <button
                onClick={() => {
                  add(p.id, qty, months);
                  toast.success("Ajouté au panier", { action: { label: "Voir", onClick: () => (window.location.href = "/panier") } });
                }}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
              >
                <ShoppingBag className="h-4 w-4" /> Ajouter au panier
              </button>
              <button aria-label="Ajouter aux favoris" className="flex h-12 w-12 items-center justify-center rounded-full border hover:bg-muted">
                <Heart className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="h-4 w-4" /> Livraison offerte dès 50€ • Expédié sous 24h ouvrées depuis {brand.region}
            </p>

            <div className="mt-8 space-y-3">
              <Accordion title="Composition & ingrédients clés" open>
                <p>{p.composition}</p>
              </Accordion>
              <Accordion title="Conseils d'utilisation & posologie">
                <p><strong className="text-foreground">Posologie recommandée :</strong> 2 prises par jour avec un verre d'eau, de préférence au cours du dîner.</p>
                <p><strong className="text-foreground">Durée du protocole :</strong> cure recommandée de 30 à 90 jours consécutifs.</p>
              </Accordion>
              <Accordion title="Engagements & certifications">
                <p>• 100% fabrication française, formulé et conditionné en {brand.region}.</p>
                <p>• Pureté clinique : absence de solvant résiduel et de métaux lourds confirmée par spectrométrie de masse.</p>
                <p>• Éco-conception : flacon réutilisable et étiquette biosourcée.</p>
              </Accordion>
            </div>
          </div>
        </div>

        <section className="mt-24">
          <h2 className="headline-editorial mb-8">À associer pour amplifier les bienfaits</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {pairings.map((x) => (
              <ProductCard key={x.id} product={x} showBadge />
            ))}
          </div>
        </section>

        <section className="mt-24 rounded-2xl border bg-card p-8 md:p-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="headline-editorial">Avis clients vérifiés</h2>
            <div className="text-right">
              <div className="flex items-center gap-1 text-2xl font-bold"><Star className="h-5 w-5 fill-foreground" /> {p.rating.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">/ 5.0</span></div>
              <div className="text-xs text-muted-foreground">Calculé sur {p.reviews} avis authentiques</div>
            </div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="flex flex-col justify-between rounded-xl bg-muted p-6">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-foreground text-foreground" />)}</span>
                    {r.when}
                  </div>
                  <blockquote className="mt-4 text-sm leading-relaxed">« {r.text} »</blockquote>
                </div>
                <figcaption className="mt-6 flex justify-between text-xs">
                  <span className="font-semibold">{r.name}</span>
                  <span className="flex items-center gap-1 text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5" /> Achat vérifié</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
