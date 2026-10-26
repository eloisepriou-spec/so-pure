import { createFileRoute, Outlet } from "@tanstack/react-router";

// Pathless layout for /marque/produits/*: the list lives at the index child
// (produits.index.tsx), submission and edition at their own child routes
// (produits.nouveau.tsx, produits.$id.tsx). Without this Outlet, those child
// routes match (the URL changes) but have nowhere to render.
export const Route = createFileRoute("/_authenticated/marque/produits")({
  component: () => <Outlet />,
});
