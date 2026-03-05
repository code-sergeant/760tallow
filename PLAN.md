# Plan: Seven Sixty Tallow — Static Ecommerce Site

## Context
Build a static ecommerce site for Seven Sixty Tallow (San Diego tallow skincare brand) using React + Tailwind CSS v4 + Vite, deployed to GitHub Pages via GitHub Actions, with Shopify as the product/cart/checkout backend via the Storefront API. Site copy lives in `site-instructions.md`. No code exists yet — greenfield scaffold.

---

## Stack Decisions
- **Vite + React + TypeScript** — modern, fast, static-output
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin — no `tailwind.config.js`, no PostCSS config, single `@import "tailwindcss"` in CSS
- **`@shopify/storefront-api-client`** — official Shopify SDK (`shopify-buy` is EOL January 2026)
- **Storefront API version `2026-01`** — current stable
- **No React Router** — single scrolling page with HTML anchor links; avoids GitHub Pages 404.html complexity entirely
- **GitHub Actions + GitHub Pages** — `actions/deploy-pages@v4`, secrets injected as env vars at build time

---

## Project Structure

```
760tallow/
├── .env.example
├── .env.local                    # gitignored
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── .github/workflows/deploy.yml
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css                 # @import "tailwindcss"
    ├── types/shopify.ts          # All TypeScript interfaces
    ├── lib/shopify.ts            # Client singleton + all queries/mutations
    ├── context/CartContext.tsx   # useReducer cart state + localStorage
    ├── hooks/useCart.ts          # useContext convenience hook
    └── components/
        ├── layout/Nav.tsx        # Sticky nav, anchor links, CartIcon
        ├── layout/Footer.tsx     # Brand, tagline, legal disclaimer
        ├── sections/Hero.tsx
        ├── sections/Differentiator.tsx   # id="why-suet"
        ├── sections/ProductCatalog.tsx   # id="the-lineup", fetches Shopify
        ├── sections/Origins.tsx          # id="our-roots"
        ├── ui/ProductCard.tsx
        ├── ui/CartDrawer.tsx
        ├── ui/CartIcon.tsx
        └── ui/Button.tsx
```

---

## Environment Variables

`.env.local` (gitignored) and GitHub Secrets:
```
VITE_SHOPIFY_STORE_DOMAIN=760tallow.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=<public storefront token>
VITE_SHOPIFY_API_VERSION=2026-01
```

Vite bakes `VITE_*` vars into the static bundle at build time — safe and expected for public Storefront API tokens (read-only by design).

---

## Key File Designs

