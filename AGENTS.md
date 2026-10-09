<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Catalog (categories, brands, products) lives in Supabase tables, read via the public `getCatalog` server fn and `catalogQuery`; pages read it with `useCatalog()`. Why: one source of truth, editable without code.
- Product images are stored as `image_key` in the DB and resolved by `imageFor()` in `src/lib/images.ts`. Why: images ship as bundled assets.
- Product and gallery keys resolve through a dedicated inspected asset map, separate from editorial/category imagery. Why: catalog imagery can be corrected consistently without altering product records.
- Cart is client-side (localStorage) in `CartProvider`. Why: no accounts yet.
- Auth uses Supabase Auth directly (external project); account routes live under `src/routes/_authenticated/` whose client-only gate redirects to `/login`. Why: user requirement, session lives in localStorage.
- Orders of signed-in customers are inserted client-side into `orders` (RLS own-rows) via `recordOrder`. Why: history without a payment backend yet.
