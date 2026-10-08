import heroImg from "@/assets/hero.jpg";
import needSommeilImg from "@/assets/need-sommeil.jpg";
import needDigestionImg from "@/assets/need-digestion.jpg";
import needEnergieImg from "@/assets/need-energie.jpg";
import needFemininImg from "@/assets/need-feminin.jpg";
import journalImmuniteImg from "@/assets/journal-immunite.jpg";
import sommeilProfondImg from "@/assets/sommeil-profond.jpg";
import probiotiquesImg from "@/assets/probiotiques.jpg";
import magnesiumImg from "@/assets/magnesium.jpg";
import reishiImg from "@/assets/p-reishi.jpg";
import ashwagandhaImg from "@/assets/p-ashwagandha.jpg";
import omegaImg from "@/assets/p-omega.jpg";
import melisseImg from "@/assets/p-melisse.jpg";
import aubepineImg from "@/assets/p-aubepine.jpg";
import gallery1Img from "@/assets/p-gallery1.jpg";
import gallery2Img from "@/assets/p-gallery2.jpg";
import gallery3Img from "@/assets/p-gallery3.jpg";
import gallery4Img from "@/assets/p-gallery4.jpg";
import ashwaDropperImg from "@/assets/p-ashwa-dropper.jpg";
import omegaJarImg from "@/assets/p-omega-jar.jpg";

// Editorial / category imagery (all bundled).
export const IMG = {
  hero: heroImg,
  needSommeil: needSommeilImg,
  needDigestion: needDigestionImg,
  needEnergie: needEnergieImg,
  needFeminin: needFemininImg,
  journalImmunite: journalImmuniteImg,
  magnesium: magnesiumImg,
};

// Product and gallery keys resolve to inspected, text-free packaging — one distinct image per key.
const PRODUCT_IMAGES: Record<string, string> = {
  sommeilProfond: sommeilProfondImg,
  reishi: reishiImg,
  probiotiques: probiotiquesImg,
  omega: omegaImg,
  magnesium: magnesiumImg,
  ashwagandha: ashwagandhaImg,
  magGallery1: gallery1Img,
  magGallery2: gallery2Img,
  magGallery3: gallery3Img,
  magGallery4: gallery4Img,
  ashwaDropper: ashwaDropperImg,
  omegaJar: omegaJarImg,
  melisse: melisseImg,
  aubepine: aubepineImg,
};

export const imageFor = (key: string): string => PRODUCT_IMAGES[key] ?? magnesiumImg;
