# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Seven Sixty Tallow** is a tallow-based skincare brand based in San Diego, CA (the "760" area code). This repository is for building and maintaining their website. Currently contains site copy in `site-instructions.md`.

## Brand Voice & Copy Rules

- **Tone:** Relaxed, straightforward, educational. Coastal California "sun bum" grounded in facts.
- **Avoid:** Clinical jargon, marketing fluff (never use "miracle"), emojis in copy.
- **Key regulatory constraint:** Never use "Sunscreen" or "SPF." Use "Mineral Defense," "Sun Barrier," or "Outdoor Protection" instead.

## Products

1. **Solar Defense Bar** — zinc oxide mineral barrier with cacao powder (reduces white cast) and local San Diego beeswax
2. **The Original Cream** — suet whipped with Temecula olive oil and organic jojoba
3. **Lip Nourishment (4-Pack)** — zero-water, ultra-hydrating lip formula

## Key Brand Differentiator

760 Tallow uses **suet** (internal kidney fat), not "trim" (exterior muscle/hide fat). This is the central marketing claim:
- Suet is odorless; trim smells "beefy"
- Suet absorbs clean; trim sits on top of skin
- Suet has longer shelf life; trim goes rancid faster

## Ingredient Sourcing (Origin Points)

- Temecula, CA: pesticide-free, first-press olive oil
- San Diego, CA: wild-harvested local beeswax and honey
- Wyoming / California: pasture-raised, 100% pure beef suet

## Legal Disclaimer (always include in footer)

> These statements have not been evaluated by the FDA. These products are not intended to diagnose, treat, cure, or prevent any disease. The Solar Defense Bar is a physical mineral barrier, not an FDA-rated SPF sunscreen. Perform a patch test prior to full application.

## Design System

- Clean, easy to scan
- Strong contrasts, legible typography
- No synthetic fragrances or chemical stabilizers messaging is a key CTA element

## Tech Stack

- **Vite 6 + React 18 + TypeScript** (strict)
- **Tailwind CSS v4** via `@tailwindcss/vite` — custom colors defined in `src/index.css` `@theme` block (parchment, linen, espresso, rust, wheat, muted)
- **`@shopify/storefront-api-client` v1** — Storefront API `2026-01`
- Single scrolling page, no React Router — anchor nav only

## Dev Commands

```bash
npm run dev          # localhost:5173
npm run build        # requires VITE_SHOPIFY_* env vars
npm run preview      # preview dist at localhost:4173
npm run type-check   # tsc --noEmit (zero errors required)
```

## Environment Variables

Copy `.env.example` → `.env.local` before running locally:
- `VITE_SHOPIFY_STORE_DOMAIN` — e.g. `760tallow.myshopify.com`
- `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` — public storefront token
- `VITE_SHOPIFY_API_VERSION` — e.g. `2026-01`

## Project Structure

```
src/
├── lib/shopify.ts          # Shopify client + GraphQL queries
├── context/CartContext.tsx # Cart state (useReducer + localStorage)
├── hooks/useCart.ts        # Convenience hook
├── types/shopify.ts        # TypeScript interfaces
└── components/
    ├── layout/Nav.tsx
    ├── layout/Footer.tsx
    ├── sections/Hero.tsx
    ├── sections/Differentiator.tsx  # id="why-suet"
    ├── sections/ProductCatalog.tsx  # id="the-lineup"
    ├── sections/Origins.tsx         # id="our-roots"
    ├── ui/Button.tsx
    ├── ui/CartIcon.tsx
    ├── ui/CartDrawer.tsx
    └── ui/ProductCard.tsx
```

## Shopify Setup (before first deploy)

1. Create Headless sales channel in Shopify Admin
2. Generate public Storefront API token (needs cart + checkout read/write scopes)
3. Add domain(s) to CORS allowed origins
4. Add product descriptions from `site-instructions.md` to Shopify products
5. Match product handles to CTA labels in `src/components/sections/ProductCatalog.tsx`

## GitHub Pages Deploy

Push to `main` triggers `.github/workflows/deploy.yml`.
Required GitHub Secrets: `VITE_SHOPIFY_STORE_DOMAIN`, `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `VITE_SHOPIFY_API_VERSION`.
GitHub Pages source must be set to **"GitHub Actions"** (not branch).
