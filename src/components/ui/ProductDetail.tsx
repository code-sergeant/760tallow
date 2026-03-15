import { useEffect, useRef, useState } from 'react';
import type { ShopifyProduct } from '@/types/shopify';
import { productDetails } from '@/lib/productDetails';
import { useCart } from '@/hooks/useCart';
import { shopifyConfigured } from '@/lib/shopify'; // used in handleAddToCart guard
import Button from '@/components/ui/Button';

interface ProductDetailProps {
  product: ShopifyProduct | null;
  onClose: () => void;
}

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(parseFloat(amount));
}

export default function ProductDetail({ product, onClose }: ProductDetailProps) {
  const { addToCart, isLoading } = useCart();
  const [adding, setAdding] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen = product !== null;

  const detail = product ? productDetails[product.handle] : null;
  const variants = product?.variants.edges.map((edge) => edge.node) ?? [];
  const firstVariant = product?.variants.edges[0]?.node;
  const selectedVariant =
    product?.variants.edges.find((edge) => edge.node.id === selectedVariantId)?.node ?? firstVariant;
  const firstImage = product?.images.edges[0]?.node;
  const available = selectedVariant?.availableForSale ?? false;
  const hasVariantChoices =
    variants.length > 1 || (variants.length === 1 && variants[0].title !== 'Default Title');
  const richDescriptionHtml = product?.descriptionHtml?.trim();
  const description = product?.description?.trim() || detail?.fullDescription;

  useEffect(() => {
    setSelectedVariantId(firstVariant?.id ?? null);
  }, [product?.id, firstVariant?.id]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  async function handleAddToCart() {
    if (!selectedVariant || !available || !shopifyConfigured) return;
    setAdding(true);
    try {
      await addToCart(selectedVariant.id);
    } finally {
      setAdding(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-espresso/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — slides up on mobile, in from right on desktop */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={product?.title ?? 'Product details'}
        className={`fixed z-50 bg-sand flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          inset-x-0 bottom-0 top-16 rounded-t-2xl overflow-y-auto
          md:inset-y-0 md:right-0 md:left-auto md:w-[720px] md:max-w-[90vw] md:rounded-none md:shadow-2xl
          ${isOpen
            ? 'translate-y-0 md:translate-y-0 md:translate-x-0'
            : 'translate-y-full md:translate-y-0 md:translate-x-full'
          }`}
      >
        {/* Close bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-espresso/8">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-espresso transition-colors cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Lineup
          </button>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sage transition-colors cursor-pointer text-muted"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {product && (
          <div className="flex-1">
            {/* Image */}
            <div className="aspect-[4/3] md:aspect-[16/9] bg-sage overflow-hidden">
              {firstImage ? (
                <img
                  src={firstImage.url}
                  alt={firstImage.altText ?? product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    className="font-display text-espresso/8 select-none uppercase"
                    style={{ fontSize: 'clamp(120px, 20vw, 240px)', fontWeight: 900 }}
                  >
                    {product.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="px-6 py-8 md:px-10 md:py-10">

              {/* Header */}
              <div className="mb-6 pb-6 border-b border-espresso/8">
                {detail?.tagline && (
                  <p
                    className="font-label text-olive mb-3"
                    style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' }}
                  >
                    {detail.tagline}
                  </p>
                )}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <h1
                    className="font-display text-espresso"
                    style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em' }}
                  >
                    {product.title}
                  </h1>
                  {selectedVariant && (
                    <p
                      className="font-display text-espresso flex-shrink-0"
                      style={{ fontSize: '1.5rem', fontWeight: 700 }}
                    >
                      {formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              {richDescriptionHtml ? (
                <div
                  className="mb-10"
                  // Shopify admin controls this content; rendering as HTML preserves merchant formatting.
                  dangerouslySetInnerHTML={{ __html: richDescriptionHtml }}
                />
              ) : (
                description && (
                  <p className="text-muted leading-relaxed mb-8" style={{ fontSize: '0.975rem', lineHeight: 1.75 }}>
                    {description}
                  </p>
                )
              )}

              {/* Variant selector */}
              {hasVariantChoices && (
                <div className="mb-8">
                  <p
                    className="font-label text-espresso mb-3"
                    style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}
                  >
                    Choose Option
                  </p>
                  <div className="grid gap-2">
                    {variants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id;
                      const soldOut = !variant.availableForSale;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariantId(variant.id)}
                          disabled={soldOut}
                          className={`w-full rounded-lg border px-3 py-2 text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'border-rust bg-rust/5'
                              : 'border-espresso/15 hover:border-espresso/35'
                          } ${soldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-espresso">
                              {variant.title === 'Default Title' ? 'Standard' : variant.title}
                            </span>
                            <span className="text-sm font-medium text-espresso">
                              {formatPrice(variant.price.amount, variant.price.currencyCode)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {!richDescriptionHtml && detail?.benefits && detail.benefits.length > 0 && (
                <div className="mb-8">
                  <p
                    className="font-label text-espresso mb-4"
                    style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}
                  >
                    What it does
                  </p>
                  <ul className="space-y-2.5">
                    {detail.benefits.map((benefit) => (
                      <li key={benefit} className="flex gap-3 items-start">
                        <span
                          className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-rust"
                        />
                        <span className="text-sm text-muted leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ingredients */}
              {!richDescriptionHtml && detail?.ingredients && (
                <div className="mb-8 p-5 rounded-xl bg-sage">
                  <p
                    className="font-label text-espresso mb-2"
                    style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}
                  >
                    Full Ingredient List
                  </p>
                  <p className="text-sm text-muted leading-relaxed">{detail.ingredients}</p>
                </div>
              )}

              {/* How to use */}
              {!richDescriptionHtml && detail?.howToUse && (
                <div className="mb-10">
                  <p
                    className="font-label text-espresso mb-2"
                    style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}
                  >
                    How to Use
                  </p>
                  <p className="text-sm text-muted leading-relaxed">{detail.howToUse}</p>
                </div>
              )}

              {/* CTA */}
              <Button
                size="lg"
                className="w-full sm:w-auto"
                disabled={!selectedVariant || !available || adding || isLoading}
                onClick={handleAddToCart}
              >
                {adding ? 'Adding...' : available ? 'Add to Cart' : 'Sold Out'}
              </Button>

            </div>
          </div>
        )}
      </div>
    </>
  );
}
