import { IMG } from "./images";

export type Need = "Sommeil" | "Digestion" | "Énergie" | "Santé Féminine" | "Longévité";
export type Form = "Gélules végétales" | "Poudres" | "Extraits liquides";

export const NEEDS: { slug: string; name: Need; intro: string }[] = [
  {
    slug: "sommeil",
    name: "Sommeil",
    intro:
      "Des formules d'exception dédiées à l'endormissement, la détente musculaire et nerveuse, et au sommeil réparateur, sélectionnées pour leur biodisponibilité et leur traçabilité.",
  },
  {
    slug: "digestion",
    name: "Digestion",
    intro:
      "Probiotiques vivants et plantes digestives pour un microbiote équilibré et un ventre apaisé, formulés sans excipient superflu.",
  },
  {
    slug: "energie",
    name: "Énergie",
    intro:
      "Adaptogènes et champignons fonctionnels pour une vitalité stable, sans pic ni contrecoup, issus de cultures françaises tracées.",
  },
  {
    slug: "sante-feminine",
    name: "Santé Féminine",
    intro:
      "Des soins botaniques pensés pour accompagner chaque phase du cycle féminin, avec des actifs titrés et une origine contrôlée.",
  },
  {
    slug: "longevite",
    name: "Longévité",
    intro:
      "Oméga-3 végétaux et antioxydants purs pour soutenir l'organisme dans la durée, analysés lot par lot en laboratoire indépendant.",
  },
];

export const needSlug = (n: Need) => NEEDS.find((x) => x.name === n)!.slug;

export type Brand = { slug: string; name: string; region: string; description: string };

export const BRANDS: Brand[] = [
  {
    slug: "racine-seve",
    name: "Racine & Sève",
    region: "Auvergne, France",
    description:
      "Laboratoire d'extraction botanique basé en Auvergne. Racine & Sève élabore des compléments purs à partir de plantes françaises, sans additif ni solvant de synthèse.",
  },
  {
    slug: "botaniste-paris",
    name: "Botaniste Paris",
    region: "Île-de-France",
    description:
      "Maison d'herboristerie parisienne qui associe adaptogènes et savoir-faire apothicaire, dans des formules courtes et lisibles.",
  },
  {
    slug: "clarte-naturelle",
    name: "Clarté Naturelle",
    region: "Bretagne",
    description:
      "Spécialiste breton des oméga-3 issus de micro-algues et des huiles végétales vierges, extraites à froid.",
  },
  {
    slug: "terra-vita",
    name: "Terra Vita",
    region: "Provence",
    description:
      "Laboratoire provençal de microbiote et de fermentation, dédié aux souches probiotiques vivantes et gastro-résistantes.",
  },
];

