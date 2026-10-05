import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { productById, type Product } from "./catalog";

export type CartLine = { id: string; qty: number; months: 1 | 3 };
export type CartItem = CartLine & { product: Product; unitPrice: number };

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (id: string, qty?: number, months?: 1 | 3) => void;
  setQty: (id: string, months: 1 | 3, qty: number) => void;
  remove: (id: string, months: 1 | 3) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "sopure-cart";

export const linePrice = (p: Product, months: 1 | 3) =>
  months === 3 ? Math.round(p.price * 3 * 0.9 * 100) / 100 : p.price;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, loaded]);

  const value = useMemo<CartCtx>(() => {
    const items = lines
      .map((l) => {
        const product = productById(l.id);
        return product ? { ...l, product, unitPrice: linePrice(product, l.months) } : null;
      })
      .filter(Boolean) as CartItem[];
    return {
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.qty * i.unitPrice, 0),
      add: (id, qty = 1, months = 1) =>
        setLines((ls) => {
          const ex = ls.find((l) => l.id === id && l.months === months);
          if (ex) return ls.map((l) => (l === ex ? { ...l, qty: l.qty + qty } : l));
          return [...ls, { id, qty, months }];
        }),
      setQty: (id, months, qty) =>
        setLines((ls) =>
          qty <= 0
            ? ls.filter((l) => !(l.id === id && l.months === months))
            : ls.map((l) => (l.id === id && l.months === months ? { ...l, qty } : l)),
        ),
      remove: (id, months) => setLines((ls) => ls.filter((l) => !(l.id === id && l.months === months))),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
