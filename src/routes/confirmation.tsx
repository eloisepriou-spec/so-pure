import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Clock, CreditCard, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/site/Layout";
import { formatPrice } from "@/lib/catalog";
import { loadOrder, type Order } from "@/lib/order";

export const Route = createFileRoute("/confirmation")({
  head: () => ({
    meta: [
      { title: "Merci pour votre commande — So Pure" },
      { name: "description", content: "Confirmation de votre commande So Pure." },
      { property: "og:title", content: "Merci pour votre commande — So Pure" },
      { property: "og:description", content: "Confirmation de votre commande So Pure." },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  useEffect(() => setOrder(loadOrder()), []);

  if (order === undefined) return <PageShell minimal><div className="min-h-[60vh]" /></PageShell>;
  if (!order)
    return (
      <PageShell minimal>
        <div className="container-page py-24 text-center">
          <p className="font-serif text-2xl">Aucune commande récente.</p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Retour à l'accueil</Link>
        </div>
      </PageShell>
    );

  const brands = Array.from(new Set(order.lines.map((l) => l.brand)));
  return (
    <PageShell minimal>
      <div className="mx-auto max-w-3xl px-5 py-16">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-sage-soft"><Check className="h-6 w-6" /></span>
          <h1 className="mt-6 font-serif text-4xl">Merci pour votre commande</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Votre protocole de santé naturelle est en cours de préparation dans les ateliers de nos herboristeries partenaires.
          </p>
        </div>

        <div className="mt-10 rounded-xl bg-muted p-6">
          <div className="flex justify-between rounded-lg bg-card p-5">
            <div><div className="micro-label text-muted-foreground">Référence</div><div className="mt-1 text-lg font-semibold">N° {order.ref}</div></div>
            <div className="text-right"><div className="micro-label text-muted-foreground">Date</div><div className="mt-1">{order.date}</div></div>
          </div>
          <p className="mt-4 flex gap-2 text-xs text-muted-foreground"><Mail className="h-4 w-4 shrink-0" /> Un récapitulatif complet et vos liens de suivi ont été envoyés à {order.email}.</p>
        </div>

        <div className="mt-12 flex items-end justify-between">
          <h2 className="font-serif text-2xl">Expéditions atelier par atelier</h2>
          <span className="micro-label">{brands.length} colis distinct{brands.length > 1 ? "s" : ""}</span>
        </div>
        <div className="mt-6 space-y-4">
          {brands.map((b, i) => (
            <section key={b} className="rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-medium">Colis {i + 1} : {b}</h3>
                <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs"><Clock className="h-3.5 w-3.5" /> Expédition estimée sous 24h</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {order.lines.filter((l) => l.brand === b).map((l) => (
                  <div key={l.id + l.months} className="flex items-center gap-3 rounded-lg bg-muted p-3">
                    <img src={l.image} alt={l.name} className="h-12 w-12 rounded object-cover" />
                    <div className="text-sm">
                      <div className="micro-label text-muted-foreground">{l.brand}</div>
                      <div className="leading-snug">{l.name}</div>
                      <div className="text-xs text-muted-foreground">×{l.qty} • Cure {l.months} mois</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-xl border bg-card p-6">
          <h2 className="font-serif text-xl">Récapitulatif financier</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Sous-total articles</dt><dd>{formatPrice(order.subtotal)}</dd></div>
            {order.discount > 0 && <div className="flex justify-between"><dt>Remise</dt><dd>-{formatPrice(order.discount)}</dd></div>}
            <div className="flex justify-between"><dt>Frais d'expédition</dt><dd>{formatPrice(order.shipping)}</dd></div>
            <div className="flex justify-between text-xs text-muted-foreground"><dt>Mode de règlement</dt><dd className="flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" /> {order.method}{order.cardLast4 ? ` (•••• ${order.cardLast4})` : ""}</dd></div>
          </dl>
          <div className="mt-4 flex items-baseline justify-between rounded-lg bg-muted p-4">
            <span className="font-semibold">Montant total TTC</span>
            <span className="text-2xl font-bold">{formatPrice(order.total)}</span>
          </div>
        </section>

        <div className="mt-10 flex justify-center">
          <Link to="/" className="rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary-hover">Retourner à l'accueil</Link>
        </div>
      </div>
    </PageShell>
  );
}
