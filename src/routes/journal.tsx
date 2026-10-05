import { createFileRoute } from "@tanstack/react-router";
import { Crumbs, PageShell } from "@/components/site/Layout";
import { JOURNAL } from "@/lib/catalog";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Le Journal — So Pure" },
      { name: "description", content: "Monographies et guides de nos naturopathes sur les compléments alimentaires." },
      { property: "og:title", content: "Le Journal — So Pure" },
      { property: "og:description", content: "Monographies et guides de nos naturopathes." },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  return (
    <PageShell>
      <div className="container-page py-10">
        <Crumbs items={[{ label: "Journal" }]} />
        <h1 className="mt-8 font-serif text-5xl italic">Le Journal</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">Monographies, guides et protocoles rédigés par nos naturopathes.</p>
        <div className="mt-12 space-y-16">
          {JOURNAL.map((a) => (
            <article key={a.id} className="grid gap-10 md:grid-cols-2">
              <img src={a.image} alt={a.title} className="aspect-[4/3] w-full rounded-xl object-cover" />
              <div className="flex flex-col justify-center">
                <span className="micro-label text-coral">{a.tag}</span>
                <h2 className="mt-3 font-serif text-3xl leading-snug">{a.title}</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{a.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
