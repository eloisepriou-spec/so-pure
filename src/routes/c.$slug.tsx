import { createFileRoute, notFound } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
import { Crumbs, PageShell } from "@/components/site/Layout";
import { FilteredGrid } from "@/components/site/Listing";
import { getListing } from "@/lib/catalog";

export const Route = createFileRoute("/c/$slug")({
  loader: ({ params }) => {
    const l = getListing(params.slug);
    if (!l) throw notFound();
    return l;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — So Pure` },
          { name: "description", content: loaderData.intro },
          { property: "og:title", content: `${loaderData.title} — So Pure` },
          { property: "og:description", content: loaderData.intro },
        ]
      : [],
  }),
  component: ListingPage,
});

function ListingPage() {
  const l = Route.useLoaderData();
  return (
    <PageShell>
      <div className="container-page py-10">
        <Crumbs items={[{ label: l.title }]} />
        <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl">{l.title}</h1>
            <p className="mt-4 leading-relaxed text-muted-foreground">{l.intro}</p>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> 0 additif de synthèse
            </span>
            <span className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-xs">
              <BadgeCheck className="h-4 w-4" /> Origine 100% contrôlée
            </span>
          </div>
        </div>
        <div className="mt-12">
          <FilteredGrid key={l.slug} products={l.products} showBadge={l.showBadge} />
        </div>
      </div>
    </PageShell>
  );
}
