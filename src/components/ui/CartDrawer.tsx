import { useEffect, useRef } from 'react';
import { useCart } from '@/hooks/useCart';
import Button from '@/components/ui/Button';

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(parseFloat(amount));
}

export default function CartDrawer() {
  const { isOpen, lines, totalQuantity, totalAmount, currencyCode, checkoutUrl,
    closeCart, updateLine, removeLine, isLoading, error } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-espresso/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl
          flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sage">
          <h2 className="font-bold text-espresso text-lg tracking-tight">
            Your Cart {totalQuantity > 0 && <span className="text-muted font-normal text-base">({totalQuantity})</span>}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sage transition-colors cursor-pointer text-espresso"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Cart lines */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-sage flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-muted">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
              </div>
              <p className="font-semibold text-espresso mb-1">Your cart is empty</p>
              <p className="text-sm text-muted">Add something from the lineup.</p>
              <button
                onClick={closeCart}
                className="mt-4 text-sm text-rust font-medium hover:underline cursor-pointer"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => {
                const img = line.merchandise.product.images.edges[0]?.node;
                const lineTotal = parseFloat(line.merchandise.price.amount) * line.quantity;
                return (
                  <li key={line.id} className="flex gap-4 py-4 border-b border-sage last:border-0">
                    {/* Thumbnail */}
                    <div className="w-18 h-18 flex-shrink-0 rounded-lg bg-sage overflow-hidden" style={{ width: 72, height: 72 }}>
                      {img ? (
                        <img src={img.url} alt={img.altText ?? line.merchandise.product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xl font-bold text-espresso/20 uppercase">
                            {line.merchandise.product.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-espresso text-sm leading-snug mb-0.5 truncate">
                        {line.merchandise.product.title}
                      </p>
                      {line.merchandise.title !== 'Default Title' && (
                        <p className="text-xs text-muted mb-2">{line.merchandise.title}</p>
                      )}

                      <div className="flex items-center justify-between">
                        {/* Quantity stepper */}
                        <div className="flex items-center border border-sage rounded-lg overflow-hidden">
                          <button
                            onClick={() => {
                              if (line.quantity <= 1) {
                                removeLine(line.id);
                              } else {
                                updateLine(line.id, line.quantity - 1);
                              }
                            }}
                            disabled={isLoading}
                            aria-label="Decrease quantity"
                            className="w-8 h-8 flex items-center justify-center text-espresso hover:bg-sage transition-colors disabled:opacity-40 cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                            </svg>
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-espresso">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => updateLine(line.id, line.quantity + 1)}
                            disabled={isLoading}
                            aria-label="Increase quantity"
                            className="w-8 h-8 flex items-center justify-center text-espresso hover:bg-sage transition-colors disabled:opacity-40 cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                          </button>
                        </div>

                        <p className="text-sm font-semibold text-espresso">
                          {formatPrice(lineTotal.toFixed(2), line.merchandise.price.currencyCode)}
                        </p>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeLine(line.id)}
                      disabled={isLoading}
                      aria-label="Remove item"
                      className="self-start mt-0.5 text-muted hover:text-rust transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div className="px-6 py-6 border-t border-sage">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted">Subtotal</p>
              <p className="font-bold text-espresso text-lg">
                {formatPrice(totalAmount, currencyCode)}
              </p>
            </div>
            <p className="text-xs text-muted mb-4">
              Taxes and shipping calculated at checkout.
            </p>
            <Button
              size="lg"
              className="w-full"
              disabled={!checkoutUrl || isLoading}
              onClick={() => {
                if (checkoutUrl) window.location.href = checkoutUrl;
              }}
            >
              {isLoading ? 'Updating...' : 'Checkout'}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
