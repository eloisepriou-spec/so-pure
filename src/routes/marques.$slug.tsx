import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Crumbs, PageShell } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { BRANDS, PRODUCTS } from "@/lib/catalog";

export const Route = createFileRoute("/marques/$slug")({
  loader: ({ params }) => {
    const b = BRANDS.find((x) => x.slug === params.slug);
    if (!b) throw notFound();
    return b;
  },
  head: ({ loaderData: b }) => ({
    meta: b
      ? [
          { title: `${b.name} — Marque | So Pure` },
          { name: "description", content: b.description },
          { property: "og:title", content: `${b.name} — So Pure` },
          { property: "og:description", content: b.description },
        ]
      : [],
  }),
  component: BrandPage,
});

function BrandPage() {
  const b = Route.useLoaderData();
  const products = PRODUCTS.filter((p) => p.brand === b.slug);
  const needs = Array.from(new Set(products.map((p) => p.need)));
  const [filter, setFilter] = useState<string | null>(null);
  const list = filter ? products.filter((p) => p.need === filter) : products;

  return (
    <PageShell>
      <div className="container-page py-10" key={b.slug}>
        <Crumbs items={[{ label: "Marques", to: "/marques" }, { label: b.name }]} />
        <h1 className="mt-8 font-serif text-5xl">{b.name}</h1>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{b.description}</p>
        <div className="mt-12 flex flex-wrap items-end justify-between gap-4 border-t pt-12">
          <h2 className="text-3xl font-medium tracking-tight">Les créations {b.name}</h2>
          <div className="flex flex-wrap gap-2">
            {[null, ...needs].map((n) => (
              <button
                key={n ?? "all"}
                onClick={() => setFilter(n)}
                className={`rounded-full px-4 py-1.5 text-sm ${filter === n ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-border"}`}
              >
                {n ?? "Tous les soins"}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} showBadge={needs.length > 1} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
