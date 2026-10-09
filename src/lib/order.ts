export const PROMO = "EQUILIBRE10";
export const shippingFor = (subtotal: number) => (subtotal >= 50 || subtotal === 0 ? 0 : 4.9);

export type Order = {
  ref: string;
  date: string;
  email: string;
  method: string;
  cardLast4?: string | undefined;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  lines: { id: string; name: string; brand: string; image: string; qty: number; months: 1 | 3; price: number }[];
};

const KEY = "sopure-last-order";
export const saveOrder = (o: Order) => sessionStorage.setItem(KEY, JSON.stringify(o));
export const loadOrder = (): Order | null => {
  try {
    const r = sessionStorage.getItem(KEY);
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
};

export const PROMO_KEY = "sopure-promo";

/** Persist the order to the signed-in customer's history (no-op when signed out). */
export async function recordOrder(o: Order) {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    await supabase.from("orders").insert({
      user_id: data.user.id,
      ref: o.ref,
      method: o.method,
      subtotal: o.subtotal,
      discount: o.discount,
      shipping: o.shipping,
      total: o.total,
      lines: o.lines.map(({ image: _i, ...l }) => l),
    });
  } catch (e) {
    console.error("recordOrder", e);
  }
}
