import type { ShopifyProduct } from '@/types/shopify';
import Button from '@/components/ui/Button';

interface ProductCardProps {
  product: ShopifyProduct;
  ctaLabel?: string;
  onSelect?: () => void;
  onAddToCart?: () => void;
  isAddingToCart?: boolean;
  isSoldOut?: boolean;
}

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(parseFloat(amount));
}

export default function ProductCard({
  product,
  ctaLabel = 'Add to Cart',
  onSelect,
  onAddToCart,
  isAddingToCart = false,
  isSoldOut = false,
}: ProductCardProps) {
  const firstVariant = product.variants.edges[0]?.node;
  const firstImage = product.images.edges[0]?.node;

  return (
    <article
      className="flex flex-col bg-sage rounded-2xl overflow-hidden border border-olive/15 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      style={{ borderTop: '3px solid var(--color-rust)' }}
    >
      {/* Product image — clickable */}
      <button
        onClick={onSelect}
        className="aspect-square bg-sand overflow-hidden w-full text-left cursor-pointer"
        aria-label={`View details for ${product.title}`}
        tabIndex={0}
      >
        {firstImage ? (
          <img
            src={firstImage.url}
            alt={firstImage.altText ?? product.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="font-display text-espresso/10 select-none uppercase"
              style={{ fontSize: '80px', fontWeight: 900 }}
            >
              {product.title.charAt(0)}
            </span>
          </div>
        )}
      </button>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <button
          onClick={onSelect}
          className="text-left mb-2 cursor-pointer group"
        >
          <h3
            className="font-display text-espresso leading-snug group-hover:text-rust transition-colors"
            style={{ fontSize: '1.2rem', fontWeight: 700 }}
          >
            {product.title}
          </h3>
        </button>

        {product.description && (
          <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-3 flex-1">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-olive/15">
          {firstVariant ? (
            <p
              className="font-display text-espresso"
              style={{ fontSize: '1.1rem', fontWeight: 700 }}
            >
              {formatPrice(firstVariant.price.amount, firstVariant.price.currencyCode)}
            </p>
          ) : (
            <p className="text-sm text-muted">Price unavailable</p>
          )}

          <Button
            size="sm"
            onClick={onAddToCart ?? onSelect}
            disabled={isAddingToCart || isSoldOut}
          >
            {isAddingToCart ? 'Adding...' : isSoldOut ? 'Sold Out' : ctaLabel}
          </Button>
        </div>
      </div>
    </article>
  );
}
