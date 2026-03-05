import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import type { ShopifyCart, ShopifyProduct } from '@/types/shopify';

const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined;
const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN as string | undefined;
const apiVersion = (import.meta.env.VITE_SHOPIFY_API_VERSION as string | undefined) ?? '2026-01';

/** True once real Shopify credentials are present. */
export const shopifyConfigured = Boolean(domain && token);

const client = shopifyConfigured
  ? createStorefrontApiClient({
      storeDomain: domain!,
      apiVersion,
      publicAccessToken: token!,
    })
  : null;

// ─── Mock data (used when Shopify credentials are not yet configured) ─────────

const MOCK_PRODUCTS: ShopifyProduct[] = [
  {
    id: 'mock-1',
    title: 'Solar Defense Bar',
    handle: 'solar-defense-bar',
    description:
      'Built for long days in the water and under the sun. We use non-nano zinc oxide to create a heavy-duty physical barrier against the elements. A dash of cacao powder knocks out that annoying white cast, and local wild San Diego beeswax keeps it locked on when you hit the surf.',
    images: { edges: [] },
    variants: {
      edges: [
        {
          node: {
            id: 'mock-variant-1',
            title: 'Default Title',
            availableForSale: true,
            price: { amount: '24.00', currencyCode: 'USD' },
          },
        },
      ],
    },
  },
  {
    id: 'mock-2',
    title: 'The Original Cream',
    handle: 'original-cream',
    description:
      'Your everyday skin armor. We whip our premium suet with pesticide-free olive oil from Temecula and organic jojoba. It handles dry patches, peeling skin, and windburn without making you feel like a grease slick.',
    images: { edges: [] },
    variants: {
      edges: [
        {
          node: {
            id: 'mock-variant-2',
            title: 'Default Title',
            availableForSale: true,
            price: { amount: '28.00', currencyCode: 'USD' },
          },
        },
      ],
    },
  },
  {
    id: 'mock-3',
    title: 'Lip Nourishment (4-Pack)',
    handle: 'lip-nourishment-4-pack',
    description:
      "Don't let your lips crack in the desert heat or salt air. This is a zero-water, ultra-hydrating formula built to stay put. Grab the 4-pack so you always have one in the truck, the beach bag, and your pocket.",
    images: { edges: [] },
    variants: {
      edges: [
        {
          node: {
            id: 'mock-variant-3',
            title: 'Default Title',
            availableForSale: true,
            price: { amount: '18.00', currencyCode: 'USD' },
          },
        },
      ],
    },
  },
];

// ─── GraphQL fragments & queries ──────────────────────────────────────────────

const CART_FIELDS = /* GraphQL */ `
  id
  checkoutUrl
  totalQuantity
  cost {
    totalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            product {
              title
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const GET_PRODUCTS = /* GraphQL */ `
  query GetProducts {
    products(first: 10) {
      edges {
        node {
          id
          title
          description
          handle
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

const GET_CART = /* GraphQL */ `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ${CART_FIELDS}
    }
  }
`;

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_ADD = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_UPDATE = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_REMOVE = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// ─── Helper ───────────────────────────────────────────────────────────────────

function assertNoErrors(errors: unknown, userErrors?: Array<{ message: string }>) {
  if (errors) {
    const msg = errors instanceof Error ? errors.message : 'Shopify API error';
    throw new Error(msg);
  }
  if (userErrors?.length) {
    throw new Error(userErrors[0].message);
  }
}

// ─── Exported API functions ───────────────────────────────────────────────────

export async function fetchProducts(): Promise<ShopifyProduct[]> {
  if (!client) return MOCK_PRODUCTS;
  try {
    const { data, errors } = await client.request(GET_PRODUCTS);
    assertNoErrors(errors);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any).products.edges.map((e: { node: ShopifyProduct }) => e.node);
  } catch {
    return MOCK_PRODUCTS;
  }
}

export async function fetchCart(cartId: string): Promise<ShopifyCart | null> {
  if (!client) return null;
  const { data, errors } = await client.request(GET_CART, { variables: { cartId } });
  assertNoErrors(errors);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any).cart as ShopifyCart | null;
}

export async function createCart(merchandiseId: string, quantity: number): Promise<ShopifyCart> {
  if (!client) throw new Error('store-not-configured');
  const { data, errors } = await client.request(CART_CREATE, {
    variables: { lines: [{ merchandiseId, quantity }] },
  });
  assertNoErrors(errors);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = (data as any).cartCreate;
  assertNoErrors(undefined, result.userErrors);
  return result.cart as ShopifyCart;
}

export async function addToCart(
  cartId: string,
  merchandiseId: string,
  quantity: number
): Promise<ShopifyCart> {
  if (!client) throw new Error('store-not-configured');
  const { data, errors } = await client.request(CART_LINES_ADD, {
    variables: { cartId, lines: [{ merchandiseId, quantity }] },
  });
  assertNoErrors(errors);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = (data as any).cartLinesAdd;
  assertNoErrors(undefined, result.userErrors);
  return result.cart as ShopifyCart;
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  if (!client) throw new Error('store-not-configured');
  const { data, errors } = await client.request(CART_LINES_UPDATE, {
    variables: { cartId, lines: [{ id: lineId, quantity }] },
  });
  assertNoErrors(errors);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = (data as any).cartLinesUpdate;
  assertNoErrors(undefined, result.userErrors);
  return result.cart as ShopifyCart;
}

export async function removeCartLine(cartId: string, lineId: string): Promise<ShopifyCart> {
  if (!client) throw new Error('store-not-configured');
  const { data, errors } = await client.request(CART_LINES_REMOVE, {
    variables: { cartId, lineIds: [lineId] },
  });
  assertNoErrors(errors);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = (data as any).cartLinesRemove;
  assertNoErrors(undefined, result.userErrors);
  return result.cart as ShopifyCart;
}
