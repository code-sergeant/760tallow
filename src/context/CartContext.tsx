import {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type { ShopifyCart, ShopifyCartLine } from '@/types/shopify';
import * as shopify from '@/lib/shopify';

const STORAGE_KEY = '760t_cart_id';

// ─── State ────────────────────────────────────────────────────────────────────

interface CartState {
  cartId: string | null;
  checkoutUrl: string | null;
  lines: ShopifyCartLine[];
  totalQuantity: number;
  totalAmount: string;
  currencyCode: string;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cartId: null,
  checkoutUrl: null,
  lines: [],
  totalQuantity: 0,
  totalAmount: '0.00',
  currencyCode: 'USD',
  isOpen: false,
  isLoading: false,
  error: null,
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type CartAction =
  | { type: 'SET_CART'; payload: ShopifyCart }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'CLEAR_CART' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        cartId: action.payload.id,
        checkoutUrl: action.payload.checkoutUrl,
        lines: action.payload.lines.edges.map((e) => e.node),
        totalQuantity: action.payload.totalQuantity,
        totalAmount: action.payload.cost.totalAmount.amount,
        currencyCode: action.payload.cost.totalAmount.currencyCode,
        isLoading: false,
        error: null,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'CLEAR_CART':
      return { ...initialState, isOpen: state.isOpen };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue extends CartState {
  addToCart: (variantId: string) => Promise<void>;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Rehydrate cart from localStorage on mount
  useEffect(() => {
    const savedCartId = localStorage.getItem(STORAGE_KEY);
    if (!savedCartId) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    shopify
      .fetchCart(savedCartId)
      .then((cart) => {
        if (cart) {
          dispatch({ type: 'SET_CART', payload: cart });
        } else {
          localStorage.removeItem(STORAGE_KEY);
          dispatch({ type: 'CLEAR_CART' });
        }
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        dispatch({ type: 'CLEAR_CART' });
      });
  }, []);

  const addToCart = useCallback(
    async (variantId: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const cart = state.cartId
          ? await shopify.addToCart(state.cartId, variantId, 1)
          : await shopify.createCart(variantId, 1);

        localStorage.setItem(STORAGE_KEY, cart.id);
        dispatch({ type: 'SET_CART', payload: cart });
        dispatch({ type: 'OPEN_CART' });
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          payload: err instanceof Error ? err.message : 'Failed to add to cart',
        });
      }
    },
    [state.cartId]
  );

  const updateLine = useCallback(
    async (lineId: string, quantity: number) => {
      if (!state.cartId) return;
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const cart = await shopify.updateCartLine(state.cartId, lineId, quantity);
        dispatch({ type: 'SET_CART', payload: cart });
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          payload: err instanceof Error ? err.message : 'Failed to update cart',
        });
      }
    },
    [state.cartId]
  );

  const removeLine = useCallback(
    async (lineId: string) => {
      if (!state.cartId) return;
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const cart = await shopify.removeCartLine(state.cartId, lineId);
        dispatch({ type: 'SET_CART', payload: cart });
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          payload: err instanceof Error ? err.message : 'Failed to remove from cart',
        });
      }
    },
    [state.cartId]
  );

  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);

  return (
    <CartContext.Provider
      value={{ ...state, addToCart, updateLine, removeLine, openCart, closeCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
