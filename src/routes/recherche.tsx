import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Crumbs, PageShell } from "@/components/site/Layout";
import { FilteredGrid } from "@/components/site/Listing";
import { brandOf, PRODUCTS } from "@/lib/catalog";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const Route = createFileRoute("/recherche")({
  validateSearch: z.object({ q: z.string().optional().default("") }),
  head: () => ({
    meta: [
      { title: "Recherche — So Pure" },
      { name: "description", content: "Recherchez un complément ou une marque dans la sélection So Pure." },
      { property: "og:title", content: "Recherche — So Pure" },
      { property: "og:description", content: "Recherchez un complément ou une marque." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const n = norm(q);
  const results = PRODUCTS.filter((p) =>
    norm([p.name, brandOf(p).name, p.need, p.tagline].join(" ")).includes(n),
  );
  return (
    <PageShell>
      <div className="container-page py-10">
        <Crumbs items={[{ label: "Recherche" }]} />
        <h1 className="mt-8 font-serif text-4xl">{q ? `Résultats pour « ${q} »` : "Tous les compléments"}</h1>
        <div className="mt-10">
          <FilteredGrid key={q} products={results} showBadge />
        </div>
      </div>
    </PageShell>
  );
}
