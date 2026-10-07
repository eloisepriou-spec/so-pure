import { createFileRoute, Link } from "@tanstack/react-router";
import { Crumbs, PageShell } from "@/components/site/Layout";
import { useCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/marques/")({
  head: () => ({
    meta: [
      { title: "Nos marques — So Pure" },
      { name: "description", content: "Des marques françaises indépendantes, engagées dans la pureté végétale et la traçabilité." },
      { property: "og:title", content: "Nos marques — So Pure" },
      { property: "og:description", content: "Des marques françaises indépendantes sélectionnées par So Pure." },
    ],
  }),
  component: BrandsPage,
});

function BrandsPage() {
  const { brands: BRANDS, products: PRODUCTS } = useCatalog();
  return (
    <PageShell>
      <div className="container-page py-10">
        <Crumbs items={[{ label: "Marques" }]} />
        <h1 className="mt-8 font-serif text-5xl">Nos marques</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Une sélection pointue de laboratoires français indépendants, engagés dans la pureté végétale et la traçabilité.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {BRANDS.map((b) => (
            <Link key={b.slug} to="/marques/$slug" params={{ slug: b.slug }} className="rounded-xl border bg-card p-8 transition-colors hover:border-foreground">
              <span className="micro-label text-muted-foreground">{b.region}</span>
              <h2 className="mt-2 font-serif text-3xl">{b.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
              <span className="mt-5 block text-xs font-semibold">
                {PRODUCTS.filter((p) => p.brand === b.slug).length} créations →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
