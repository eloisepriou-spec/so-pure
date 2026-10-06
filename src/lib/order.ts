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
