import { useEffect, useState } from 'react';
import type { ShopifyProduct } from '@/types/shopify';
import { fetchProducts, shopifyConfigured } from '@/lib/shopify';
import { useCart } from '@/hooks/useCart';
import ProductCard from '@/components/ui/ProductCard';

interface ProductCatalogProps {
  onSelectProduct: (product: ShopifyProduct) => void;
}

// Map Shopify product handles to the brand's CTA button labels
const ctaByHandle: Record<string, string> = {
  'solar-defense-bar': 'Shop Solar Defense',
  'original-cream': 'Shop Original Cream',
  'lip-nourishment-4-pack': 'Shop 4-Pack Bundle',
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white border border-sage overflow-hidden animate-pulse">
      <div className="aspect-square bg-sage" />
      <div className="p-6">
        <div className="h-5 bg-sage rounded mb-3 w-3/4" />
        <div className="h-3 bg-sage rounded mb-2 w-full" />
        <div className="h-3 bg-sage rounded mb-2 w-5/6" />
        <div className="h-3 bg-sage rounded mb-6 w-4/6" />
        <div className="flex justify-between items-center pt-4 border-t border-sage">
          <div className="h-5 bg-sage rounded w-16" />
          <div className="h-9 bg-sage rounded w-28" />
        </div>
      </div>
    </div>
  );
}

export default function ProductCatalog({ onSelectProduct }: ProductCatalogProps) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load products.');
        setLoading(false);
      });
  }, []);

  async function handleAddToCart(product: ShopifyProduct) {
    const firstAvailableVariant = product.variants.edges
      .map((edge) => edge.node)
      .find((variant) => variant.availableForSale);
    if (!firstAvailableVariant) return;
    if (!shopifyConfigured || firstAvailableVariant.id.startsWith('mock-')) {
      onSelectProduct(product);
      return;
    }
    setAddingProductId(product.id);
    try {
      await addToCart(firstAvailableVariant.id);
    } finally {
      setAddingProductId(null);
    }
  }

  return (
    <section id="the-lineup" className="bg-sand py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <p
            className="font-label text-rust font-medium"
            style={{
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            Products
          </p>
          <h2
            className="font-display text-espresso"
            style={{
              fontSize: 'clamp(36px, 5vw, 60px)',
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
            }}
          >
            The Lineup
          </h2>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => {
                const soldOut = !product.variants.edges.some((edge) => edge.node.availableForSale);
                return (
                <ProductCard
                  key={product.id}
                  product={product}
                  ctaLabel={ctaByHandle[product.handle] ?? 'Add to Cart'}
                  onSelect={() => onSelectProduct(product)}
                  onAddToCart={() => handleAddToCart(product)}
                  isAddingToCart={addingProductId === product.id}
                  isSoldOut={soldOut}
                />
                );
              })}
        </div>

        {!loading && !error && products.length === 0 && (
          <p className="text-muted text-center py-12">
            Products coming soon. Check back shortly.
          </p>
        )}
      </div>
    </section>
  );
}
