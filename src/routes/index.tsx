import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/Layout";
import { ProductCard, SectionHead } from "@/components/site/ProductCard";
import { JOURNAL, useCatalog } from "@/lib/catalog";
import { IMG } from "@/lib/images";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "So Pure — Le meilleur des compléments, sélectionné pour vous" },
      {
        name: "description",
        content: "Compléments alimentaires bio et made in France, choisis selon vos besoins : sommeil, digestion, énergie, santé féminine, longévité.",
      },
      { property: "og:title", content: "So Pure — Le meilleur des compléments, sélectionné pour vous" },
      { property: "og:description", content: "Une sélection rigoureuse de compléments bio et made in France." },
    ],
  }),
  component: Index,
});

const NEED_CARDS = [
  { slug: "sommeil", l1: "Sommeil", l2: "réparateur", img: IMG.needSommeil },
  { slug: "digestion", l1: "Confort", l2: "du ventre", img: IMG.needDigestion },
  { slug: "energie", l1: "Vitalité", l2: "et énergie", img: IMG.needEnergie },
  { slug: "sante-feminine", l1: "Cycle", l2: "féminin", img: IMG.needFeminin },
];

function Index() {
  const { products: PRODUCTS, brands: BRANDS } = useCatalog();
  return (
    <PageShell>
      <section className="relative flex h-[520px] items-center justify-center overflow-hidden">
        <img src={IMG.hero} alt="Officine botanique avec flacons de compléments" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-overlay/55" />
        <div className="relative z-10 max-w-3xl px-6 text-center text-on-overlay">
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Le meilleur des compléments, sélectionné pour vous
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-on-overlay/90">
            Une sélection rigoureuse de compléments alimentaires bio et made in France, choisis selon vos besoins par
            nos experts.
          </p>
          <Link
            to="/c/$slug"
            params={{ slug: "meilleures-ventes" }}
            className="mt-8 inline-flex rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Découvrir la sélection
          </Link>
        </div>
      </section>

      <div className="container-page space-y-24 py-20">
        <section>
          <SectionHead title="Nouvelles Découvertes" link={{ to: "/c/$slug", params: { slug: "nouveautes" } }} />
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {PRODUCTS.filter((p) => p.isNew).slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} showBadge />
            ))}
          </div>
        </section>

        <section>
          <SectionHead title="Explorer par besoin" />
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {NEED_CARDS.map((n) => (
              <Link
                key={n.slug}
                to="/c/$slug"
                params={{ slug: n.slug }}
                className="group relative block aspect-[4/5] overflow-hidden rounded-xl"
              >
                <img src={n.img} alt={`${n.l1} ${n.l2}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-overlay/80 via-overlay/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-center text-on-overlay">
                  <span className="block text-2xl font-medium leading-tight">
                    {n.l1}
                    <br />
                    {n.l2}
                  </span>
                  <span className="mt-2 block text-xs opacity-0 transition-opacity group-hover:opacity-100">Découvrir les soins →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHead title="Meilleures Ventes" link={{ to: "/c/$slug", params: { slug: "meilleures-ventes" } }} />
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {PRODUCTS.filter((p) => p.bestSeller).slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} showBadge />
            ))}
          </div>
        </section>

        <section>
          <h2 className="headline-editorial">Nos marques sélectionnées</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Une sélection pointue de marques françaises indépendantes, engagées dans la pureté végétale et la traçabilité.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {BRANDS.map((b, i) => (
              <Link
                key={b.slug}
                to="/marques/$slug"
                params={{ slug: b.slug }}
                className="flex h-36 flex-col items-center justify-center rounded-xl border bg-card text-center transition-colors hover:border-foreground"
              >
                <span className={i % 2 ? "text-lg font-semibold uppercase tracking-[0.25em]" : "font-serif text-2xl"}>{b.name}</span>
                <span className="micro-label mt-3 text-muted-foreground">{b.region}</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHead title="Le Journal" link={{ to: "/journal", label: "Lire plus" }} />
          <div className="grid gap-6 md:grid-cols-2">
            {JOURNAL.map((a) => (
              <JournalCard key={a.id} a={a} />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export function JournalCard({ a }: { a: (typeof JOURNAL)[number] }) {
  return (
    <Link to="/journal" className="group grid overflow-hidden rounded-xl border bg-card sm:grid-cols-2">
      <img src={a.image} alt={a.title} loading="lazy" className="aspect-square h-full w-full object-cover" />
      <div className="flex flex-col justify-center p-7">
        <span className="micro-label text-muted-foreground">{a.tag}</span>
        <h3 className="mt-3 font-serif text-xl leading-snug">{a.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
        <span className="mt-5 text-xs font-semibold group-hover:underline">{a.cta} →</span>
      </div>
    </Link>
  );
}
