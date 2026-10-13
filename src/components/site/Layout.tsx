import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useCart } from "@/lib/cart";
import { useRole, useSession } from "@/lib/auth";

const MENU: { label: string; to: string; params?: Record<string, string> }[] = [
  { label: "Nouveautés", to: "/c/$slug", params: { slug: "nouveautes" } },
  { label: "Meilleures Ventes", to: "/c/$slug", params: { slug: "meilleures-ventes" } },
  { label: "Sommeil", to: "/c/$slug", params: { slug: "sommeil" } },
  { label: "Digestion", to: "/c/$slug", params: { slug: "digestion" } },
  { label: "Énergie", to: "/c/$slug", params: { slug: "energie" } },
  { label: "Santé Féminine", to: "/c/$slug", params: { slug: "sante-feminine" } },
  { label: "Longévité", to: "/c/$slug", params: { slug: "longevite" } },
  { label: "Marques", to: "/marques" },
];

export function Logo() {
  return (
    <Link to="/" className="text-2xl font-light tracking-tight text-foreground">
      So Pure
    </Link>
  );
}

function CartIcons() {
  const { count } = useCart();
  const { user } = useSession();
  const { isAdmin } = useRole();
  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <Link to="/admin" className="mr-1 text-xs uppercase tracking-wider text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
          Admin
        </Link>
      )}
      <button aria-label="Favoris" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted">
        <Heart className="h-5 w-5" />
      </button>
      <Link
        to={user ? "/compte" : "/login"}
        aria-label={user ? "Mon compte" : "Se connecter"}
        title={user ? "Mon compte" : "Se connecter"}
        className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
      >
        <User className="h-5 w-5" />
        {user && <span className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full bg-secondary ring-2 ring-background" />}
      </Link>
      <Link
        to="/panier"
        aria-label={`Panier (${count} articles)`}
        className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
      >
        <ShoppingBag className="h-5 w-5" />
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-semibold text-secondary-foreground">
          {count}
        </span>
      </Link>
    </div>
  );
}

export function Header({ minimal = false }: { minimal?: boolean | undefined }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Logo />
        {!minimal && (
          <form
            className="relative hidden max-w-2xl flex-1 md:block"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/recherche", search: { q } });
            }}
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Rechercher"
              placeholder="Je cherche un complément, une marque..."
              className="h-11 w-full rounded bg-card pl-10 pr-4 text-sm shadow-soft outline-none ring-1 ring-border placeholder:text-muted-foreground focus:ring-foreground"
            />
          </form>
        )}
        <CartIcons />
      </div>
      {!minimal && (
        <nav className="container-page hidden h-11 items-center justify-center gap-7 overflow-x-auto md:flex">
          {MENU.map((m) => (
            <Link
              key={m.label}
              to={m.to}
              params={m.params as never}
              className="whitespace-nowrap border-b border-transparent py-1 text-xs uppercase tracking-wider text-foreground/80 hover:text-foreground"
              activeProps={{ className: "!border-foreground !text-foreground font-medium" }}
            >
              {m.label}
            </Link>
          ))}
          <Link
            to="/journal"
            className="whitespace-nowrap border-b border-transparent py-1 font-serif text-sm italic text-foreground/80 hover:text-foreground"
            activeProps={{ className: "!border-foreground !text-foreground" }}
          >
            Journal
          </Link>
        </nav>
      )}
    </header>
  );
}

const FOOTER = [
  { title: "À propos & sélection", links: ["Notre Manifeste", "Charte de Pureté", "Laboratoires Partenaires", "Engagement Écologique"] },
  { title: "Aide & contact", links: ["Centre d'Aide & FAQ", "Livraisons & Retours", "Consultation Naturopathe", "Contactez-nous"] },
  { title: "Légal", links: ["Conditions Générales de Vente", "Mentions Légales", "Politique de Confidentialité", "Gestion des Cookies"] },
];

export function Footer() {
  const [sent, setSent] = useState(false);
  return (
    <footer className="mt-24 bg-muted">
      <div className="container-page grid gap-10 py-16 md:grid-cols-5">
        <div>
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Apothecary d'avant-garde. Une sélection rigoureuse de compléments purs, éthiques et traçables pour élever
            votre équilibre biologique.
          </p>
        </div>
        {FOOTER.map((c) => (
          <div key={c.title}>
            <h3 className="micro-label mb-4">{c.title}</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {c.links.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="micro-label mb-4">Réseaux & lettre</h3>
          <p className="text-sm text-muted-foreground">Rejoignez notre cercle privé de veille nutritionnelle.</p>
          {sent ? (
            <p className="mt-4 text-sm font-medium">Merci, vous êtes inscrit·e.</p>
          ) : (
            <form
              className="mt-4 flex"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <input
                type="email"
                required
                aria-label="Adresse e-mail"
                placeholder="Votre adresse e-mail"
                className="h-11 min-w-0 flex-1 rounded-l border bg-card px-3 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button className="h-11 rounded-r bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
                S'inscrire
              </button>
            </form>
          )}
          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
            <span>Instagram</span>
            <span>Substack</span>
          </div>
        </div>
      </div>
      <div className="container-page flex flex-col justify-between gap-2 border-t py-6 text-xs text-muted-foreground md:flex-row">
        <span>© 2026 So Pure. Tous droits réservés.</span>
        <span className="font-serif italic">Pureté Botanique & Rigueur Clinique</span>
      </div>
    </footer>
  );
}

export function PageShell({ children, minimal }: { children: ReactNode; minimal?: boolean | undefined }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header minimal={minimal} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function Crumbs({ items }: { items: { label: string; to?: string; params?: Record<string, string> }[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <Link to="/" className="hover:text-foreground">
        Accueil
      </Link>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-2">
          <span>/</span>
          {it.to ? (
            <Link to={it.to} params={it.params as never} className="hover:text-foreground">
              {it.label}
            </Link>
          ) : (
            <span className="font-semibold text-foreground">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