export type Product = {
  id: string;
  name: string;
  brand: string; // brand slug
  need: Need;
  form: Form;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  gallery?: string[];
  tagline: string;
  description: string;
  isNew?: boolean;
  bestSeller?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "complexe-sommeil-profond",
    name: "Complexe Sommeil Profond",
    brand: "racine-seve",
    need: "Sommeil",
    form: "Gélules végétales",
    price: 28,
    rating: 4.9,
    reviews: 24,
    image: IMG.sommeilProfond,
    tagline: "Valériane & mélatonine végétale pure",
    description:
      "Une synergie de valériane, passiflore et mélatonine végétale pour faciliter l'endormissement et retrouver des nuits continues.",
    isNew: true,
  },
  {
    id: "elixir-reishi-cacao",
    name: "Élixir Reishi & Cacao Sauvage",
    brand: "botaniste-paris",
    need: "Énergie",
    form: "Poudres",
    price: 34,
    rating: 4.8,
    reviews: 19,
    image: IMG.reishi,
    tagline: "Champignon adaptogène & cacao cru",
    description:
      "Un rituel en poudre associant reishi bio et cacao sauvage pour une énergie douce et une concentration durable.",
    isNew: true,
  },
  {
    id: "probiotiques-flore-equilibre",
    name: "Probiotiques Flore & Équilibre",
    brand: "terra-vita",
    need: "Digestion",
    form: "Gélules végétales",
    price: 32,
    rating: 4.9,
    reviews: 31,
    image: IMG.probiotiques,
    tagline: "10 souches vivantes gastro-résistantes",
    description:
      "Dix souches probiotiques sélectionnées pour rééquilibrer la flore intestinale et apaiser le confort digestif.",
    isNew: true,
  },
  {
    id: "omega-3-vegetal-algae",
    name: "Oméga 3 Végétal Pur Algae",
    brand: "clarte-naturelle",
    need: "Longévité",
    form: "Gélules végétales",
    price: 29.5,
    rating: 5.0,
    reviews: 18,
    image: IMG.omega,
    tagline: "DHA & EPA issus de micro-algues",
    description:
      "Des oméga-3 100% végétaux extraits de micro-algues, sans métaux lourds, pour le cœur, le cerveau et la vision.",
    isNew: true,
  },
  {
    id: "magnesium-bisglycinate",
    name: "Magnésium Bisglycinate Chélaté & Vitamine B6 Bioactive",
    brand: "racine-seve",
    need: "Sommeil",
    form: "Gélules végétales",
    price: 29,
    rating: 4.9,
    reviews: 42,
    image: IMG.magnesium,
    gallery: [IMG.magGallery1, IMG.magGallery2, IMG.magGallery3, IMG.magGallery4],
    tagline: "Haute biodisponibilité & vitamine B6 bioactive",
    description:
      "Formulation pure à haute biodisponibilité pour rééquilibrer le système nerveux central, dissiper la fatigue nerveuse et détendre les muscles sans aucun désagrément digestif.",
    bestSeller: true,
  },
  {
    id: "ashwagandha-ksm66-melatonine",
    name: "Ashwagandha KSM-66 & Mélatonine",
    brand: "botaniste-paris",
    need: "Sommeil",
    form: "Gélules végétales",
    price: 32,
    rating: 4.8,
    reviews: 15,
    image: IMG.ashwagandha,
    tagline: "Adaptogène titré & mélatonine",
    description:
      "L'ashwagandha KSM-66 associé à la mélatonine pour réduire le stress du soir et favoriser un sommeil profond.",
    bestSeller: true,
  },
  {
    id: "probiotiques-50-milliards",
    name: "Probiotiques 50 Milliards UFC",
    brand: "terra-vita",
    need: "Digestion",
    form: "Gélules végétales",
    price: 36.5,
    rating: 4.7,
    reviews: 27,
    image: IMG.probiotiques,
    tagline: "Concentration intensive pour cure de choc",
    description:
      "Une cure intensive à 50 milliards d'UFC pour restaurer le microbiote après un traitement ou une période de déséquilibre.",
    bestSeller: true,
  },
  {
    id: "omega-3-vegetal-pur",
    name: "Oméga 3 Végétal Pur",
    brand: "clarte-naturelle",
    need: "Longévité",
    form: "Gélules végétales",
    price: 27,
    rating: 4.8,
    reviews: 22,
    image: IMG.omega,
    tagline: "Huile d'algue extraite à froid",
    description:
      "La version essentielle de nos oméga-3 végétaux, pour un apport quotidien en DHA dans une capsule végétale.",
    bestSeller: true,
  },
  {
    id: "ashwagandha-ksm66-racine-pure",
    name: "Ashwagandha KSM-66® Racine Pure",
    brand: "racine-seve",
    need: "Énergie",
    form: "Extraits liquides",
    price: 26,
    rating: 5.0,
    reviews: 19,
    image: IMG.ashwaDropper,
    tagline: "Régulation du cortisol et résistance au surmenage",
    description:
      "Extrait liquide d'ashwagandha titré à 5% de withanolides pour soutenir l'énergie et la résistance au stress.",
  },
  {
    id: "omega-3-epa-dha",
    name: "Oméga-3 Sauvages EPA / DHA Purifiés",
    brand: "clarte-naturelle",
    need: "Longévité",
    form: "Gélules végétales",
    price: 34,
    rating: 4.9,
    reviews: 33,
    image: IMG.omegaJar,
    tagline: "Soutien des membranes neuronales et humeur stable",
    description:
      "Des oméga-3 hautement purifiés et certifiés, pour soutenir la fonction cérébrale et l'équilibre émotionnel.",
  },
  {
    id: "complexe-melisse-passiflore",
    name: "Complexe Mélisse & Passiflore Bio",
    brand: "botaniste-paris",
    need: "Sommeil",
    form: "Extraits liquides",
    price: 22,
    rating: 4.7,
    reviews: 12,
    image: IMG.melisse,
    tagline: "Facilite l'endormissement et prévient les réveils à 3h",
    description:
      "Un extrait hydro-alcoolique doux de mélisse et passiflore bio, à prendre en quelques gouttes le soir.",
  },
  {
    id: "macerat-aubepine-passiflore",
    name: "Macérat d'Aubépine & Passiflore",
    brand: "racine-seve",
    need: "Sommeil",
    form: "Extraits liquides",
    price: 22,
    rating: 4.8,
    reviews: 11,
    image: IMG.aubepine,
    tagline: "Bourgeons frais cueillis à la main",
    description:
      "Un macérat de bourgeons frais d'aubépine et de passiflore, pour apaiser le cœur et l'esprit avant la nuit.",
  },
  {
    id: "gingembre-fenouil-digest",
    name: "Gingembre & Fenouil Digest",
    brand: "terra-vita",
    need: "Digestion",
    form: "Extraits liquides",
    price: 24,
    rating: 4.6,
    reviews: 14,
    image: IMG.aubepine,
    tagline: "Confort digestif après les repas",
    description:
      "Un extrait de gingembre frais et de graines de fenouil pour alléger la digestion et réduire les ballonnements.",
  },
  {
    id: "gattilier-equilibre-cycle",
    name: "Gattilier Équilibre Cycle",
    brand: "clarte-naturelle",
    need: "Santé Féminine",
    form: "Extraits liquides",
    price: 31,
    rating: 4.8,
    reviews: 21,
    image: IMG.ashwaDropper,
    tagline: "Accompagne le confort prémenstruel",
    description:
      "Un extrait de gattilier bio titré pour accompagner l'équilibre hormonal et le confort tout au long du cycle.",
    isNew: true,
  },
  {
    id: "onagre-bourrache-bio",
    name: "Onagre & Bourrache Bio",
    brand: "clarte-naturelle",
    need: "Santé Féminine",
    form: "Gélules végétales",
    price: 26,
    rating: 4.7,
    reviews: 17,
    image: IMG.omegaJar,
    tagline: "Huiles vierges riches en oméga-6 GLA",
    description:
      "Huiles d'onagre et de bourrache vierges, extraites à froid, pour la souplesse de la peau et le confort féminin.",
  },
  {
    id: "rhodiola-energie-mentale",
    name: "Rhodiola Énergie Mentale",
    brand: "botaniste-paris",
    need: "Énergie",
    form: "Gélules végétales",
    price: 27,
    rating: 4.7,
    reviews: 16,
    image: IMG.ashwagandha,
    tagline: "Clarté mentale et résistance à la fatigue",
    description:
      "Rhodiola rosea titrée en rosavines pour une énergie mentale stable lors des périodes exigeantes.",
  },
];

export const brandOf = (p: Product) => BRANDS.find((b) => b.slug === p.brand)!;
export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);

export type Listing = { slug: string; title: string; intro: string; products: Product[]; showBadge: boolean };

export function getListing(slug: string): Listing | undefined {
  if (slug === "nouveautes")
    return {
      slug,
      title: "Nouveautés",
      intro: "Les dernières formules entrées dans notre sélection, après validation de notre comité de pureté.",
      products: PRODUCTS.filter((p) => p.isNew),
      showBadge: true,
    };
  if (slug === "meilleures-ventes")
    return {
      slug,
      title: "Meilleures Ventes",
      intro: "Les compléments plébiscités par notre communauté, cure après cure.",
      products: PRODUCTS.filter((p) => p.bestSeller),
      showBadge: true,
    };
  const need = NEEDS.find((n) => n.slug === slug);
  if (!need) return undefined;
  return {
    slug,
    title: need.name,
    intro: need.intro,
    products: PRODUCTS.filter((p) => p.need === need.name),
    showBadge: false,
  };
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
