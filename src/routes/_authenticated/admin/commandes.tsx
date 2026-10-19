import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Empty } from "@/components/site/admin";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/_authenticated/admin/commandes")({
  head: () => ({ meta: [{ title: "Commandes — Admin So Pure" }] }),
  component: AdminOrders,
});

type OrderLine = {
  id: string;
  name: string;
  brand: string;
  qty: number;
  months: number;
  price: number;
};
type OrderRow = {
  id: string;
  ref: string;
  user_id: string;
  method: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  created_at: string;
  lines: OrderLine[];
};

function useOrdersWithBreakdown() {
  return useQuery({
    queryKey: ["admin", "orders", "detail"],
    queryFn: async () => {
      const [ordersRes, brandsRes] = await Promise.all([
        supabase
          .from("orders")
          .select("id,ref,user_id,method,subtotal,shipping,discount,total,created_at,lines")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase.from("brands").select("name,commission_rate"),
      ]);
      if (ordersRes.error) throw ordersRes.error;
      if (brandsRes.error) throw brandsRes.error;

      const orders = ordersRes.data as unknown as OrderRow[];
      const rateByBrandName = new Map(brandsRes.data.map((b) => [b.name, b.commission_rate]));

      const userIds = [...new Set(orders.map((o) => o.user_id))];
      const profilesRes = userIds.length
        ? await supabase.from("profiles").select("id,first_name,last_name").in("id", userIds)
        : { data: [], error: null };
      if (profilesRes.error) throw profilesRes.error;
      const nameById = new Map(
        profilesRes.data.map((p) => [
          p.id,
          [p.first_name, p.last_name].filter(Boolean).join(" ") || "Client",
        ]),
      );

      return orders.map((o) => {
        const perBrand = new Map<string, number>();
        for (const l of o.lines)
          perBrand.set(l.brand, (perBrand.get(l.brand) ?? 0) + l.price * l.qty);
        const nBrands = perBrand.size || 1;
        const shippingShare = o.shipping / nBrands;
        const breakdown = [...perBrand.entries()].map(([brand, amount]) => {
          const rate = rateByBrandName.get(brand) ?? 15;
          const commission = (amount * rate) / 100;
          return {
            brand,
            amount,
            rate,
            commission,
            reversed: amount - commission + shippingShare,
          };
        });
        return { ...o, customer: nameById.get(o.user_id) ?? "Client", breakdown };
      });
    },
  });
}

function AdminOrders() {
  const q = useOrdersWithBreakdown();
  if (q.isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;
  if (!q.data?.length) return <Empty>Aucune commande pour le moment.</Empty>;

  return (
    <ul className="space-y-4">
      {q.data.map((o) => (
        <li key={o.id} className="rounded-xl border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">Commande {o.ref}</h2>
              <p className="micro-label mt-1 text-muted-foreground">
                {o.customer} · {new Date(o.created_at).toLocaleString("fr-FR")}
              </p>
            </div>
            <p className="font-serif text-2xl">{formatPrice(Number(o.total))}</p>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 font-medium">Marque</th>
                  <th className="py-2 font-medium">Vendu</th>
                  <th className="py-2 font-medium">Commission</th>
                  <th className="py-2 font-medium">Reversé (+ part livraison)</th>
                </tr>
              </thead>
              <tbody>
                {o.breakdown.map((b) => (
                  <tr key={b.brand} className="border-b last:border-0">
                    <td className="py-2">{b.brand}</td>
                    <td className="py-2">{formatPrice(b.amount)}</td>
                    <td className="py-2 text-muted-foreground">
                      {formatPrice(b.commission)} ({b.rate} %)
                    </td>
                    <td className="py-2 font-medium">{formatPrice(b.reversed)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </li>
      ))}
    </ul>
  );
}
