import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { PageShell } from "@/components/site/Layout";
import { brandOf, formatPrice, useCatalog } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { PROMO_KEY, saveOrder, shippingFor } from "@/lib/order";

export const Route = createFileRoute("/paiement")({
  head: () => ({
    meta: [
      { title: "Paiement sécurisé — So Pure" },
      { name: "description", content: "Finalisez votre commande So Pure en toute sécurité." },
      { property: "og:title", content: "Paiement sécurisé — So Pure" },
      { property: "og:description", content: "Finalisez votre commande So Pure." },
    ],
  }),
  component: CheckoutPage,
});

const inputCls = "mt-1.5 h-11 w-full rounded border bg-card px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="micro-label text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Block({ n, title, aside, children }: { n: string; title: string; aside?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-6">
      <header className="mb-6 flex items-center justify-between border-b pb-4">
        <h2 className="flex items-center gap-3 text-lg font-semibold">
          <span className="rounded bg-muted px-2 py-0.5 text-xs">{n}</span> {title}
        </h2>
        {aside && <span className="text-xs text-muted-foreground">{aside}</span>}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function CheckoutPage() {
  const { items, count, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const catalog = useCatalog();
  const [promo, setPromo] = useState(false);
  const [delivery, setDelivery] = useState("Colissimo Domicile");
  const [method, setMethod] = useState("Carte bancaire");
  const [card, setCard] = useState("");
  useEffect(() => setPromo(sessionStorage.getItem(PROMO_KEY) === "1"), []);
  const discount = promo ? subtotal * 0.1 : 0;
  const shipping = shippingFor(subtotal);
  const total = subtotal - discount + shipping;

  if (count === 0)
    return (
      <PageShell minimal>
        <div className="container-page py-24 text-center">
          <p className="font-serif text-2xl">Votre panier est vide.</p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Retour à l'accueil</Link>
        </div>
      </PageShell>
    );

  return (
    <PageShell minimal>
      <div className="container-page py-8">
        <ol className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card px-6 py-4 text-xs uppercase tracking-wider">
          <li className="flex items-center gap-2"><Check className="h-4 w-4" /> 1. Panier (validé)</li>
          <li className="flex items-center gap-2 font-semibold"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">2</span> Livraison & paiement</li>
          <li className="text-muted-foreground">3. Confirmation</li>
          <li className="flex items-center gap-1 normal-case tracking-normal text-muted-foreground"><Lock className="h-3.5 w-3.5" /> Cryptage SSL 256-bit</li>
        </ol>

        <form
          className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            saveOrder({
              ref: `SP-2026-${Math.floor(10000 + Math.random() * 89999)}`,
              date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
              email: String(fd.get("email")),
              method,
              cardLast4: method === "Carte bancaire" ? card.replace(/\D/g, "").slice(-4) : undefined,
              subtotal, discount, shipping, total,
              lines: items.map((i) => ({ id: i.id, name: i.product.name, brand: brandOf(catalog, i.product).name, image: i.product.image, qty: i.qty, months: i.months, price: i.unitPrice })),
            });
            sessionStorage.removeItem(PROMO_KEY);
            clear();
            navigate({ to: "/confirmation" });
          }}
        >
          <div className="space-y-6">
            <Block n="01" title="Coordonnées">
              <Field label="E-mail de confirmation *"><input name="email" type="email" required className={inputCls} placeholder="vous@exemple.fr" /></Field>
              <Field label="Numéro de mobile (suivi d'expédition) *"><input name="phone" type="tel" required className={inputCls} placeholder="+33 6 00 00 00 00" /></Field>
            </Block>
            <Block n="02" title="Adresse de livraison" aside="France Métropolitaine">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Prénom *"><input required className={inputCls} /></Field>
                <Field label="Nom *"><input required className={inputCls} /></Field>
              </div>
              <Field label="Adresse complète *"><input required className={inputCls} /></Field>
              <Field label="Complément d'adresse"><input className={inputCls} placeholder="Bât. B, Étage 3, Code 4402" /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Code postal *"><input required pattern="\d{5}" className={inputCls} /></Field>
                <Field label="Ville *"><input required className={inputCls} /></Field>
              </div>
            </Block>
            <Block n="03" title="Mode de livraison" aside="Expédition éco-neutre">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Colissimo Domicile", "Livraison sans signature sous 48h. Emballage kraft biodégradable."],
                  ["Point Relais Express", "Mondial Relay & Relais Colis. Retrait sous 48-72h près de chez vous."],
                ].map(([t, d]) => (
                  <button type="button" key={t} onClick={() => setDelivery(t!)} className={`rounded-xl border p-4 text-left ${delivery === t ? "border-foreground ring-1 ring-foreground" : ""}`}>
                    <div className="flex justify-between text-sm font-semibold"><span>{t}</span><span className="micro-label">{shipping ? formatPrice(shipping) : "Offert"}</span></div>
                    <p className="mt-2 text-xs text-muted-foreground">{d}</p>
                  </button>
                ))}
              </div>
            </Block>
            <Block n="04" title="Paiement sécurisé" aside="100% garanti">
              <div className="grid grid-cols-3 gap-2">
                {["Carte bancaire", "Apple Pay", "Klarna 3x"].map((m) => (
                  <button type="button" key={m} onClick={() => setMethod(m)} className={`h-11 rounded text-sm font-medium ${method === m ? "bg-primary text-primary-foreground" : "border bg-muted"}`}>
                    {m}
                  </button>
                ))}
              </div>
              {method === "Carte bancaire" ? (
                <div className="space-y-4 rounded-lg bg-muted p-5">
                  <Field label="Numéro de carte *">
                    <div className="relative">
                      <input required inputMode="numeric" value={card} onChange={(e) => setCard(e.target.value.replace(/[^\d ]/g, "").slice(0, 19))} placeholder="1234 5678 9012 3456" className={inputCls + " font-mono"} />
                      <CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Date d'expiration *"><input required placeholder="MM / AA" className={inputCls + " font-mono"} /></Field>
                    <Field label="CVC *"><input required inputMode="numeric" maxLength={4} placeholder="•••" className={inputCls + " font-mono"} /></Field>
                  </div>
                  <Field label="Nom figurant sur la carte *"><input required className={inputCls + " uppercase"} /></Field>
                </div>
              ) : (
                <p className="rounded-lg bg-muted p-5 text-sm text-muted-foreground">Vous serez redirigé·e vers {method} pour valider le paiement.</p>
              )}
              <label className="flex items-start gap-3 text-xs text-muted-foreground">
                <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-foreground" />
                J'accepte les Conditions Générales de Vente ainsi que la Charte de Pureté So Pure. Mes données de santé et de commande restent strictement confidentielles.
              </label>
              <button className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary-hover">
                <Lock className="h-4 w-4" /> Confirmer et payer {formatPrice(total)}
              </button>
              <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" /> Démonstration : aucun paiement réel n'est effectué.</p>
            </Block>
          </div>

          <aside className="h-fit rounded-xl bg-muted p-6 lg:sticky lg:top-24">
            <div className="flex justify-between">
              <h2 className="font-semibold">Votre commande</h2>
              <span className="rounded-full bg-card px-2.5 py-0.5 text-xs">{count} articles</span>
            </div>
            <ul className="mt-6 space-y-4 border-b pb-6">
              {items.map((i) => (
                <li key={i.id + i.months} className="flex items-center gap-3">
                  <div className="relative">
                    <img src={i.product.image} alt={i.product.name} className="h-14 w-14 rounded object-cover" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-secondary-foreground">{i.qty}</span>
                  </div>
                  <div className="flex-1 text-sm">
                    <div className="font-medium leading-snug">{i.product.name}</div>
                    <div className="micro-label text-muted-foreground">{brandOf(catalog, i.product).name}</div>
                  </div>
                  <span className="text-sm">{formatPrice(i.qty * i.unitPrice)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt>Sous-total articles</dt><dd>{formatPrice(subtotal)}</dd></div>
              {discount > 0 && <div className="flex justify-between"><dt>Remise</dt><dd>-{formatPrice(discount)}</dd></div>}
              <div className="flex justify-between"><dt>{delivery}</dt><dd>{shipping ? formatPrice(shipping) : "Offerte"}</dd></div>
            </dl>
            <div className="mt-6 flex items-baseline justify-between border-t pt-6">
              <span className="micro-label">Total à régler</span>
              <span className="text-2xl font-bold">{formatPrice(total)}</span>
            </div>
          </aside>
        </form>
      </div>
    </PageShell>
  );
}
