import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { brandOf, formatPrice, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export function NeedBadge({ need }: { need: string }) {
  return (
    <span className="rounded-full bg-sage-soft px-2.5 py-0.5 text-[11px] font-medium text-sage-soft-foreground">
      {need}
    </span>
  );
}

export function ProductCard({ product, showBadge }: { product: Product; showBadge: boolean }) {
  const { add } = useCart();
  const brand = brandOf(product);
  return (
    <article className="group flex flex-col justify-between rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
      <Link to="/produit/$id" params={{ id: product.id }} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          <img
            src={product.image}
            alt={`${brand.name} - ${product.name}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {showBadge && (
            <span className="absolute left-3 top-3">
              <NeedBadge need={product.need} />
            </span>
          )}
        </div>
        <div className="micro-label mt-4 text-muted-foreground">{brand.name}</div>
        <h3 className="mt-1 text-sm font-semibold leading-snug">{product.name}</h3>
        <div className="mt-1.5 flex items-center gap-1 text-xs">
          <Star className="h-3.5 w-3.5 fill-foreground" />
          <span className="font-medium">{product.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({product.reviews})</span>
        </div>
      </Link>
      <div className="mt-5 flex items-center justify-between">
        <span className="font-bold">{formatPrice(product.price)}</span>
        <button
          onClick={() => {
            add(product.id);
            toast.success(`${product.name} ajouté au panier`);
          }}
          className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          + Ajouter
        </button>
      </div>
    </article>
  );
}

export function SectionHead({ title, link }: { title: string; link?: { to: string; params?: Record<string, string>; label?: string } }) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <h2 className="headline-editorial">{title}</h2>
      {link && (
        <Link to={link.to} params={link.params as never} className="text-xs font-medium hover:underline">
          {link.label ?? "Voir tout"} →
        </Link>
      )}
    </div>
  );
}
