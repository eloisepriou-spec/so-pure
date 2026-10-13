import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { PageShell } from "@/components/site/Layout";
import { fetchRole } from "@/lib/auth";

// UI gate only — the database (RLS + moderation trigger) enforces admin rights.
export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
    const role = await fetchRole(context.user.id);
    if (role !== "admin") throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { title: "Administration — So Pure" },
      { name: "description", content: "Espace d'administration So Pure : validation des marques et produits." },
      { property: "og:title", content: "Administration — So Pure" },
      { property: "og:description", content: "Modération du catalogue So Pure." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const tab = "border-b-2 border-transparent pb-2 text-sm text-muted-foreground hover:text-foreground";

function AdminLayout() {
  return (
    <PageShell>
      <div className="container-page py-10">
        <p className="micro-label text-muted-foreground">Administration</p>
        <nav className="mt-4 flex gap-6 border-b">
          <Link to="/admin" activeOptions={{ exact: true }} className={tab} activeProps={{ className: "!border-foreground !text-foreground font-medium" }}>Tableau de bord</Link>
          <Link to="/admin/marques" className={tab} activeProps={{ className: "!border-foreground !text-foreground font-medium" }}>Marques</Link>
          <Link to="/admin/produits" className={tab} activeProps={{ className: "!border-foreground !text-foreground font-medium" }}>Produits</Link>
        </nav>
        <div className="mt-8"><Outlet /></div>
      </div>
    </PageShell>
  );
}
