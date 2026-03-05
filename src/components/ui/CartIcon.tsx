import { useCart } from '@/hooks/useCart';

export default function CartIcon() {
  const { totalQuantity, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      aria-label={`Open cart${totalQuantity > 0 ? ` — ${totalQuantity} item${totalQuantity !== 1 ? 's' : ''}` : ''}`}
      className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-sage transition-colors cursor-pointer"
    >
      {/* Bag icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.75}
        stroke="currentColor"
        className="w-5 h-5 text-espresso"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993
             l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125
             0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974
             c.576 0 1.059.435 1.119 1.007z"
        />
      </svg>

      {totalQuantity > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-rust text-white text-[10px] font-bold flex items-center justify-center px-0.5 leading-none">
          {totalQuantity > 99 ? '99+' : totalQuantity}
        </span>
      )}
    </button>
  );
}