### `vite.config.ts`
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': '/src' } },
})
```

### `src/lib/shopify.ts`
- Singleton `createStorefrontApiClient` initialized from `import.meta.env.VITE_*` vars
- Guards against missing env vars on module load
- Exports typed async functions (no GraphQL in components):
  - `fetchProducts(): Promise<ShopifyProduct[]>`
  - `createCart(merchandiseId, quantity): Promise<ShopifyCart>`
  - `addToCart(cartId, merchandiseId, quantity): Promise<ShopifyCart>`
  - `updateCartLine(cartId, lineId, quantity): Promise<ShopifyCart>`
  - `removeCartLine(cartId, lineId): Promise<ShopifyCart>`
  - `fetchCart(cartId): Promise<ShopifyCart | null>` — for rehydration on app mount

GraphQL queries needed: `GET_PRODUCTS`, `GET_CART`, `CART_CREATE`, `CART_LINES_ADD`, `CART_LINES_UPDATE`, `CART_LINES_REMOVE`.

### `src/context/CartContext.tsx`
State shape:
```ts
{ cartId, checkoutUrl, lines, totalQuantity, isOpen, isLoading, error }
```
Actions: `SET_CART`, `SET_LOADING`, `SET_ERROR`, `OPEN_CART`, `CLOSE_CART`, `CLEAR_CART`

On provider mount: read `localStorage.getItem('760t_cart_id')` → call `fetchCart()` → dispatch `SET_CART` or `CLEAR_CART` (handles expired Shopify carts gracefully).
On `SET_CART`: persist `cart.id` to `localStorage` key `760t_cart_id`.

Cart add flow:
1. `ProductCard` calls `addToCart(variantId)` from `useCart()`
2. Context checks: `cartId` in state?
   - No → `shopify.createCart(variantId, 1)`
   - Yes → `shopify.addToCart(cartId, variantId, 1)`
3. Dispatch `SET_CART` + `OPEN_CART`

### `src/components/sections/ProductCatalog.tsx`
- Fetches `shopify.fetchProducts()` on mount
- Shows 3-card skeleton while loading
- Renders `<ProductCard />` per product

### Checkout Flow
CartDrawer "Checkout" button: `window.location.href = checkoutUrl` — redirects to Shopify-hosted checkout. Shopify handles payment; configure return URL in Shopify Admin.

---

## GitHub Actions — `.github/workflows/deploy.yml`

```yaml
on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run build
        env:
          VITE_SHOPIFY_STORE_DOMAIN: ${{ secrets.VITE_SHOPIFY_STORE_DOMAIN }}
          VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN: ${{ secrets.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN }}
          VITE_SHOPIFY_API_VERSION: ${{ secrets.VITE_SHOPIFY_API_VERSION }}
      - uses: actions/upload-pages-artifact@v3
        with: { path: './dist' }

  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
```

**GitHub Secrets required** (Settings → Secrets → Actions):
- `VITE_SHOPIFY_STORE_DOMAIN`
- `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `VITE_SHOPIFY_API_VERSION`

**GitHub Pages setting**: Source must be set to "GitHub Actions" (not branch-based deployment).

---

## CORS Registration (Shopify Admin)

Shopify Admin → Settings → Apps and sales channels → Headless → Manage → Storefront API → Allowed CORS origins. Register:
- Custom domain (e.g., `https://760tallow.com`)
- GitHub Pages URL as fallback during development

---

## Build Order (implementation sequence)

1. `package.json` + install deps
2. `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`
3. `index.html`, `src/main.tsx`, `src/index.css`
4. `src/types/shopify.ts`
5. `src/lib/shopify.ts`
6. `src/context/CartContext.tsx` + `src/hooks/useCart.ts`
7. `src/App.tsx` + layout components (`Nav`, `Footer`)
8. Static sections (`Hero`, `Differentiator`, `Origins`)
9. `src/components/ui/Button.tsx`, `CartIcon.tsx`, `ProductCard.tsx`
10. `src/components/sections/ProductCatalog.tsx`
11. `src/components/ui/CartDrawer.tsx`
12. `.github/workflows/deploy.yml` + `.env.example` + `.gitignore`
13. Update `CLAUDE.md` with commands, structure, Shopify integration notes

---

## Verification

1. `npm run dev` → site loads at localhost:5173, nav anchor links scroll correctly
2. Products load from Shopify in "The Lineup" section
3. "Shop Solar Defense" → cart drawer opens, item shown
4. Quantity +/- → updates line in Shopify cart
5. Remove item → line removed
6. "Checkout" → redirects to `checkoutUrl` (Shopify-hosted checkout)
7. `npm run build && npm run preview` → static build works at localhost:4173
8. Push to `main` → GitHub Actions builds and deploys; site live at Pages URL
9. `tsc --noEmit` → zero type errors

---

## Confirmed Decisions

- **Custom domain**: `base: '/'` in `vite.config.ts` is correct. Register the custom domain in GitHub Pages settings (Settings → Pages → Custom domain).
- **Shopify store already exists**: No store creation needed. Only prerequisite before running locally: create a Headless sales channel in Shopify Admin, generate a public Storefront API token with the required scopes, and add the custom domain to the CORS allowed origins list. Then populate `.env.local` with those credentials.
