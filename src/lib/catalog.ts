import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getCatalog } from "./catalog.functions";
import { IMG, imageFor } from "./images";

export type Need = "Sommeil" | "Digestion" | "Énergie" | "Santé Féminine" | "Longévité";
export type Form = "Gélules végétales" | "Poudres" | "Extraits liquides";
export type Category = { slug: string; name: Need; intro: string };
export type Brand = { slug: string; name: string; region: string; description: string };
export type Product = {
  id: string; name: string; brand: string; need: Need; needSlug: string; form: Form;
  price: number; rating: number; reviews: number; image: string; gallery: string[];
  tagline: string; description: string; composition: string; dosage: string;
  isNew: boolean; bestSeller: boolean;
};
export type Catalog = { needs: Category[]; brands: Brand[]; products: Product[] };

export const catalogQuery = queryOptions({
  queryKey: ["catalog"],
  staleTime: 5 * 60_000,
  queryFn: async (): Promise<Catalog> => {
    const raw = await getCatalog();
    const needs = raw.categories.map((c) => ({ slug: c.slug, name: c.name as Need, intro: c.intro }));
    return {
      needs,
      brands: raw.brands,
      products: raw.products.map((r) => ({
        id: r.id, name: r.name, brand: r.brand_slug, needSlug: r.category_slug,
        need: (needs.find((n) => n.slug === r.category_slug)?.name ?? "Sommeil") as Need,
        form: r.form as Form, price: Number(r.price), rating: Number(r.rating), reviews: r.reviews,
        image: imageFor(r.image_key), gallery: (r.gallery_keys ?? []).map(imageFor),
        tagline: r.tagline, description: r.description, composition: r.composition, dosage: r.dosage,
        isNew: r.is_new, bestSeller: r.best_seller,
      })),
    };
  },
});

export const useCatalog = () => useSuspenseQuery(catalogQuery).data;

export const brandOf = (c: Catalog, p: Product): Brand =>
  c.brands.find((b) => b.slug === p.brand) ?? { slug: p.brand, name: p.brand, region: "", description: "" };

export type Listing = { slug: string; title: string; intro: string; products: Product[]; showBadge: boolean };

export function getListing(c: Catalog, slug: string): Listing | undefined {
  if (slug === "nouveautes")
    return { slug, title: "Nouveautés", intro: "Les dernières formules entrées dans notre sélection, après validation de notre comité de pureté.", products: c.products.filter((p) => p.isNew), showBadge: true };
  if (slug === "meilleures-ventes")
    return { slug, title: "Meilleures Ventes", intro: "Les compléments plébiscités par notre communauté, cure après cure.", products: c.products.filter((p) => p.bestSeller), showBadge: true };
  const need = c.needs.find((n) => n.slug === slug);
  if (!need) return undefined;
  return { slug, title: need.name, intro: need.intro, products: c.products.filter((p) => p.needSlug === slug), showBadge: false };
}

export const formatPrice = (n: number) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

export const JOURNAL = [
  {
    id: "choisir-magnesium",
    tag: "Nutrition • 4 min de lecture",
    title: "Comment bien choisir son magnésium : formes et biodisponibilité",
    excerpt:
      "Démêler les sels de magnésium pour cibler la fatigue nerveuse et musculaire sans dérangement intestinal. Les formes bisglycinate et malate…",
    image: IMG.magnesium,
    cta: "Lire la monographie",
  },
  {
    id: "rentree-immunite",
    tag: "Santé naturelle • 5 min de lecture",
    title: "Les essentiels de la rentrée : revitaliser son immunité naturellement",
    excerpt:
      "Propolis, vitamine C liposomale et zinc chélaté : le protocole expert pour soutenir vos défenses immunitaires sans saturer votre organisme.",
    image: IMG.journalImmunite,
    cta: "Lire le guide",
  },
];
