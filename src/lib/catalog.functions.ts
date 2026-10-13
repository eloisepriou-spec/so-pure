import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

// Public read of the catalog (categories, brands, products). RLS allows anon SELECT only.
export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"]!;
  const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const [c, b, p] = await Promise.all([
    sb.from("categories").select("slug,name,intro,position").order("position"),
    sb.from("brands").select("slug,name,region,description").eq("status", "approved").order("name"),
    sb
      .from("products")
      .select("id,name,brand_slug,category_slug,form,price,rating,reviews,image_key,gallery_keys,tagline,description,composition,dosage,is_new,best_seller")
      .eq("status", "approved")
      .order("created_at"),
  ]);
  const err = c.error ?? b.error ?? p.error;
  if (err) throw new Error(err.message);
  return { categories: c.data ?? [], brands: b.data ?? [], products: p.data ?? [] };
});
